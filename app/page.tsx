'use client';
import Image from "next/image";
import {ModeToggle} from "@/components/layout/theme-toggle";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ArrowRight, GithubIcon} from "lucide-react";
import {useTheme} from "next-themes";
import Header from "@/components/layout/header";

export default function Home() {
    const { theme } = useTheme();
    return (
        <>
            <div className="flex-1 flex flex-col items-center justify-center gap-y-6">
                <div className="flex flex-col gap-y-6 text-center">
                    <h1 className="font-sans font-bold text-4xl">
                        Welcome to
                        <span className="ml-2 font-extrabold text-transparent text-5xl bg-clip-text bg-gradient-to-br from-orange-400 to-pink-600">Palettr</span>
                    </h1>
                    <p className="text-lg">Generate Tailwindcss color palette and export to your <code className="bg-background text-base px-1 py-0.5">tailwind.config.ts</code></p>
                </div>
                <div className="flex flex-row items-center">
                    <Button className="uppercase gap-x-2 font-semibold">
                        get started
                        <ArrowRight size={18} />
                    </Button>
                </div>
            </div>
            <div className="w-full mt-auto">
                <div className="text-center py-1">
                    developed by
                    <span className="text-blue-300 ml-1 font-semibold">@brito_dev</span>
                </div>
            </div>
        </>

    );
}
