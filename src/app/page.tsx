import CTA from "@/components/landing/cta";
import FAQ from "@/components/landing/faq";
import Feature from "@/components/landing/feature";
import Footer from "@/components/landing/footer";
import Hero from "@/components/landing/hero";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";


export default async function Home() {
    const { userId } = await auth()
    if (userId) {
        redirect('/dashboard')
    }
    return (

        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
            
            <nav className="fixed w-full bg-slate-900/80 backdrop-blur-md z-50 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Image src="/logo2.svg" height={30} width={30} alt="logo"/>
                            <span className="pl-2 text-xl font-bold tracking-tighter text-white" >Git</span>
                            <span className="text-transparent text-xl font-bold bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600"> Insight </span>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#home" className="text-slate-300 hover:text-slate-100">Home</a>
                            <a href="#features" className="text-slate-300 hover:text-slate-100">Features</a>
                            <a href="#faq" className="text-slate-300 hover:text-slate-100">FAQ</a>
                            <Link href="/dashboard">
                            <button className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition">
                                Get Started
                            </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
            <Hero />
            <Feature />
            <FAQ />
            <CTA />
            <Footer />
        </div>

    )
}
