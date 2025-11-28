import { initializeApp, getApps, FirebaseApp, FirebaseOptions } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// ==================== Environment Variables Validation ====================
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

/**
 * Validates that all required Firebase environment variables are present
 * @throws {Error} If any required environment variable is missing
 */
function validateFirebaseConfig(): FirebaseConfig {
  const requiredEnvVars = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  const missingVars: string[] = [];

  // Check for missing environment variables
  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
      missingVars.push(`NEXT_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`);
    }
  });

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required Firebase environment variables:\n${missingVars.join('\n')}\n\n` +
      `Please add these variables to your .env.local file.`
    );
  }

  return requiredEnvVars as FirebaseConfig;
}

// ==================== Firebase Configuration ====================
let firebaseConfig: FirebaseOptions;

try {
  const validatedConfig = validateFirebaseConfig();
  firebaseConfig = {
    apiKey: validatedConfig.apiKey,
    authDomain: validatedConfig.authDomain,
    projectId: validatedConfig.projectId,
    storageBucket: validatedConfig.storageBucket,
    messagingSenderId: validatedConfig.messagingSenderId,
    appId: validatedConfig.appId,
  };
} catch (error) {
  if (error instanceof Error) {
    console.error('Firebase Configuration Error:', error.message);
  }
  // Provide fallback empty config to prevent build errors
  // The app will fail at runtime if Firebase is actually used
  firebaseConfig = {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  };
}

// ==================== Firebase Initialization ====================
/**
 * Initialize Firebase App
 * Only initializes if not already initialized
 */
let app: FirebaseApp;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw new Error('Failed to initialize Firebase. Please check your configuration.');
}

// ==================== Firebase Services ====================
/**
 * Firebase Auth instance
 */
let auth: Auth;

/**
 * Firestore database instance
 */
let db: Firestore;

/**
 * Firebase Storage instance
 */
let storage: FirebaseStorage;

try {
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.error('Error initializing Firebase services:', error);
  throw new Error('Failed to initialize Firebase services.');
}

// ==================== Exports ====================
/**
 * Default export: Firebase App instance
 */
export default app;

/**
 * Named exports for Firebase services
 */
export { app, auth, db, storage };

/**
 * Export types for TypeScript
 */
export type { FirebaseApp, Auth, Firestore, FirebaseStorage };

