const mongoose = require("mongoose");
const { Schema } = mongoose;

// Create the user schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
      default: null,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      match: [
        /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])/,
        "Password must contain at least one uppercase letter, one special character, and one number",
      ],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      required: true,
    },
  },
  {
    timestamps: true, // ✅ timestamps
  }
);

// Export the model
module.exports = mongoose.model("User", userSchema);
