const express = require("express");
const Router = express.Router;
const userRouter = Router();
const { userModel, purchaseModel } = require("../db");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {JWT_USER_PASSWORD} = require("../config"); // Replace with an actual secret in production

// Define Zod schema for validation
const signupSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
});

// Signup route
userRouter.post('/signup', async function (req, res) {
    try {
        console.log("Received payload:", req.body);

        // Map incoming fields to the expected field names
        const mappedData = {
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName, // Use firstName instead of FirstName
            lastName: req.body.lastName,   // Use lastName instead of LastName
        };

        // Validate the request body using Zod
        const validatedData = signupSchema.parse(mappedData);

        const { email, password, firstName, lastName } = validatedData;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the user in the database
        const newUser = await userModel.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
        });

        console.log("User created:", newUser);
        res.json({
            message: "User signed up successfully",
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Validation error:", error.errors);
            return res.status(400).json({
                message: "Validation failed",
                errors: error.errors,
            });
        }
        console.error("Unexpected error:", error.message);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});

// Signin route
userRouter.post("/signin", async function (req, res) {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(403).json({
                message: "Invalid email or password",
            });
        }

        // Compare the provided password with the stored hash
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(403).json({
                message: "Invalid email or password",
            });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, JWT_USER_PASSWORD, { expiresIn: '1h' });

        // Optionally set the token in a cookie (if you want to implement cookie authentication)
        // res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });

        res.json({
            message: "Signin successful",
            token: token,
        });
    } catch (error) {
        console.error("Signin error:", error.message);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});

// Purchases route (for demonstration)
userRouter.get("/purchases",async function (req, res) {
    const userId = req.userId;

    const purchases = await purchaseModel.find({
        userId,
        courseId
    })

    res.json({
        message: "Purchases endpoint",
        purchases
    });
});

module.exports = {
    userRouter: userRouter,
};
