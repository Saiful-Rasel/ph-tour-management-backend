import z from "zod";


export const createUserZodSchema = z.object({
    name: z
        .string({ invalid_type_error: "Name must be string" })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }),
    email: z
        .string({ invalid_type_error: "Email must be string" })
        .email({ message: "Invalid email address format." })
        .min(5, { message: "Email must be at least 5 characters long." })
        .max(100, { message: "Email cannot exceed 100 characters." }),
    password: z
        .string({ invalid_type_error: "Password must be string" })
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[A-Z])/, {
            message: "Password must contain at least 1 uppercase letter.",
        })
        .regex(/^(?=.*[!@#$%^&*])/, {
            message: "Password must contain at least 1 special character.",
        })
        .regex(/^(?=.*\d)/, {
            message: "Password must contain at least 1 number.",
        }),
    phone: z
        .string({ invalid_type_error: "Phone Number must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
        })
        .optional(),
    address: z
        .string({ invalid_type_error: "Address must be string" })
        .max(200, { message: "Address cannot exceed 200 characters." })
        .optional()
})
export const updateUserZodSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().email().min(5).max(100).optional(),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[A-Z])/, { message: "Password must contain uppercase" })
    .regex(/^(?=.*[!@#$%^&*])/, { message: "Password must contain special char" })
    .regex(/^(?=.*\d)/, { message: "Password must contain number" })
    .optional(),
  phone: z
    .string()
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, { message: "Invalid Bangladeshi phone number" })
    .optional(),
  address: z.string().max(200).optional(),
});