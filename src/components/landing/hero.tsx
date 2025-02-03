'use client'
import { ArrowRight, Brain, CheckCircle, Code, GitBranch } from 'lucide-react'
import React from 'react'

const Hero = () => {
    const [isHovered, setIsHovered] = React.useState(false);
  return (
    <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-1/4 -top-1/4 w-1/2 h-1/2 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -left-1/4 -bottom-1/4 w-1/2 h-1/2 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute top-0 left-0 w-full h-full bg-slate-950/50" />
        </div>

        <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-left space-y-8">
                <div className="inline-flex items-center px-4 py-2 rounded-full border border-slate-700 bg-slate-800/50 text-slate-300">
                  <span className="flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  New: AI Code Review Feature
                </div>
                
                <h1 className="text-6xl font-bold text-slate-100 leading-tight">
                  Transform Git Projects with
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600"> AI-Powered </span>
                  Insights
                </h1>

                <p className="text-xl text-slate-300">
                  Revolutionize your development workflow with AI-powered repository analysis, 
                  automated issue generation from meetings, and intelligent project insights.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="group relative px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center"
                  >
                    <span className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-200"></span>
                    <span className="relative flex items-center">
                      Start Analysing
                      <ArrowRight className={`ml-2 h-5 w-5 transition-transform duration-200 ${isHovered ? 'translate-x-1' : ''}`} />
                    </span>
                  </button>
                  
                  <button className="px-8 py-4 rounded-lg border border-slate-700 text-slate-300 hover:border-slate-600 hover:text-slate-100 hover:bg-slate-800/30 transition-all duration-200 flex items-center justify-center">
                    View Demo
                  </button>
                </div>

                {/* <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-800">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-blue-400" />
                    <span className="text-slate-300">Free 14-day trial</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-blue-400" />
                    <span className="text-slate-300">No credit card</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-blue-400" />
                    <span className="text-slate-300">Cancel anytime</span>
                  </div>
                </div> */}
              </div>

              {/* Right Content - Feature Preview */}
              <div className="relative lg:block">
                <div className="relative rounded-lg border border-slate-700 bg-slate-800/50 backdrop-blur-sm p-2 shadow-2xl">
                  <div className="absolute top-2 left-2 flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  
                  <div className="mt-6 p-4 space-y-4">
                    <div className="flex items-center space-x-4 p-3 rounded-lg bg-slate-700/50">
                      <GitBranch className="h-6 w-6 text-blue-400" />
                      <div className="flex-1">
                        <div className="h-2 w-1/2 bg-slate-600 rounded"></div>
                        <div className="mt-1 h-2 w-3/4 bg-slate-600 rounded"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-3 rounded-lg bg-blue-500/20">
                      <Brain className="h-6 w-6 text-blue-400" />
                      <div className="flex-1">
                        <div className="h-2 w-2/3 bg-blue-400/30 rounded"></div>
                        <div className="mt-1 h-2 w-1/2 bg-blue-400/30 rounded"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-3 rounded-lg bg-slate-700/50">
                      <Code className="h-6 w-6 text-blue-400" />
                      <div className="flex-1">
                        <div className="h-2 w-3/4 bg-slate-600 rounded"></div>
                        <div className="mt-1 h-2 w-1/2 bg-slate-600 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-blue-400/20 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Hero