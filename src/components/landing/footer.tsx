'use client'
import React from 'react'

const Footer = () => {
    return (
        <footer className="bg-slate-950 text-slate-400 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className='flex flex-col sm:flex-row px-4 justify-between'>
                    <div className='text-3xl font-bold sm:text-5xl/[1.2] text-slate-100 py-4 px-4 min-w-20 max-w-[50%] '>Start Analyzing Repos with GitInsight</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 sm:grid-cols-1 gap-8">
                        <div>
                            <h3 className="text-slate-100 font-semibold mb-4">Product</h3>
                            <ul className="space-y-2">
                                <li><a href="#home" className="hover:text-slate-100">Home</a></li>
                                <li><a href="#features" className="hover:text-slate-100">Features</a></li>
                                <li><a href="#faq" className="hover:text-slate-100">FAQ</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-slate-100 font-semibold mb-4">General</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-slate-100">Docs</a></li>
                                <li><a href="#" className="hover:text-slate-100">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-slate-100">Terms</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* <div className="mt-8 pt-8 border-t border-slate-800 text-center">
            <p>© {new Date().getFullYear()} GitInsight. All rights reserved.</p>
          </div> */}
            </div>
        </footer>
    )
}

export default Footer