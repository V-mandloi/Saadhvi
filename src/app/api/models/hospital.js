import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  specialization: { type: [String], required: true }, // Changed to Array of Strings
  registrationNumber: { type: String, required: true, unique: true, trim: true },
  contact: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true, unique: true },
  address: { type: String, required: true, trim: true },
  password: { type: String, required: true }
}, { timestamps: true });

hospitalSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.models.Hospital || mongoose.model("Hospital", hospitalSchema);