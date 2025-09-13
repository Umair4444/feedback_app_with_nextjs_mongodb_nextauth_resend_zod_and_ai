# Feedback App with Next.js, MongoDB, NextAuth, Resend, Zod, and AI

A modern full-stack feedback platform built with Next.js (App Router), MongoDB, secure authentication, schema validation, email integration, and AI-powered suggestions.

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [Usage](#usage)
- [License](#license)

---

## Demo

## https://truefeedbacksocialapp.vercel.app

## Features

- **Authentication**: Secure user registration and login using [NextAuth] with providers like credentials or OAuth.
- **Feedback System**: Users can submit and receive feedback (anonymous or identified, depending on implementation).
- **AI Suggestions**: Generate smarter feedback prompts or message suggestions with AI integration (e.g., OpenAI/Google-Gemini).
- **Email Verification**: Handle user verification or feedback notifications via the [Resend] email service.
- **Schema Validation**: Robust input validation using [Zod].
- **Database**: Store feedback, user profiles, and sessions in MongoDB.
- **Responsive UI**: Built with modern styling—supporting mobile and desktop out of the box.

---

## Tech Stack

| Layer          | Technology                   |
| -------------- | ---------------------------- |
| Frontend       | Next.js (App Router), React  |
| Authentication | NextAuth                     |
| Schema         | Zod (validation)             |
| Database       | MongoDB (Mongoose or native) |
| Email          | Resend (email delivery)      |
| AI             | (e.g., OpenAI/Google-Gemini) |
| Styling        | Tailwind CSS and ShadCN      |
| Dev Tools      | ESLint, TypeScript, etc.     |

---

## Getting Started

### Prerequisites

- Node.js v14+
- npm or Yarn
- MongoDB instance (local or Atlas)
- (Optional) API key for OpenAI or an AI provider
- Resend API key for email functionality

### Installation

1. **Clone the repo**

   ```bash
   git clone <https://github.com/Umair4444/NEXTJS_PROJECTS/tree/main/feedback_app_with_nextjs_mongodb_nextauth_resend_zod_and_ai>
   cd feedback_app_with_nextjs_mongodb_nextauth_resend_zod_and_ai
   ```

npm install
# or
yarn

MONGODB_USERNAME="your key"
MONGODB_PASSWORD="your key"
MONGODB_DATABASE="your key"
MONGODB_URI=mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.wq7x4l6.mongodb.net/${MONGODB_DATABASE}?retryWrites=true&w=majority&appName=Cluster0
RESEND_API_KEY="your key"
NEXTAUTH_SECRET="" # Added by `npx auth`. Read more: https://cli.authjs.dev
OPENAI_API_KEY="your key"
GOOGLE_GENERATIVE_AI_API_KEY="your key"

npm run dev
# or
yarn dev

# Usage
Sign Up / Login: Create an account (or use OAuth).

Submit Feedback: Navigate to the feedback form to send or receive feedback.

AI Suggestions: Use the AI-powered prompt generator when composing feedback.

Email Notifications: Confirm your email or receive alerts via Resend.

Profile Management: Edit settings, toggle feedback options, or review received submissions.

# License
This project is licensed under the [MIT License]—see the LICENSE file for details.

Thanks for checking out this project! Feel free to adapt, enhance, or deploy it to fit your needs.