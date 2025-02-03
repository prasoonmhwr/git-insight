'use client'
import React from 'react'

const CTA = () => {
    return (
        <div className="bg-gray-900 py-20">
            <div className="relative lg:block max-w-6xl mx-auto">
                <div className="relative rounded-lg border border-slate-700 bg-slate-800/50 backdrop-blur-sm p-2 shadow-2xl h-96">
                    <div className="grid lg:grid-cols-2 gap-12 items-center h-full">
                        <div className="mt-6 p-4 h-full space-y-4 flex flex-col justify-center items-center">
                            <h2 className="text-3xl font-bold text-gray-200 mb-2">
                                Transform your development with GitInsight
                            </h2>
                            <p className="text-slate-400 mb-8">
                                Join thousands of teams already using GitInsight to improve their workflow.
                            </p>
                        </div>
                        <div> Yes</div>
                    </div>
                </div>
                <div className="absolute top-4 -right-4 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"></div>
                <div className="absolute -top-6 -left-6 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl"></div>
            </div>
        </div>
    )
}

export default CTA