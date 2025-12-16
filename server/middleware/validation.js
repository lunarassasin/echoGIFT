// server/middleware/validation.js (New File)
const { z } = require('zod');

// Define the schema for the registration request body
const RegisterSchema = z.object({
    email: z.string().email({ message: "Invalid email address format." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
    user_type: z.enum(["Wisher", "Donor"], { 
        message: "User type must be either Wisher or Donor." 
    }),
    display_name: z.string().min(3, { message: "Display name is required." }),
    real_name: z.string().optional(), // Legal name is optional (required on Wisher UI only)
    shipping_address: z.string().optional(), // Address is handled later, optional here
});

/**
 * Middleware function to validate the request body against a Zod schema.
 * @param {object} schema - The Zod schema to use for validation.
 */
const validate = (schema) => (req, res, next) => {
    try {
        // Use the schema to parse the request body
        schema.parse(req.body); 
        next(); // If successful, proceed to the controller
    } catch (error) {
        // If validation fails, Zod throws a ZodError
        if (error instanceof z.ZodError) {
            // Extract a clean error message for the client
            const errorMessages = error.errors.map(issue => 
                `${issue.path.join('.')}: ${issue.message}`
            ).join(', ');
            
            return res.status(400).json({ 
                message: `Validation failed: ${errorMessages}` 
            });
        }
        // Handle unexpected errors
        res.status(500).json({ message: 'Internal server error during validation.' });
    }
};

module.exports = {
    validate,
    RegisterSchema,
    // Future: LoginSchema, WishSchema, etc.
};