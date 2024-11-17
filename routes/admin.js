const { Router } = require("express");
const adminRouter = Router();
const { adminModel } = require("../db");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_ADMIN_PASSWORD = "JSDG2013";

const adminSignupSchema = z.object({
    email: z.string().email("Enter correct email id"),
    password: z.string().min(6, "Enter at least 6 characters"),
    FirstName: z.string().min(1, "Enter first name"),
    LastName: z.string().min(1, "Enter last name"),
});

adminRouter.post("/signup", async function (req, res) {
    try {
        const mappedAdminData = {
            email: req.body.email,
            password: req.body.password,
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
        };

        const validatedAdminData = adminSignupSchema.parse(mappedAdminData);
        const { email, password, FirstName, LastName } = validatedAdminData;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);  // Await hash

        const newAdmin = await adminModel.create({
            email: email,
            password: hashedPassword,
            FirstName: FirstName,
            LastName: LastName,
        });

        res.json({
            message: "Admin signup successful",
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

adminRouter.post("/signin", async function (req, res) {
    const { email, password } = req.body;

    try {
        const admin = await adminModel.findOne({
            email,
        });

        if (!admin) {
            return res.status(403).json({
                message: "Invalid email",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return res.status(403).json({
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign({ id: admin._id }, JWT_ADMIN_PASSWORD);

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

adminRouter.post("/course", function (req, res) {
    // Implement course creation logic here
    res.json({
        message: "Course creation endpoint",
    });
});

adminRouter.put("/course", function (req, res) {
    // Implement course update logic here
    res.json({
        message: "Course update endpoint",
    });
});

adminRouter.get("/course/bulk", function (req, res) {
    // Implement bulk course fetch logic here
    res.json({
        message: "Bulk course fetch endpoint",
    });
});

module.exports = {
    adminRouter: adminRouter,
};
