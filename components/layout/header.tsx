import Image from "next/image";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {GithubIcon} from "lucide-react";
import {ModeToggle} from "@/components/layout/theme-toggle";

export default function Header() {
    return (
        <div className="w-full h-20 px-6 flex flex-row items-center justify-between sticky shadow-2xl shadow-black/5">
            <div className="">
                <Image
                    src="svg/logo_only.svg"
                    alt="logo"
                    width={150}
                    height={70}
                ></Image>
            </div>
            <nav className="flex-1 flex flex-row items-center justify-center center">
                <ul className="flex-row items-center gap-x-12 hidden md:flex">
                    <li>
                        <Link
                            className="font-sans font-semibold text-lg"
                            href={"/palette"}
                        >
                            Color Palette
                        </Link>
                    </li>
                    <li>
                        <Link
                            className="font-sans font-semibold text-lg"
                            href={"/gradient"}
                        >
                            Generate Gradient
                        </Link>
                    </li>
                </ul>
            </nav>
            <div className="flex flex-row gap-x-3">
                {/*<Button*/}
                {/*    className="gap-x-2"*/}
                {/*>*/}
                {/*    <GithubIcon size={18}/>*/}
                {/*    <span className="hidden md:inline-block">*/}
                {/*        Sign In with GitHub*/}
                {/*    </span>*/}
                {/*</Button>*/}
                <ModeToggle/>
            </div>
        </div>
    )
}