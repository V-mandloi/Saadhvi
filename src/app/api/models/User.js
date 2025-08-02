import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
    trim: true,
  },
  age: {
    type: Number,
    required: [true, 'Age is required.'],
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    minlength: [6, 'Password must be at least 6 characters long.'],
  },
  role: {
    type: String,
    enum: ['PRO', 'Admin'],
    default: 'PRO',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


export default mongoose.models.User || mongoose.model('User', UserSchema);
