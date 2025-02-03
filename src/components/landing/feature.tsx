'use client'
import { Brain, Github, Mic } from 'lucide-react'
import React from 'react'

const Feature = () => {
  return (
     
     <div id="features" className="py-20 bg-slate-900">
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       <div className="text-center mb-16">
         <h2 className="text-3xl font-bold text-slate-100 mb-4">
           Powerful Features for Modern Development Teams
         </h2>
         <p className="text-xl text-slate-300">
           Everything you need to analyze and improve your development process
         </p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         
         <div className="p-6 rounded-xl border border-slate-800 bg-slate-800/50 hover:border-blue-500/50 transition">
           <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
             <Github className="h-6 w-6 text-blue-400" />
           </div>
           <h3 className="text-xl font-semibold text-slate-100 mb-2">Git Integration</h3>
           <p className="text-slate-300">
             Seamlessly connect your repositories and start analyzing your codebase with our 
             powerful AI tools.
           </p>
         </div>

         
         <div className="p-6 rounded-xl border border-slate-800 bg-slate-800/50 hover:border-blue-500/50 transition">
           <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
             <Mic className="h-6 w-6 text-blue-400" />
           </div>
           <h3 className="text-xl font-semibold text-slate-100 mb-2">Meeting Analysis</h3>
           <p className="text-slate-300">
             Convert meeting recordings into actionable issues and tasks automatically using 
             advanced AI transcription.
           </p>
         </div>

         
         <div className="p-6 rounded-xl border border-slate-800 bg-slate-800/50 hover:border-blue-500/50 transition">
           <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
             <Brain className="h-6 w-6 text-blue-400" />
           </div>
           <h3 className="text-xl font-semibold text-slate-100 mb-2">AI Insights</h3>
           <p className="text-slate-300">
             Get intelligent suggestions and insights about your codebase, team productivity, 
             and project health.
           </p>
         </div>
       </div>
     </div>
   </div>
  )
}

export default Feature