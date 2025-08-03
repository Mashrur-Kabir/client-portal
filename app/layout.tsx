import type { Metadata } from "next"
import { Montserrat, Quicksand } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"


const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
})

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-quicksand",
})

export const metadata: Metadata = {
  title: "ClientHub - Premium Client Portal",
  description: "Modern SaaS dashboard for freelancers and agencies",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${montserrat.variable} ${quicksand.variable}`}>
        {children}
        <Toaster /> {/* ✅ Toast gets mounted globally */}
      </body>
    </html>
  )
}
