const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

// Connect to MongoDB
mongoose.connect(
    process.env.DB_CONNECTION_STRING
);

// Check connection status
mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB successfully!");
});

mongoose.connection.on("error", (err) => {
    console.error("Error connecting to MongoDB", err);
});

// Define Schemas
const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
});

const adminSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
});

const courseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  creatorId: { type: Types.ObjectId, ref: "User", required: true },
});

const purchaseSchema = new Schema({
  userId: { type: Types.ObjectId, ref: "User", required: true },
  courseId: { type: Types.ObjectId, ref: "Course", required: true },
});

// Create Models
const userModel = mongoose.model("User", userSchema);
const adminModel = mongoose.model("Admin", adminSchema);
const courseModel = mongoose.model("Course", courseSchema);
const purchaseModel = mongoose.model("Purchase", purchaseSchema);

// Export Models
module.exports = {
  userModel,
  adminModel,
  courseModel,
  purchaseModel,
};
