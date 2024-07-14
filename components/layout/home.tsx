import Header from "@/components/layout/header";
import React from "react";

export default function HomeWrapper({ children}: {children: React.ReactNode }) {
    return (
        <div className="w-screen h-screen flex flex-col">
            <Header />
            {children}
        </div>
    )

}