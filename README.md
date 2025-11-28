# Portfolio Website

A modern, futuristic portfolio website built with Next.js 14, TypeScript, and Firebase. Features a stunning interactive particle background, glassmorphic UI components, and a fully functional admin dashboard for content management.

## ✨ Features

- **🎨 Modern UI/UX**: Glassmorphic design with smooth animations using Framer Motion
- **🌌 Interactive Background**: Particle system that responds to mouse movements
- **📱 Fully Responsive**: Optimized for all device sizes
- **🔐 Admin Dashboard**: Secure admin panel for managing portfolio content
- **📝 Contact Form**: Integrated contact form with Firebase Firestore storage
- **⚡ Performance**: Built with Next.js 14 App Router for optimal performance
- **🎯 Type-Safe**: Full TypeScript implementation

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **Form Validation**: React Hook Form + Zod
- **UI Components**: Custom glassmorphic components

## 📋 Prerequisites

- Node.js 18+ and npm
- Firebase account and project
- Git

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd portfolio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 📁 Project Structure

```
portfolio/
├── app/                      # Next.js App Router
│   ├── (public)/            # Public pages
│   ├── admin/               # Admin dashboard
│   ├── admin-login/         # Admin login page
│   └── api/                 # API routes
├── components/              # React components
│   ├── effects/             # Visual effects (particles, glass cards)
│   ├── public/              # Public-facing components
│   └── ui/                  # Reusable UI components
├── lib/                     # Utility libraries
│   ├── firebase/            # Firebase configuration and functions
│   ├── hooks/               # Custom React hooks
│   └── validations.ts       # Zod validation schemas
├── types/                   # TypeScript type definitions
└── public/                  # Static assets
```

## 🔑 Admin Access

Access the admin dashboard at `/admin-login`. You'll need to set up Firebase Authentication and create an admin user.

### Admin Features

- **Dashboard**: Overview of portfolio statistics
- **Content Management**:
  - Hero section
  - About section
  - Work experience
  - Projects
  - Skills & certifications
- **Contact Submissions**: View and manage contact form submissions

## 🎨 Customization

### Updating Content

1. Log in to the admin dashboard at `/admin-login`
2. Navigate to the section you want to edit
3. Make your changes and save

### Styling

- Global styles: `app/globals.css`
- Tailwind config: `tailwind.config.ts`
- Component-specific styles: Use Tailwind utility classes

### Firebase Collections

The app uses the following Firestore collections:

- `portfolio_content`: Main portfolio document
- `experiences`: Work experience entries
- `projects`: Project entries
- `skill_categories`: Skills organized by category
- `contact_submissions`: Contact form submissions

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Google Cloud Run
- Self-hosted with Docker

## 🔒 Security Notes

- Never commit `.env.local` to version control
- Set up proper Firebase Security Rules
- Configure CORS for API routes if needed
- Use environment variables for all sensitive data

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👤 Author

Your Name
- Website: [your-website.com](https://your-website.com)
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Firebase for backend services
- Framer Motion for smooth animations
