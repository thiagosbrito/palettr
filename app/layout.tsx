import type { Metadata } from "next";
import { Lato as FontSans } from "next/font/google"
import "./globals.css";
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/providers/theme-provider";
import React from "react";
import HomeWrapper from "@/components/layout/home";

export const metadata: Metadata = {
	title: "Palettr - Generate Tailwindcss color palette and export to your tailwind.config.ts",
	description: "Generate Tailwindcss color palette and export to your tailwind.config.ts",
};

const fontSans = FontSans({
	weight: ["100", "300", "400", "700", "900"],
	display: "swap",
	variable: "--font-sans",
	subsets: ["latin"]
})

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={cn(
					"min-h-screen font-sans antialiased",
					fontSans.variable
				)}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<HomeWrapper>{children}</HomeWrapper>
				</ThemeProvider>
			</body>
		</html>
	);
}
