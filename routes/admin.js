const { Router } = require("express");
const adminRouter = Router();
const { adminModel, courseModel } = require("../db");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middleware/admin");

// Validation schema for admin signup
const adminSignupSchema = z.object({
    email: z.string().email("Enter correct email id"),
    password: z.string().min(6, "Enter at least 6 characters"),
    FirstName: z.string().min(1, "Enter first name"),
    LastName: z.string().min(1, "Enter last name"),
});

// Admin signup
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
        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await adminModel.create({
            email,
            password: hashedPassword,
            FirstName,
            LastName,
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

// Admin signin
adminRouter.post("/signin", async function (req, res) {
    const { email, password } = req.body;

    try {
        const admin = await adminModel.findOne({ email });

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
            token,
        });
    } catch (error) {
        console.error("Signin error:", error.message);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});

// Create a course
adminRouter.post("/course", adminMiddleware, async function (req, res) {
    try {
        const adminId = req.userId;
        const { title, description, imageUrl, price } = req.body;

        const course = await courseModel.create({
            title,
            description,
            imageUrl,
            price,
            creatorId: adminId,
        });

        res.json({
            message: "Course creation done",
            courseId: course._id,
        });
    } catch (error) {
        console.error("Course creation error:", error.message);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});

// Update a course
adminRouter.put("/course/:id", adminMiddleware, async function (req, res) {
    try {
        const { id } = req.params;
        const { title, description, imageUrl, price } = req.body;

        const updatedCourse = await courseModel.findByIdAndUpdate(
            id,
            { title, description, imageUrl, price },
            { new: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json({
            message: "Course updated successfully",
            updatedCourse,
        });
    } catch (error) {
        console.error("Course update error:", error.message);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});

// Bulk fetch courses
adminRouter.get("/course/bulk", adminMiddleware, async function (req, res) {
    try {
        const courses = await courseModel.find();

        if (!courses.length) {
            return res.status(404).json({
                message: "No courses found",
            });
        }

        res.json({
            message: "Courses fetched successfully",
            courses,
        });
    } catch (error) {
        console.error("Bulk fetch error:", error.message);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});

module.exports = {
    adminRouter,
};
