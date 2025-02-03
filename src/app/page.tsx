import CTA from "@/components/landing/cta";
import Feature from "@/components/landing/feature";
import Footer from "@/components/landing/footer";
import Hero from "@/components/landing/hero";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { Github } from "lucide-react";
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
                            <Github className="h-8 w-8 text-blue-400" />
                            <span className="ml-2 text-xl font-bold text-slate-100">GitInsight</span>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-slate-300 hover:text-slate-100">Features</a>
                            <a href="#pricing" className="text-slate-300 hover:text-slate-100">Pricing</a>
                            <a href="#about" className="text-slate-300 hover:text-slate-100">About</a>
                            <button className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition">
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <Hero />
            <Feature />
            <CTA />
            <Footer />
        </div>

    )
}
