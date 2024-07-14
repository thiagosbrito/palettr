'use server';

import { google } from '@ai-sdk/google';
import { generateText } from "ai";

const hexToHSL = (hex: string) => {
    console.log(hex);
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
            default: h = 0; // Add a default case to handle any unexpected values
        }
        h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
};

const hslToHex = (h: number, s: number, l: number) => {
    // Ensure h, s, and l are valid numbers
    h = isNaN(h) ? 0 : h;
    s = isNaN(s) ? 0 : s;
    l = isNaN(l) ? 0 : l;

    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
};

const generateShades = (baseColor: string) => {
    const shades: any = {};
    const hsl = hexToHSL(baseColor);

    const shadeNames = [
        "50", "100", "200", "300", "400", "500", "600", "700", "800", "900"
    ];

    for (let i = 0; i < 10; i++) {
        const lightness = 98 - i * 9.8;
        const hex = hslToHex(hsl.h, hsl.s, lightness);
        shades[shadeNames[i]] = {
            hex,
            name: '' // We'll fill this in with Gemini
        };
    }

    return shades;
};

export async function generatePalette(baseColor: any) {
    const shades = generateShades(baseColor);

    // Generate names for all shades in a single API call
    const hexValues = Object.values(shades).map((shade: any) => shade.hex);
    const prompt = `Generate creative and descriptive names for the following colors (hex values): ${hexValues.join(', ')}. Each name should be short (1 word) and evocative. Return the names as a comma-separated list, in the same order as the input colors.`;

    try {
        const { text } = await generateText({
            model: google('models/gemini-pro'),
            prompt: prompt
        })

        if (text) {
            console.log(text);
        }
        // const model = genAI.languageModel('models/gemini-pro')
        // const result = await model.doGenerate({
        //     inputFormat: 'prompt',
        //     prompt: [prompt]
        // });
        // const colorNames = result.response.text().trim().split(',').map(name => name.trim());
        //
        // // Assign names to shades
        // Object.keys(shades).forEach((shade, index) => {
        //     shades[shade].name = colorNames[index] || 'Unnamed';
        // });
        //
        // return shades;
    } catch (error) {
        console.error('Error generating color names:', error);
        return Object.fromEntries(
            Object.entries(shades).map(([shade, { hex }]: any) => [shade, { hex, name: 'Unnamed' }])
        );
    }
}