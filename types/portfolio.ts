import { Timestamp } from "firebase/firestore";

// ==================== Hero Section ====================
export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

export interface CTAButton {
  text: string;
  url: string;
  variant?: "primary" | "secondary" | "outline";
  icon?: string;
}

export interface Hero {
  id: string;
  name: string;
  tagline: string;
  roles: string[]; // e.g., ["Full Stack Developer", "UI/UX Designer"]
  description?: string;
  location?: string; // e.g., "San Francisco, CA"
  ctaButtons: CTAButton[];
  socialLinks: SocialLink[];
  backgroundImage?: string;
  profileImage?: string;
  updatedAt?: Timestamp;
}

// ==================== About Section ====================
export interface TechStackItem {
  name: string;
  icon?: string;
  category?: string;
}

export interface About {
  id: string;
  summary: string;
  bio?: string;
  techStack: TechStackItem[];
  yearsOfExperience: number;
  resumeUrl?: string;
  photoUrl?: string;
  highlights?: string[];
  education?: EducationItem[];
  updatedAt?: Timestamp;
}

export interface EducationItem {
  degree: string;
  institution: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

// ==================== Experience Section ====================
export interface Experience {
  id: string;
  title: string;
  company: string;
  companyUrl?: string;
  companyLogo?: string;
  location: string;
  locationType?: "remote" | "hybrid" | "onsite";
  startDate: string; // ISO date string or Firebase Timestamp
  endDate?: string; // ISO date string or Firebase Timestamp (undefined if current)
  current: boolean;
  description: string;
  achievements: string[];
  techStack: string[];
  order: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// ==================== Projects Section ====================
export interface ProjectMedia {
  type: "image" | "video";
  url: string;
  thumbnail?: string;
  alt?: string;
}

export interface ProjectLinks {
  demo?: string;
  github?: string;
  live?: string;
  documentation?: string;
  case_study?: string;
}

export interface Project {
  id: string;
  title: string;
  slug?: string;
  description: string;
  longDescription?: string;
  techStack: string[];
  features: string[];
  links: ProjectLinks;
  media: ProjectMedia[];
  thumbnail?: string;
  featured: boolean;
  order: number;
  category?: string;
  status?: "completed" | "in-progress" | "planned";
  startDate?: string;
  endDate?: string;
  teamSize?: number;
  role?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// ==================== Skills Section ====================
export interface Skill {
  id: string;
  name: string;
  proficiency: number; // 0-100
  yearsOfExperience?: number;
  icon?: string;
  category: string;
  order?: number;
}

export interface SkillCategory {
  id: string;
  name: string;
  description?: string;
  skills: Skill[];
  order: number;
  icon?: string;
}

// ==================== Certifications Section ====================
export interface Certification {
  id: string;
  title: string;
  issuer: string;
  badgeUrl?: string; // Image URL for certification badge
  issueDate: string; // ISO date string when issued
  expiryDate?: string; // ISO date string when expires
  credentialUrl?: string; // Verification link
  credentialId?: string;
  description?: string;
  skills?: string[];
  icon?: string; // Emoji or icon representation
  order: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// ==================== Achievements ====================
export interface Achievement {
  id: string;
  title: string;
  description: string;
  date?: string; // ISO date string
  icon?: string;
  category?: string; // e.g., "Award", "Publication", "Contribution"
  url?: string; // External link to more info
  order: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// ==================== Contact Section ====================
export interface ContactInfo {
  email: string;
  phone?: string;
  location?: string;
  availability?: string;
  preferredContact?: "email" | "phone" | "any";
  socialLinks?: SocialLink[];
}

export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  company?: string;
  budget?: string;
  timeline?: string;
  source?: string; // How they found you
  read: boolean;
  replied: boolean;
  createdAt: Timestamp;
  repliedAt?: Timestamp;
  notes?: string;
  ipAddress?: string;
  userAgent?: string;
}

// ==================== Portfolio Content ====================
export interface PortfolioContent {
  hero: Hero;
  about: About;
  experiences: Experience[];
  projects: Project[];
  skillCategories: SkillCategory[];
  certifications: Certification[];
  achievements: Achievement[];
  contactInfo: ContactInfo;
  metadata?: PortfolioMetadata;
}

export interface PortfolioMetadata {
  lastUpdated: Timestamp;
  version: string;
  siteTitle: string;
  siteDescription: string;
  siteUrl: string;
  ogImage?: string;
  analytics?: {
    googleAnalyticsId?: string;
    plausibleDomain?: string;
  };
  seo?: {
    keywords: string[];
    author: string;
    twitterHandle?: string;
    googleVerification?: string;
  };
}

// ==================== Utility Types ====================
export interface FirestoreDocument {
  id: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export type SortOrder = "asc" | "desc";

export interface SortConfig {
  field: string;
  order: SortOrder;
}

export interface PaginationConfig {
  page: number;
  limit: number;
  total?: number;
}

// ==================== Form Types ====================
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  company?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// ==================== API Response Types ====================
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
