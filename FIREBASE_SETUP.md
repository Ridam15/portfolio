# Firebase Setup Guide

This guide will help you set up Firebase for your portfolio project.

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

## 2. Register Your Web App

1. In your Firebase project, click the web icon (</>) to add a web app
2. Register your app with a nickname (e.g., "Portfolio Website")
3. Firebase will show you the configuration object

## 3. Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Important:** Never commit `.env.local` to version control. It's already in `.gitignore`.

## 4. Enable Firebase Services

### Authentication
1. Go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** authentication
3. (Optional) Add authorized domains for production

### Firestore Database
1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode** (you'll add security rules later)
4. Select a location closest to your users

### Storage
1. Go to **Storage**
2. Click **Get started**
3. Use default security rules for now (update later for production)

## 5. Firestore Security Rules

Add these security rules to Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to portfolio content for everyone
    match /hero/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /about/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /experiences/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /projects/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /skills/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /certifications/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /achievements/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Contact submissions - allow create for everyone, read/update/delete for authenticated users only
    match /contacts/{document=**} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

## 6. Storage Security Rules

Add these security rules to Storage:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow public read access to images
    match /images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Allow public read access to documents
    match /documents/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 7. Create Admin User

Since you'll be using email/password authentication:

1. Go to **Authentication** > **Users**
2. Click **Add user**
3. Enter your admin email and password
4. This user will have access to the admin panel

## 8. Test Your Configuration

After setting up your `.env.local` file, restart your development server:

```bash
npm run dev
```

The Firebase configuration will automatically validate your environment variables and initialize the services.

## Configuration Features

The `lib/firebase/config.ts` file includes:

✅ **Environment Variable Validation** - Checks for missing variables on initialization  
✅ **Single Instance Pattern** - Only initializes Firebase once  
✅ **Error Handling** - Graceful error messages for configuration issues  
✅ **TypeScript Support** - Full type safety for all Firebase services  
✅ **Service Exports** - Auth, Firestore, and Storage ready to use  

## Available Services

After setup, you can import Firebase services like this:

```typescript
import { auth, db, storage } from '@/lib/firebase/config';
```

Or use the helper functions:

```typescript
// Auth
import { loginWithEmail, logout } from '@/lib/firebase/auth';

// Firestore
import { getDocument, updateDocument } from '@/lib/firebase/firestore';

// Storage
import { uploadFile, deleteFile } from '@/lib/firebase/storage';
```

## Troubleshooting

### "Missing required Firebase environment variables" error
- Make sure your `.env.local` file is in the root directory
- Restart your development server after creating/updating `.env.local`
- Check that all variable names start with `NEXT_PUBLIC_FIREBASE_`

### "Failed to initialize Firebase" error
- Verify your Firebase configuration values are correct
- Check that your Firebase project is active in the Firebase Console
- Ensure you've enabled the required services (Auth, Firestore, Storage)

### Authentication errors
- Make sure Email/Password authentication is enabled in Firebase Console
- Check that the user exists in Authentication > Users
- Verify security rules allow the operation

## Production Deployment

When deploying to production:

1. Add your production domain to Firebase Authentication authorized domains
2. Set environment variables in your hosting platform (Vercel, Netlify, etc.)
3. Update Firestore and Storage security rules for production
4. Enable Firebase Analytics (optional)

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)

