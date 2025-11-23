import { z } from 'zod'

// Username validation: letters, numbers, underscores only
export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be at most 20 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')

// Email validation
export const emailSchema = z
  .string()
  .email('Invalid email address')

// Password validation: minimum 8 characters, must include uppercase, lowercase, number, special character
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')

// About validation
export const aboutSchema = z
  .string()
  .max(160, 'About section must be at most 160 characters')
  .optional()

// Post content validation
export const postContentSchema = z
  .string()
  .min(1, 'Post cannot be empty')
  .max(280, 'Post must be at most 280 characters')

// Registration schema
export const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  about: aboutSchema,
})

// Login schema
export const loginSchema = z.object({
  emailOrUsername: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
})

// Post schema
export const createPostSchema = z.object({
  content: postContentSchema,
})

// Update profile schema
export const updateProfileSchema = z.object({
  about: aboutSchema,
  username: usernameSchema.optional(),
  email: emailSchema.optional(),
})
