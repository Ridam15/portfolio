import { z } from 'zod';

// ==================== Contact Form ====================
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  subject: z
    .string()
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject must not exceed 200 characters')
    .trim(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must not exceed 1000 characters')
    .trim(),
  phone: z.string().optional(),
  company: z.string().optional(),
});

// ==================== Login Form ====================
export const loginSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must not exceed 100 characters'),
  rememberMe: z
    .boolean()
    .default(false)
    .optional(),
});

// ==================== Hero Section ====================
export const heroSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),
  tagline: z
    .string()
    .min(5, 'Tagline must be at least 5 characters')
    .max(200, 'Tagline must not exceed 200 characters')
    .trim(),
  roles: z
    .array(
      z.string()
        .min(2, 'Role must be at least 2 characters')
        .max(50, 'Role must not exceed 50 characters')
    )
    .min(1, 'At least one role is required')
    .max(5, 'Maximum 5 roles allowed'),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .optional(),
  ctaButtons: z
    .array(z.object({
      text: z
        .string()
        .min(1, 'Button text is required')
        .max(30, 'Button text must not exceed 30 characters'),
      url: z
        .string()
        .url('Please enter a valid URL'),
      variant: z
        .enum(['primary', 'secondary', 'outline'])
        .default('primary')
        .optional(),
      icon: z
        .string()
        .optional(),
    }))
    .max(3, 'Maximum 3 CTA buttons allowed'),
  socialLinks: z
    .array(z.object({
      platform: z
        .string()
        .min(1, 'Platform name is required')
        .max(30, 'Platform name must not exceed 30 characters'),
      url: z
        .string()
        .url('Please enter a valid social media URL'),
      icon: z
        .string()
        .optional(),
    }))
    .max(10, 'Maximum 10 social links allowed'),
  backgroundImage: z
    .union([
      z.string().url('Please enter a valid image URL'),
      z.literal(''),
    ])
    .optional(),
  profileImage: z
    .union([
      z.string().url('Please enter a valid image URL'),
      z.literal(''),
    ])
    .optional(),
});

// ==================== About Section ====================
export const aboutSchema = z.object({
  summary: z
    .string()
    .min(50, 'Summary must be at least 50 characters')
    .max(1000, 'Summary must not exceed 1000 characters')
    .trim(),
  bio: z
    .string()
    .max(2000, 'Bio must not exceed 2000 characters')
    .optional(),
  techStack: z
    .array(z.object({
      name: z
        .string()
        .min(1, 'Technology name is required')
        .max(50, 'Technology name must not exceed 50 characters'),
      icon: z
        .string()
        .optional(),
      category: z
        .string()
        .max(50, 'Category must not exceed 50 characters')
        .optional(),
    }))
    .min(1, 'At least one technology is required')
    .max(30, 'Maximum 30 technologies allowed'),
  yearsOfExperience: z
    .number()
    .min(0, 'Years of experience must be 0 or greater')
    .max(100, 'Years of experience must not exceed 100'),
  resumeUrl: z
    .union([
      z.string().url('Please enter a valid resume URL'),
      z.literal(''),
    ])
    .optional(),
  photoUrl: z
    .union([
      z.string().url('Please enter a valid photo URL'),
      z.literal(''),
    ])
    .optional(),
  highlights: z
    .array(
      z.string()
        .min(5, 'Highlight must be at least 5 characters')
        .max(200, 'Highlight must not exceed 200 characters')
    )
    .max(10, 'Maximum 10 highlights allowed')
    .optional(),
});

// ==================== Experience ====================
export const experienceSchema = z.object({
  title: z
    .string()
    .min(2, 'Job title must be at least 2 characters')
    .max(100, 'Job title must not exceed 100 characters')
    .trim(),
  company: z
    .string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must not exceed 100 characters')
    .trim(),
  companyUrl: z
    .union([
      z.string().url('Please enter a valid company website URL'),
      z.literal(''),
    ])
    .optional(),
  companyLogo: z
    .union([
      z.string().url('Please enter a valid logo URL'),
      z.literal(''),
    ])
    .optional(),
  location: z
    .string()
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location must not exceed 100 characters')
    .trim(),
  locationType: z
    .enum(['remote', 'hybrid', 'onsite'])
    .optional(),
  startDate: z
    .string()
    .min(1, 'Start date is required'),
  endDate: z
    .string()
    .optional(),
  current: z
    .boolean()
    .default(false),
  description: z
    .string()
    .min(20, 'Job description must be at least 20 characters')
    .max(1000, 'Job description must not exceed 1000 characters')
    .trim(),
  achievements: z
    .array(
      z.string()
        .min(10, 'Achievement must be at least 10 characters')
        .max(300, 'Achievement must not exceed 300 characters')
    )
    .min(1, 'At least one achievement is required')
    .max(10, 'Maximum 10 achievements allowed'),
  techStack: z
    .array(z.string().min(1, 'Technology name cannot be empty'))
    .min(1, 'At least one technology is required')
    .max(20, 'Maximum 20 technologies allowed'),
  order: z
    .number()
    .int('Order must be a whole number')
    .min(0, 'Order must be 0 or greater')
    .max(1000, 'Order must not exceed 1000'),
});

// ==================== Project ====================
export const projectSchema = z.object({
  title: z
    .string()
    .min(3, 'Project title must be at least 3 characters')
    .max(100, 'Project title must not exceed 100 characters')
    .trim(),
  slug: z
    .string()
    .optional()
    .transform((val) => val?.toLowerCase().replace(/\s+/g, '-')),
  description: z
    .string()
    .min(10, 'Project description must be at least 10 characters')
    .max(500, 'Project description must not exceed 500 characters')
    .trim(),
  longDescription: z
    .string()
    .max(2000, 'Long description must not exceed 2000 characters')
    .optional(),
  techStack: z
    .array(z.string().min(1, 'Technology name cannot be empty'))
    .min(1, 'At least one technology is required')
    .max(20, 'Maximum 20 technologies allowed'),
  features: z
    .array(z.string().min(1, 'Feature description cannot be empty'))
    .min(1, 'At least one feature is required')
    .max(15, 'Maximum 15 features allowed'),
  liveUrl: z
    .union([
      z.string().url('Please enter a valid URL for live demo'),
      z.literal(''),
    ])
    .optional()
    .or(z.literal('')),
  githubUrl: z
    .union([
      z.string().url('Please enter a valid GitHub URL'),
      z.literal(''),
    ])
    .optional()
    .or(z.literal('')),
  imageUrl: z
    .string()
    .optional(),
  featured: z
    .boolean()
    .default(false),
  order: z
    .number()
    .int('Order must be a whole number')
    .positive('Order must be a positive number')
    .max(1000, 'Order must not exceed 1000'),
  category: z
    .string()
    .max(50, 'Category must not exceed 50 characters')
    .optional(),
  status: z
    .enum(['completed', 'in-progress', 'planned'])
    .default('completed')
    .optional(),
  startDate: z
    .string()
    .optional(),
  endDate: z
    .string()
    .optional(),
  teamSize: z
    .number()
    .int('Team size must be a whole number')
    .min(1, 'Team size must be at least 1')
    .max(100, 'Team size must not exceed 100')
    .optional(),
  role: z
    .string()
    .max(100, 'Role must not exceed 100 characters')
    .optional(),
});

// ==================== Skill ====================
export const skillSchema = z.object({
  name: z
    .string()
    .min(1, 'Skill name is required')
    .max(50, 'Skill name must not exceed 50 characters')
    .trim(),
  proficiency: z
    .number()
    .min(0, 'Proficiency must be at least 0')
    .max(100, 'Proficiency must not exceed 100')
    .int('Proficiency must be a whole number'),
  yearsOfExperience: z
    .number()
    .min(0, 'Years of experience must be 0 or greater')
    .max(50, 'Years of experience must not exceed 50')
    .optional(),
  icon: z
    .string()
    .max(100, 'Icon path must not exceed 100 characters')
    .optional(),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(50, 'Category must not exceed 50 characters')
    .trim(),
  order: z
    .number()
    .int('Order must be a whole number')
    .min(0, 'Order must be 0 or greater')
    .max(1000, 'Order must not exceed 1000')
    .optional(),
});

export const skillCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(50, 'Category name must not exceed 50 characters')
    .trim(),
  description: z
    .string()
    .max(300, 'Description must not exceed 300 characters')
    .optional(),
  skills: z
    .array(skillSchema)
    .min(1, 'At least one skill is required')
    .max(20, 'Maximum 20 skills per category'),
  order: z
    .number()
    .int('Order must be a whole number')
    .min(0, 'Order must be 0 or greater')
    .max(1000, 'Order must not exceed 1000'),
  icon: z
    .string()
    .max(100, 'Icon path must not exceed 100 characters')
    .optional(),
});

// ==================== Certification ====================
export const certificationSchema = z.object({
  title: z
    .string()
    .min(2, 'Certification title must be at least 2 characters')
    .max(150, 'Certification title must not exceed 150 characters')
    .trim(),
  issuer: z
    .string()
    .min(2, 'Issuer name must be at least 2 characters')
    .max(100, 'Issuer name must not exceed 100 characters')
    .trim(),
  issuerLogo: z
    .union([
      z.string().url('Please enter a valid logo URL'),
      z.literal(''),
    ])
    .optional(),
  date: z
    .string()
    .min(1, 'Issue date is required'),
  expiryDate: z
    .string()
    .optional(),
  verificationUrl: z
    .union([
      z.string().url('Please enter a valid verification URL'),
      z.literal(''),
    ])
    .optional(),
  credentialId: z
    .string()
    .max(100, 'Credential ID must not exceed 100 characters')
    .optional(),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .optional(),
  skills: z
    .array(
      z.string()
        .min(1, 'Skill name cannot be empty')
        .max(50, 'Skill name must not exceed 50 characters')
    )
    .max(15, 'Maximum 15 skills allowed')
    .optional(),
  order: z
    .number()
    .int('Order must be a whole number')
    .min(0, 'Order must be 0 or greater')
    .max(1000, 'Order must not exceed 1000'),
});

// ==================== Achievement ====================
export const achievementSchema = z.object({
  title: z
    .string()
    .min(2, 'Achievement title must be at least 2 characters')
    .max(150, 'Achievement title must not exceed 150 characters')
    .trim(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters')
    .trim(),
  date: z
    .string()
    .optional(),
  icon: z
    .string()
    .max(100, 'Icon path must not exceed 100 characters')
    .optional(),
  category: z
    .string()
    .max(50, 'Category must not exceed 50 characters')
    .optional(),
  order: z
    .number()
    .int('Order must be a whole number')
    .min(0, 'Order must be 0 or greater')
    .max(1000, 'Order must not exceed 1000'),
});

// ==================== Type Inference ====================
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type HeroFormData = z.infer<typeof heroSchema>;
export type AboutFormData = z.infer<typeof aboutSchema>;
export type ExperienceFormData = z.infer<typeof experienceSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type SkillFormData = z.infer<typeof skillSchema>;
export type SkillCategoryFormData = z.infer<typeof skillCategorySchema>;
export type CertificationFormData = z.infer<typeof certificationSchema>;
export type AchievementFormData = z.infer<typeof achievementSchema>;

