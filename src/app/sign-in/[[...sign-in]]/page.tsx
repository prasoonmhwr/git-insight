import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return  (
  <div className='flex justify-center items-center py-12 h-screen'>
    <SignIn 
    appearance={{
      elements: {
        card: "bg-slate-800 border border-slate-700 shadow-lg", 
        headerTitle: "text-slate-200", 
        headerSubtitle: "text-slate-400",
        dividerLine: "bg-slate-400",
        formFieldLabel: "text-slate-200", 
        formFieldInput: "bg-slate-700 text-slate-200 border-slate-600", 
        formButtonPrimary: "bg-slate-500 hover:bg-slate-600", 
        socialButtonsBlockButton: "bg-slate-700 hover:bg-slate-600 text-slate-200",
        footerActionText: "text-slate-400",
        footerActionLink: "text-blue-400 hover:text-blue-300",
        footer :"bg-gradient-to-b from-slate-700 to-slate-900",
        formFieldInputShowPasswordIcon: "text-slate-300"
      },
    }}
    />
    </div>)
}