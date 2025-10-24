import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import RedirectHandler from "./components/redirect-handler";
import { getSession } from "./lib/session";
import { Providers } from "./providers";
import "./styles/globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Criador de Criptomoedas",
  description: "Projeto criado por alunos do CPM 2025 - Mostra cultural",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  return (
    <html lang="en">
      <body
        className={`${interTight.variable} ${inter.variable} antialiased dark text-foreground bg-background`}
      >
        <Providers>
          <RedirectHandler session={session} />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
