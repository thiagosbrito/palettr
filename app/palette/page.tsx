'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useCallback, useEffect, useState } from "react";
import { HexColorPicker, HslaColorPicker, RgbaColorPicker } from "react-colorful";
import ColorValues from "@/components/layout/color-values";
import { generatePaletteName } from "@/app/actions";
import chroma from "chroma-js";
import { CameraIcon, CopyIcon, ShareIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import useDebounce from "@/hooks/useDebounce";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";

export default function PalettePage() {

    const [open, setOpen] = useState(false);
    const [colorMode, setColorMode] = useState("hex");
    const [baseColor, setBaseColor] = useState<any>(null)
    const [colorPalette, setColorPalette] = useState<string[]>([])
    const [colorName, setColorName] = useState('')
    const debouncedColor = useDebounce(baseColor, 500);

    const getColorName = useCallback(async (color: string) => {
        const { text } = await generatePaletteName(color)
        setColorName(String(text).toLowerCase());
        console.log(text);
    }, [])

    const openSheet = () => {
        setOpen(true);
    }

    const getColorPalette = (color: string) => {
        setBaseColor(color);
        getColorName(color).then();

        const [h, s, l] = chroma(color).hsl();

        const minLightness = 0.25;
        const maxLightness = 0.80;

        const totalColors = 11;
        const index = Math.round((l - minLightness) / (maxLightness - minLightness) * (totalColors - 1));

        const colors = [];

        for (let i = 0; i < totalColors; i++) {
            let lightness;

            if (i < index) {
                lightness = minLightness + (i / index) * (l - minLightness);
            } else {
                lightness = l + ((i - index) / (totalColors - index - 1)) * (maxLightness - l);
            }

            lightness = Math.max(minLightness, Math.min(maxLightness, lightness));
            colors.push(chroma(h, s, lightness, 'hsl').hex());
        }

        setColorPalette(colors.reverse());
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
                        You can export the generated palette to your <code>tailwind.config.ts</code> file or to you shadcn variables settings on your <code>style.css</code>, and <strong>it&apos;s free</strong>
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
                                        <SelectValue defaultValue='hex' placeholder='HEX' />
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
                                    {colorMode === 'hex' && <HexColorPicker onChange={(value) => getColorPalette(value)} />}
                                    {colorMode === 'hsl' &&
                                        <HslaColorPicker onChange={(value) => setBaseColor(value)} />}
                                </div>
                                <div className="flex-1">
                                    <ColorValues colorMode={colorMode} colorValues={baseColor} />
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="w-full min-h-20 rounded-xl">
                        {colorPalette.length === 0 && <div className="w-full min-h-20 items-center justify-center flex">Please select a base color first.</div>}
                        {colorPalette.length > 0 && (
                            <>
                                <div className="w-full py-2 lg:text-left">
                                    <span className="text-lg font-bold">{colorName}</span>
                                </div>
                                <div className="w-full min-h-20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-11 gap-1">
                                    {colorPalette.map((color, index) => (
                                        <div key={index} className={`border rounded-md flex items-center justify-center h-20 text-white`} style={{ backgroundColor: color }}>{color}</div>))}
                                        <div className="h-20  flex items-center gap-x-2 justify-center text-primary">
                                            {/* <CopyIcon className="size-6 text-gray-400" /> */}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger className="flex gap-x-2 items-center bg-primary rounded-md p-2 text-primary-foreground">
                                                    <ShareIcon size={18} className="text-gray-400" />
                                                    Export
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuLabel>Export to...</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onSelect={() => openSheet()}>
                                                        tailwind.config.js
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem disabled={true} onSelect={() => openSheet()}>
                                                        shadcn global css
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <Sheet onOpenChange={setOpen} open={open}>
                                                <SheetContent>
                                                    <SheetHeader>
                                                        <SheetTitle>Export your palette to your tailwind.config.js</SheetTitle>
                                                        <SheetDescription>
                                                            Copy the code bellow and paste it into your
                                                            tailwind.config.js file.
                                                        </SheetDescription>
                                                    </SheetHeader>
                                                    <div className="w-full grid gap-4 py-4">
                                                        <pre className="bg-gray-200 p-2 rounded-md border border-gray-400 text-wrap">
                                                            &#x7B;<br />
                                                            &nbsp;&nbsp; // ... <br />
                                                            &nbsp;&nbsp;extend: &#x7B;<br/>
                                                            &nbsp;&nbsp;&nbsp;&nbsp;colors: &#x7B;<br/>
                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&apos;{colorName}&apos;: &#x7B; <br/>
                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&apos;50&apos;: {colorPalette[0]},<br/>
                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&apos;100&apos;: {colorPalette[1]},<br/>
                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&apos;200&apos;: {colorPalette[2]},<br/>
                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&apos;300&apos;: {colorPalette[3]},<br/>
                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&apos;400&apos;: {colorPalette[4]},<br/>
                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&apos;500&apos;: {colorPalette[5]},<br/>
                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&apos;600&apos;: {colorPalette[6]},<br/>
                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&apos;700&apos;: {colorPalette[7]},<br/>
                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&apos;800&apos;: {colorPalette[8]},<br/>
                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&apos;900&apos;: {colorPalette[9]},<br/>
                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&apos;950&apos;: {colorPalette[10]},<br/>
                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#x7D;<br />
                                                            &nbsp;&nbsp;&nbsp;&nbsp;&#x7D;<br />
                                                            &nbsp;&nbsp;&#x7D;<br />
                                                            &#x7D;
                                                        </pre>
                                                    </div>
                                                </SheetContent>
                                                {/*<SheetContent>*/}
                                                {/*    <SheetTitle>*/}
                                                {/*        Export your palette to your tailwind.config.js*/}
                                                {/*    </SheetTitle>*/}
                                                {/*</SheetContent>*/}
                                            </Sheet>
                                        </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

{/*<div className="w-full flex flex-col gap-y-4">*/ }
{/*    <h2 className="text-2xl font-bold">Community Palettes</h2>*/ }
{/*    <div className="w-full border rounded-2xl">*/ }
{/*        <div*/ }
{/*            className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 p-4 gap-2">*/ }
{/*            <div className="grid grid-cols-3 border rounded-lg h-32 overflow-hidden">*/ }
{/*                <div className="bg-lime-100"></div>*/ }
{/*                <div className="bg-lime-200"></div>*/ }
{/*                <div className="bg-lime-400"></div>*/ }
{/*                <div className="bg-lime-600"></div>*/ }
{/*                <div className="bg-lime-800"></div>*/ }
{/*                <div className="bg-lime-900"></div>*/ }
{/*            </div>*/ }
{/*            <div className="grid grid-cols-3 border rounded-lg h-32 overflow-hidden">*/ }
{/*                <div className="bg-blue-100"></div>*/ }
{/*                <div className="bg-blue-200"></div>*/ }
{/*                <div className="bg-blue-400"></div>*/ }
{/*                <div className="bg-blue-600"></div>*/ }
{/*                <div className="bg-blue-800"></div>*/ }
{/*                <div className="bg-blue-900"></div>*/ }
{/*            </div>*/ }
{/*            <div className="grid grid-cols-3 border rounded-lg h-32 overflow-hidden">*/ }
{/*                <div className="bg-pink-100"></div>*/ }
{/*                <div className="bg-pink-200"></div>*/ }
{/*                <div className="bg-pink-400"></div>*/ }
{/*                <div className="bg-pink-600"></div>*/ }
{/*                <div className="bg-pink-800"></div>*/ }
{/*                <div className="bg-pink-900"></div>*/ }
{/*            </div>*/ }
{/*            <div className="grid grid-cols-3 border rounded-lg h-32 overflow-hidden">*/ }
{/*                <div className="bg-orange-100"></div>*/ }
{/*                <div className="bg-orange-200"></div>*/ }
{/*                <div className="bg-orange-400"></div>*/ }
{/*                <div className="bg-orange-600"></div>*/ }
{/*                <div className="bg-orange-800"></div>*/ }
{/*                <div className="bg-orange-900"></div>*/ }
{/*            </div>*/ }
{/*            <div className="grid grid-cols-3 border rounded-lg h-32 overflow-hidden">*/ }
{/*                <div className="bg-gray-100"></div>*/ }
{/*                <div className="bg-gray-200"></div>*/ }
{/*                <div className="bg-gray-400"></div>*/ }
{/*                <div className="bg-gray-600"></div>*/ }
{/*                <div className="bg-gray-800"></div>*/ }
{/*                <div className="bg-gray-900"></div>*/ }
{/*            </div>*/ }
{/*            <div className="grid grid-cols-3 border rounded-lg h-32 overflow-hidden">*/ }
{/*                <div className="bg-slate-100"></div>*/ }
{/*                <div className="bg-slate-200"></div>*/ }
{/*                <div className="bg-slate-400"></div>*/ }
{/*                <div className="bg-slate-600"></div>*/ }
{/*                <div className="bg-slate-800"></div>*/ }
{/*                <div className="bg-slate-900"></div>*/ }
{/*            </div>*/ }
{/*            <div className="grid grid-cols-3 border rounded-lg h-32 overflow-hidden">*/ }
{/*                <div className="bg-cyan-100"></div>*/ }
{/*                <div className="bg-cyan-200"></div>*/ }
{/*                <div className="bg-cyan-400"></div>*/ }
{/*                <div className="bg-cyan-600"></div>*/ }
{/*                <div className="bg-cyan-800"></div>*/ }
{/*                <div className="bg-cyan-900"></div>*/ }
{/*            </div>*/ }
{/*        </div>*/ }
{/*    </div>*/ }
{/*</div>*/ }