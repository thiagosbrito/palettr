'use server';

import { createOpenAI } from '@ai-sdk/openai';
// import { createAnthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import {createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from "ai";
import { OpenAI } from 'openai'
// const openai = createOpenAI({
//     compatibility: 'strict',
//     apiKey: process.env.OPENAI_API_KEY
// });

// const anthropic = createAnthropic({
//     apiKey: process.env.ANTHROPIC_API_KEY
// });

const openai = new OpenAI({
    apiKey: process.env.AIML_API_KEY,
    baseURL: "https://api.aimlapi.com/",
})
interface Shade {
    hex: string;
    name?: string;
}

const getColorName = async (color: string) => {
    const response = await fetch('https://api.aimlapi.com/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${process.env.AIML_API_KEY}`
        },
        body: JSON.stringify({
            model: 'cognitivecomputations/dolphin-2.5-mixtral-8x7b',
            prompt: `
                Generate one single creative and descriptive name for the color ${color}.
                The name should be short (1-2 words) separated by a hyphen, in American English.
                Respond with only the name.
            `
        })
    })
}

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

export async function generatePaletteName(baseColor: string): Promise<{ text: string }> {
    const prompt = `
        Generate one single creative and descriptive name for the color ${baseColor}. 
        The name should be short (1-2 words) separated by a hyphen, in American English. 
        Respond with only the name.
    `;

    try {
        const { choices } = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{'role': 'user', 'content': prompt}],
        })

        // const { text } = await generateText({
        //     model: anthropic('claude-3-5-sonnet-20240620'),
        //     prompt
        // })
        // return {text};
        return { text: choices[0].message.content || ''};
    } catch (error) {
        console.error('Error generating color name:', error);
        throw new Error('Failed to generate color name');
    }
}