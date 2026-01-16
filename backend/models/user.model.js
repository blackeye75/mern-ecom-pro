import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Name is required"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minlength: [6, "Password must be at least 6 characters long"],
		},
		cartItems: [
			{
				quantity: { type: Number, default: 1 },
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
				},
			},
		],
		role: {
			type: String,
			enum: ["customer", "admin"],
			default: "customer",
		},
	},
	{ timestamps: true }
);

// 🔐 Hash password before saving     async error heavy
// userSchema.pre("save", async function (next) {
// 	if (!this.isModified("password")) return next();

// 	try {
// 		const salt = await bcrypt.genSalt(10);
// 		this.password = await bcrypt.hash(this.password, salt);
// 		next();
// 	} catch (error) {
// 		console.error("Error hashing password:", error);
// 		next(error);
// 	}
// });

// {
// trapepd for an hour here 
// TL;DR

// ❌ bcryptjs is fine

// ❌ controller is fine

// ❌ your hook style is incompatible with Mongoose v9

// ✅ remove next() completely

// ✅ use async-only middleware
// }


userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});


// 🔍 Compare password during login
userSchema.methods.comparePassword = async function (enteredPassword) {
	return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
