# Firebase Setup Guide - Complete Configuration

**Last Updated:** November 25, 2024  
**Status:** Required for admin functionality

---

## 🚨 **Current Error**

```
FirebaseError: Missing or insufficient permissions.
Failed to add experience: Missing or insufficient permissions.
```

**Root Cause:** Firestore security rules are blocking write operations.

---

## 🎯 **Quick Fix (3 Steps)**

### Step 1: Configure Firebase Project
### Step 2: Add Environment Variables
### Step 3: Set Firestore Security Rules ⭐ **This fixes the error!**

---

## 📋 **Step 1: Create Firebase Project**

### 1.1 Go to Firebase Console
```
https://console.firebase.google.com
```

### 1.2 Create New Project
1. Click **"Add project"**
2. Enter project name: `ridam-portfolio` (or your choice)
3. ✅ Enable Google Analytics (recommended)
4. Click **"Create project"**
5. Wait for project creation (~30 seconds)

### 1.3 Register Web App
1. In project overview, click **Web icon** (</>)
2. App nickname: `Portfolio Website`
3. ✅ Check **"Also set up Firebase Hosting"** (optional)
4. Click **"Register app"**
5. **Copy the Firebase config** (you'll need this!)

Example config you'll see:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

---

## 📋 **Step 2: Enable Firebase Services**

### 2.1 Enable Authentication

1. In Firebase Console, go to **Build → Authentication**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Click **"Google"** provider
5. Click **"Enable"**
6. Select **Project support email** from dropdown
7. Click **"Save"**

### 2.2 Enable Firestore Database

1. Go to **Build → Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (we'll secure it in Step 3)
4. Select location: **`us-central1`** (or closest to you)
5. Click **"Enable"**

### 2.3 Enable Storage

1. Go to **Build → Storage**
2. Click **"Get started"**
3. Choose **"Start in test mode"**
4. Use same location as Firestore
5. Click **"Done"**

---

## 📋 **Step 3: Configure Security Rules** ⭐ **CRITICAL**

### 3.1 Firestore Security Rules

**This is what fixes your permission error!**

1. Go to **Firestore Database → Rules** tab
2. **Replace all existing rules** with this:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user is admin
    // Add your admin email(s) here
    function isAdmin() {
      return isAuthenticated() && 
             request.auth.token.email in [
               'ridamchhapiya5@gmail.com',
               // Add more admin emails here if needed
               // 'another-admin@gmail.com',
             ];
    }
    
    // Portfolio data - Admin write, public read
    match /portfolio/{section} {
      allow read: if true; // Public can read
      allow write: if isAdmin(); // Only admins can write
    }
    
    // Experiences - Admin write, public read
    match /experiences/{experienceId} {
      allow read: if true; // Public can read
      allow create, update, delete: if isAdmin(); // Only admins can modify
    }
    
    // Projects - Admin write, public read
    match /projects/{projectId} {
      allow read: if true; // Public can read
      allow create, update, delete: if isAdmin(); // Only admins can modify
    }
    
    // Skills - Admin write, public read
    match /skills/{skillId} {
      allow read: if true; // Public can read
      allow create, update, delete: if isAdmin(); // Only admins can modify
      
      // Nested skills within categories
      match /skills/{nestedSkillId} {
        allow read: if true;
        allow create, update, delete: if isAdmin();
      }
    }
    
    // Certifications - Admin write, public read
    match /certifications/{certId} {
      allow read: if true; // Public can read
      allow create, update, delete: if isAdmin(); // Only admins can modify
    }
    
    // Contact submissions - Anyone can create, only admin can read
    match /contact/{submissionId} {
      allow read: if isAdmin(); // Only admins can read submissions
      allow create: if true; // Anyone can submit contact form
      allow update, delete: if isAdmin(); // Only admins can modify
    }
    
    // User profiles (future use)
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && request.auth.uid == userId;
    }
    
    // Deny all other collections by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. **IMPORTANT:** Replace `'ridamchhapiya5@gmail.com'` with your actual Google account email
4. Click **"Publish"**
5. You'll see "Rules published successfully" ✅

### 3.2 Storage Security Rules

1. Go to **Storage → Rules** tab
2. Replace with this:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user is admin
    function isAdmin() {
      return isAuthenticated() && 
             request.auth.token.email in [
               'ridamchhapiya5@gmail.com',
               // Add more admin emails here
             ];
    }
    
    // Resumes - Admin only
    match /resumes/{fileName} {
      allow read: if true; // Public can download
      allow write, delete: if isAdmin(); // Only admins can upload/delete
    }
    
    // Profile photos - Admin only
    match /profile/{fileName} {
      allow read: if true; // Public can view
      allow write, delete: if isAdmin(); // Only admins can upload/delete
    }
    
    // Project images - Admin only
    match /projects/{fileName} {
      allow read: if true; // Public can view
      allow write, delete: if isAdmin(); // Only admins can upload/delete
    }
    
    // Company logos - Admin only
    match /companies/{fileName} {
      allow read: if true; // Public can view
      allow write, delete: if isAdmin(); // Only admins can upload/delete
    }
    
    // Certification images - Admin only
    match /certifications/{fileName} {
      allow read: if true; // Public can view
      allow write, delete: if isAdmin(); // Only admins can upload/delete
    }
    
    // Deny all other paths
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

3. **Replace email** with your admin email
4. Click **"Publish"**

---

## 📋 **Step 4: Add Environment Variables**

### 4.1 Create .env.local File

In your project root, create `.env.local`:

```bash
cd /Users/ridam.chhapiya/Documents/ai_built/cursor/portfolio
touch .env.local
```

### 4.2 Add Firebase Config

Open `.env.local` and add (replace with your actual values):

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Optional: Firebase Measurement ID (for Analytics)
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 4.3 Get Your Values

From Firebase Console:
1. Go to **Project Settings** (gear icon)
2. Scroll to **"Your apps"** section
3. Click **"Config"** radio button
4. Copy each value to your `.env.local`

---

## 📋 **Step 5: Test the Setup**

### 5.1 Restart Dev Server

```bash
# Stop current server (Ctrl+C)
# Start again
npm run dev
```

### 5.2 Test Authentication

1. Open `http://localhost:3001/admin-login`
2. Click **"Sign in with Google"**
3. Select your Google account (use the admin email)
4. Should redirect to `/admin` dashboard ✅

### 5.3 Test Firestore Write

1. Go to **Admin Dashboard** (`/admin`)
2. Click **"Edit Experience"**
3. Click **"+ Add New Experience"**
4. Fill out the form
5. Click **"Save"**
6. Should see **"Experience added successfully!"** toast ✅

### 5.4 Verify in Firebase Console

1. Go to **Firestore Database → Data** tab
2. Should see new `experiences` collection
3. Click to view your new document ✅

---

## 🔍 **Troubleshooting**

### Error: "Missing or insufficient permissions"

**Solution:** Check security rules
- Verify you published the security rules in Step 3
- Verify your admin email is correct in the rules
- Verify you're signed in with the admin email

**Quick test:**
```javascript
// Temporarily use test mode rules (DEVELOPMENT ONLY!)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // ⚠️ WARNING: Open access!
    }
  }
}
```

**⚠️ WARNING:** Never use test mode rules in production!

### Error: "Firebase not initialized"

**Solution:** Check environment variables
```bash
# Verify .env.local exists
cat .env.local

# Should see all NEXT_PUBLIC_FIREBASE_* variables
```

**Common issues:**
- Missing `.env.local` file
- Typo in variable names
- Not restarting dev server after adding variables

### Error: "Auth domain not authorized"

**Solution:** Add localhost to authorized domains

1. Firebase Console → **Authentication → Settings**
2. Scroll to **"Authorized domains"**
3. Click **"Add domain"**
4. Add: `localhost`
5. Add: `127.0.0.1`
6. Add your production domain when ready

### Error: "Failed to get document"

**Solution:** Check Firestore indexes

Some queries require composite indexes. Firebase will show error with link to create index automatically.

1. Click the link in error message
2. Wait for index to build (~1-2 minutes)
3. Retry the query

---

## 🎨 **Firestore Database Structure**

Your database will have these collections:

```
portfolio/                    (Root collection)
├── hero/                     (Document: hero section data)
├── about/                    (Document: about section data)
└── contact/                  (Document: contact info)

experiences/                  (Collection: all experiences)
├── {experienceId}/          (Auto-generated ID)
│   ├── title: string
│   ├── company: string
│   ├── location: string
│   ├── dates: object
│   ├── description: string
│   ├── techStack: array
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp

projects/                     (Collection: all projects)
├── {projectId}/             (Auto-generated ID)
│   ├── title: string
│   ├── description: string
│   ├── thumbnail: string
│   ├── techStack: array
│   ├── features: array
│   ├── liveUrl: string
│   └── githubUrl: string

skills/                       (Collection: skill categories)
├── {categoryId}/            (Auto-generated ID)
│   ├── name: string
│   ├── icon: string
│   └── skills/              (Subcollection: skills in category)
│       └── {skillId}/
│           ├── name: string
│           ├── proficiency: number
│           └── yearsOfExperience: number

contact/                      (Collection: contact submissions)
└── {submissionId}/          (Auto-generated ID)
    ├── name: string
    ├── email: string
    ├── subject: string
    ├── message: string
    ├── submittedAt: timestamp
    └── status: string
```

---

## 🔒 **Security Best Practices**

### ✅ DO:
- ✅ Keep admin emails in security rules
- ✅ Use server timestamps for created/updated fields
- ✅ Validate data types in security rules
- ✅ Keep `.env.local` in `.gitignore`
- ✅ Use different Firebase projects for dev/prod
- ✅ Enable App Check for production
- ✅ Monitor usage in Firebase Console

### ❌ DON'T:
- ❌ Commit `.env.local` to Git
- ❌ Share Firebase credentials publicly
- ❌ Use test mode rules in production
- ❌ Give write access to unauthenticated users
- ❌ Store sensitive data in Firestore (use Cloud Functions)
- ❌ Hardcode API keys in code

---

## 📊 **Firebase Usage Limits (Free Tier)**

### Firestore:
- **Reads:** 50,000/day
- **Writes:** 20,000/day
- **Deletes:** 20,000/day
- **Storage:** 1 GB
- **Network:** 10 GB/month

### Storage:
- **Storage:** 5 GB
- **Downloads:** 1 GB/day
- **Uploads:** 20,000/day

### Authentication:
- **Unlimited** free sign-ins

**For your portfolio:** These limits are MORE than enough!

---

## 🚀 **Production Deployment**

### Vercel Environment Variables

When deploying to Vercel:

1. Go to **Vercel Dashboard**
2. Select your project
3. Go to **Settings → Environment Variables**
4. Add all `NEXT_PUBLIC_FIREBASE_*` variables
5. Select **Production, Preview, Development**
6. Click **Save**

### Update Firebase Authorized Domains

1. Firebase Console → **Authentication → Settings**
2. Add your Vercel domain: `your-site.vercel.app`
3. Add custom domain if you have one

### Update CORS (if needed)

For Storage, you might need to configure CORS:

```bash
# Install gsutil (Google Cloud SDK)
# Then create cors.json:
```

```json
[
  {
    "origin": ["https://your-site.vercel.app"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

```bash
gsutil cors set cors.json gs://your-bucket.appspot.com
```

---

## 📝 **Checklist**

### Firebase Console:
- [ ] Created Firebase project
- [ ] Registered web app
- [ ] Enabled Authentication (Google)
- [ ] Created Firestore Database
- [ ] Enabled Storage
- [ ] Published Firestore security rules
- [ ] Published Storage security rules
- [ ] Added admin email to rules
- [ ] Added localhost to authorized domains

### Local Setup:
- [ ] Created `.env.local` file
- [ ] Added all Firebase environment variables
- [ ] Restarted dev server
- [ ] Tested Google sign-in
- [ ] Tested Firestore write operation
- [ ] Verified data in Firebase Console

### Production (When Ready):
- [ ] Added environment variables to Vercel
- [ ] Added production domain to authorized domains
- [ ] Tested authentication in production
- [ ] Verified Firestore operations work
- [ ] Checked Firebase Console for errors

---

## 🆘 **Still Getting Errors?**

### Quick Diagnostic:

```typescript
// Add this to any component to debug
useEffect(() => {
  console.log('Firebase Config:', {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing',
  });
}, []);
```

### Check Authentication:

```typescript
// In admin page
import { auth } from '@/lib/firebase/config';

useEffect(() => {
  const user = auth.currentUser;
  console.log('Current user:', user?.email);
  console.log('User token:', user?.getIdTokenResult());
}, []);
```

### Test Firestore Connection:

```typescript
import { db } from '@/lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';

async function testFirestore() {
  try {
    const snapshot = await getDocs(collection(db, 'experiences'));
    console.log('✅ Firestore connected, documents:', snapshot.size);
  } catch (error) {
    console.error('❌ Firestore error:', error);
  }
}
```

---

## 📞 **Support Resources**

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Auth](https://firebase.google.com/docs/auth/web/start)
- [Firebase Storage](https://firebase.google.com/docs/storage/web/start)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)

---

**Last Updated:** November 25, 2024  
**Status:** Complete guide for fixing permission errors  
**Next Steps:** Follow Step 3 to publish security rules ⭐




