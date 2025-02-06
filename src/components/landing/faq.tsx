'use client'
import React from 'react'
import { ChevronDown } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
const FAQ = () => {


    const faqs = [
        {
            question: "What is GitInsight and how does it work?",
            answer: "GitInsight is an AI-powered analytics platform that helps teams understand and improve their development workflow. It analyzes your Git repository data and meeting recordings to provide actionable insights and automated issue tracking."
        },
        {
            question: "How does GitInsight analyze meeting recordings?",
            answer: "GitInsight uses advanced AI models to transcribe and analyze meeting recordings, automatically identifying action items, decisions, and potential issues. It then creates structured tickets and links them to relevant code sections in your repository."
        },
        {
            question: "Is my code and meeting data secure?",
            answer: "Yes, we take security seriously. Your code repositories are accessed securely through Git provider APIs, and meeting recordings are stored on Firebase, Google's secure cloud platform. Firebase provides enterprise-grade security with data encryption at rest and in transit, automated backups, and compliance with industry standards. We implement additional security measures including access controls and authentication to ensure your data remains protected."
        },
        // {
        //     question: "Can GitInsight integrate with my existing tools?",
        //     answer: "Yes, GitInsight seamlessly integrates with popular development tools including GitHub, GitLab, Jira, Slack, and major video conferencing platforms. We're constantly adding new integrations based on user feedback."
        // },
        {
            question: "What kind of insights can I expect?",
            answer: "GitInsight provides detailed analytics on code quality, team productivity, bottlenecks, and potential issues. You'll get actionable recommendations for improving code review processes, reducing technical debt, and optimizing team collaboration."
        },
        {
            question: "How much does GitInsight cost?",
            answer: "We offer flexible pricing plans based on team size and usage. Choose from our Standard, Professional, or Enterprise plans to get the features that best suit your team's needs. Contact our sales team for detailed pricing information and to find the right plan for your organization."
        }
    ];

    return (
        <div id="faq" className="bg-slate-900 py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-200 mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-slate-400">
                        Everything you need to know about GitInsight and how it can transform your development process.
                    </p>
                </div>

                <Accordion type="single" collapsible className="space-y-4">
                    {faqs.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            value={`item-${index}`}
                            className="bg-slate-800/50 backdrop-blur-lg rounded-lg border border-slate-700"
                        >
                            <AccordionTrigger className="px-6 py-4 text-slate-200 hover:text-slate-100 hover:no-underline">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-4 text-slate-400">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>

                <div className="mt-12 text-center">
                    <p className="text-slate-400">
                        Still have questions? {" "}
                        <a href="gitinsightsuppport@gmail.com?subject=GitInsight%20Support%20Query" className="text-blue-400 hover:text-blue-300">
                            Contact our support team
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};


export default FAQ