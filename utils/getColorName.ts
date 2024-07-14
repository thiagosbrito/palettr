// utils/getColorName.js
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const getColorName = async (colorHex: string) => {
    const prompt = `What is a good name for the color with hex code ${colorHex}?`;
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        max_tokens: 10,
    });

    return response.data.choices[0].text.trim();
};