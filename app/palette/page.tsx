'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {useCallback, useState} from "react";
import {HexColorPicker, HslaColorPicker, RgbaColorPicker} from "react-colorful";
import ColorValues from "@/components/layout/color-values";
import {generatePalette} from "@/app/actions";
import chroma from "chroma-js";

export default function PalettePage() {

    const [colorMode, setColorMode] = useState("rgb");
    const [baseColor, setBaseColor] = useState<any>(null)
    const [colorPalette, setColorPalette] = useState<string[]>([])

    const getColorName = useCallback(async (color: string) => {
        const {text} = await generatePalette(color)
        console.log(text);
    }, [])

    const getColorPalette = (color: string) => {
        const shades = (() => {
            const brightness = chroma(color).luminance();
            const brightenFactor = brightness < 0.2 ? 2.5 : brightness > 0.8 ? 1.5 : 2;
            const darkenFactor = brightness < 0.2 ? 1.5 : brightness > 0.8 ? 2.5 : 1.5;
            return chroma.scale([chroma(color).brighten(brightenFactor), color, chroma(color).darken(darkenFactor)]).colors(11);
        })();
        setColorPalette(shades);
    }

    return (
        <div className="flex flex-col flex-1 py-4">
            <div className="container">
                <div className="w-full space-y-4 text-center">
                    <h1 className="text-4xl font-bold">
                        How it works?
                    </h1>
                    <p className="w-full lg:w-7/12 mx-auto text-justify">
                        Palettr works by taking the color palette of your choice and generating a color palette that can
                        be
                        used in your Tailwindcss project. You can choose from already generated palettes from our
                        community or even create your own.
                    </p>
                    <p className="w-full lg:w-7/12 text-justify mx-auto">
                        You can export the generated palette to your <code>tailwind.config.ts</code> file or to you shadcn variables settings on your <code>style.css</code>, and <strong>it's free</strong>
                    </p>
                    <div className="w-fit mx-auto flex flex-col gap-y-4">
                        <h2 className="text-2xl font-bold">Create your own Palettes</h2>
                        <div className="border rounded-lg p-4">
                            <div className="flex flex-row justify-between items-center gap-x-6">
                                <h3 className="text-xl font-bold">Select the base color</h3>
                                <Select onValueChange={(value) => {
                                    setBaseColor(null);
                                    setColorMode(value);
                                }}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue defaultValue='rgb' placeholder='RGB'/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="hex"
                                                    className={colorMode === 'hex' ? 'font-bold' : ''}>HEX</SelectItem>
                                        {/*<SelectItem value="rgb"*/}
                                        {/*            className={colorMode === 'rgb' ? 'font-bold' : ''}>RGB</SelectItem>*/}
                                        <SelectItem value="hsl"
                                                    className={colorMode === 'hsl' ? 'font-bold' : ''}>HSL</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-row gap-x-3 py-2">
                                <div className="flex-1">
                                    {/*{colorMode === 'rgb' &&*/}
                                    {/*    <RgbaColorPicker onChange={(value) => getColorPalette(value)}/>}*/}
                                    {colorMode === 'hex' && <HexColorPicker onChange={(value) => getColorPalette(value)}/>}
                                    {colorMode === 'hsl' &&
                                        <HslaColorPicker onChange={(value) => setBaseColor(value)}/>}
                                </div>
                                <div className="flex-1">
                                    <ColorValues colorMode={colorMode} colorValues={baseColor}/>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="w-full min-h-20 rounded-xl">
                        {colorPalette.length === 0 && <div className="w-full min-h-20 items-center justify-center flex">Please select a base color first.</div>}
                        {colorPalette.length > 0 && (
                            <div className="w-full min-h-20 grid grid-cols-11 gap-x-1">
                                {colorPalette.map((color, index) => (
                                    <div key={index} className={`border rounded-md flex items-center justify-center h-20 text-white`} style={{ backgroundColor: color }}>{color}</div>                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

{/*<div className="w-full flex flex-col gap-y-4">*/}
{/*    <h2 className="text-2xl font-bold">Community Palettes</h2>*/}
{/*    <div className="w-full border rounded-2xl">*/}
{/*        <div*/}
{/*            className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 p-4 gap-2">*/}
{/*            <div className="grid grid-cols-3 border rounded-lg h-32 overflow-hidden">*/}
{/*                <div className="bg-lime-100"></div>*/}
{/*                <div className="bg-lime-200"></div>*/}
{/*                <div className="bg-lime-400"></div>*/}
{/*                <div className="bg-lime-600"></div>*/}
{/*                <div className="bg-lime-800"></div>*/}
{/*                <div className="bg-lime-900"></div>*/}
{/*            </div>*/}
{/*            <div className="grid grid-cols-3 border rounded-lg h-32 overflow-hidden">*/}
{/*                <div className="bg-blue-100"></div>*/}
{/*                <div className="bg-blue-200"></div>*/}
{/*                <div className="bg-blue-400"></div>*/}
{/*                <div className="bg-blue-600"></div>*/}
{/*                <div className="bg-blue-800"></div>*/}
{/*                <div className="bg-blue-900"></div>*/}
{/*            </div>*/}
{/*            <div className="grid grid-cols-3 border rounded-lg h-32 overflow-hidden">*/}
{/*                <div className="bg-pink-100"></div>*/}
{/*                <div className="bg-pink-200"></div>*/}
{/*                <div className="bg-pink-400"></div>*/}
{/*                <div className="bg-pink-600"></div>*/}
{/*                <div className="bg-pink-800"></div>*/}
{/*                <div className="bg-pink-900"></div>*/}
{/*            </div>*/}
{/*            <div className="grid grid-cols-3 border rounded-lg h-32 overflow-hidden">*/}
{/*                <div className="bg-orange-100"></div>*/}
{/*                <div className="bg-orange-200"></div>*/}
{/*                <div className="bg-orange-400"></div>*/}
{/*                <div className="bg-orange-600"></div>*/}
{/*                <div className="bg-orange-800"></div>*/}
{/*                <div className="bg-orange-900"></div>*/}
{/*            </div>*/}
{/*            <div className="grid grid-cols-3 border rounded-lg h-32 overflow-hidden">*/}
{/*                <div className="bg-gray-100"></div>*/}
{/*                <div className="bg-gray-200"></div>*/}
{/*                <div className="bg-gray-400"></div>*/}
{/*                <div className="bg-gray-600"></div>*/}
{/*                <div className="bg-gray-800"></div>*/}
{/*                <div className="bg-gray-900"></div>*/}
{/*            </div>*/}
{/*            <div className="grid grid-cols-3 border rounded-lg h-32 overflow-hidden">*/}
{/*                <div className="bg-slate-100"></div>*/}
{/*                <div className="bg-slate-200"></div>*/}
{/*                <div className="bg-slate-400"></div>*/}
{/*                <div className="bg-slate-600"></div>*/}
{/*                <div className="bg-slate-800"></div>*/}
{/*                <div className="bg-slate-900"></div>*/}
{/*            </div>*/}
{/*            <div className="grid grid-cols-3 border rounded-lg h-32 overflow-hidden">*/}
{/*                <div className="bg-cyan-100"></div>*/}
{/*                <div className="bg-cyan-200"></div>*/}
{/*                <div className="bg-cyan-400"></div>*/}
{/*                <div className="bg-cyan-600"></div>*/}
{/*                <div className="bg-cyan-800"></div>*/}
{/*                <div className="bg-cyan-900"></div>*/}
{/*            </div>*/}
{/*        </div>*/}
{/*    </div>*/}
{/*</div>*/}