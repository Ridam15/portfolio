# 🚀 Ridam Chhapiya | Personal Portfolio & Admin Dashboard

A modern, highly-interactive, and fully dynamic personal portfolio built with **Next.js 16**, **React**, **TypeScript**, and **Tailwind CSS**. It features complex 3D/glassmorphism UI components, fluid animations using **Framer Motion**, and a secure, production-grade **Firebase** backend.

What sets this portfolio apart is its built-in **Admin Dashboard**—a private CMS (Content Management System) that allows complete control over the site's content (Projects, Experience, Skills, Certifications) and settings without ever touching the codebase again. It even includes a live Google Analytics integration!

---

## 🌟 Key Features

### 🖥️ Public Portfolio
*   **Dynamic Sections:** Hero, About, Experience, Projects, Skills, and Certifications—all rendered dynamically from the database.
*   **Cutting-Edge UI/UX:** Glassmorphism effects, gradient text, sticky navigation, and smooth scroll behaviors.
*   **Framer Motion Animations:** Micro-interactions, staggered list animations, and scroll-triggered reveals for a premium feel.
*   **Dark Mode Support:** Fully integrated with `next-themes` for seamless light/dark mode toggling.
*   **Responsive Overhaul:** Optimized for desktop, tablet, and mobile devices natively.
*   **Contact Form:** Securely wired to Firebase so visitors can reach out directly.

### 🔒 Admin Dashboard (CMS)
*   **Secure Authentication:** Protected routes requiring Firebase Email/Password authentication.
*   **Complete Content Control:** Add, edit, reorder, or delete Projects, Experiences, Skills, and Certifications in real-time.
*   **Image Uploads:** Direct integration with Firebase Storage for uploading project thumbnails and certification badges.
*   **Site Settings:** Manage global metadata (Title, Description, SEO Keywords, OG Image, Social Handles) dynamically.
*   **Real-time Analytics:** Integrated `@google-analytics/data` API to pull live traffic, device metrics, and user sources directly into the dashboard.
*   **Contact Management:** View, read, and delete incoming messages from the public contact form.

---

## 🛠️ Tech Stack

**Frontend Architecture:**
*   [Next.js](https://nextjs.org/) (App Router, Turbopack)
*   [React](https://react.dev/) 18
*   [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
*   [Tailwind CSS](https://tailwindcss.com/) (Utility-first styling)
*   [Framer Motion](https://www.framer.com/motion/) (Production-ready animations)
*   [Lucide React](https://lucide.dev/) (Beautiful iconography)
*   [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) (Form validation)
*   [Sonner](https://sonner.emilkowal.ski/) (Toast notifications)

**Backend & Infrastructure:**
*   [Firebase Firestore](https://firebase.google.com/docs/firestore) (NoSQL Database)
*   [Firebase Storage](https://firebase.google.com/docs/storage) (Media Hosting)
*   [Firebase Authentication](https://firebase.google.com/docs/auth) (Secure Login)
*   Google Analytics Data API (Live Metrics)

---

## ⚙️ Local Development Setup

Follow these steps to run the project locally.

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/Ridam15/portfolio.git
cd portfolio
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Setup Firebase & Environment Variables
Create a \`.env.local\` file in the root directory and add your Firebase configuration:

\`\`\`env
# Firebase Client Configuration (Required)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Google Analytics Service Account (Optional for Admin Dashboard Live Data)
GA_PROPERTY_ID=your_ga4_numeric_property_id
GA_CLIENT_EMAIL=your_service_account_email
GA_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour\nMassive\nKey\nHere\n-----END PRIVATE KEY-----\n"
\`\`\`

### 4. Run the development server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The Admin dashboard can be accessed at `/admin`.

---

## 🚀 Deployment (Vercel)

This project is highly optimized for deployment on [Vercel](https://vercel.com).

1. Push your code to a GitHub repository.
2. Sign in to Vercel and import your repository.
3. Configure your Environment Variables in the Vercel dashboard exactly as they appear in your `.env.local` file.
4. Click **Deploy**. Vercel will automatically build the Next.js application and assign you a live HTTPS URL.

---

## 🎨 Design Philosophy
The design language focuses on **Glassmorphism**—using translucent, frosted-glass-like cards (`GlassCard` component) overlaying vibrant, animated gradient backgrounds (`BackgroundPaths`). This creates a sense of depth and modernity while keeping the content legible and structurally sound.

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
