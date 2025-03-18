import {z} from "zod";

export class AuthSchema{
    static register = z.object({
        email:z.string().email().min(1).max(255),
        password: z.string().min(6).max(255),
        confirmPassword: z.string().min(6).max(255),
        userAgent: z.string().optional(),
    }).refine((data) => data.password === data.confirmPassword,{
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

    static validateRegister(data: z.infer<typeof AuthSchema.register>){
        return this.register.parse(data);
    }
}

