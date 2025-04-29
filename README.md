# AI-Powered Project Analytics Platform

A sophisticated web application that leverages artificial intelligence to analyze software projects, providing automated insights and issue tracking.

## Features

### Project Analysis
- Import and analyze GitHub repositories using AI
- Automated code quality assessment
- Technical debt identification
- Architecture recommendations
- Performance optimization suggestions
- Security vulnerability detection


## Tech Stack

### Frontend
- **Next.js** - React framework for production-grade applications
- **TypeScript** - Static typing for enhanced development experience
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **Clerk** - Authentication and user management

### Backend
- **Prisma** - Type-safe database ORM
- **GeminiAI** - Advanced AI model for project analysis

## Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager
- GeminiAI API key
- GitHub OAuth credentials

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/git-insight.git
cd project-name
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in the following environment variables:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL= '/sync-user'
DATABASE_URL=


GEMINI_API_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET = 
```

4. Initialize Prisma:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to see the application.


## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- AssemblyAI for providing speech-to-text capabilities
- GeminiAI for advanced AI analysis features
- The open-source community for various tools and libraries used in this project