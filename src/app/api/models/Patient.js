import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
  // Personal Information
  name: {
    type: String,
    required: [true, 'Patient name is required.'],
    trim: true,
  },
  age: {
    type: Number,
    required: [true, 'Patient age is required.'],
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Gender is required.'],
  },
  contact: {
    phone: {
      type: String,
      required: [true, 'Patient phone number is required.'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
  },

  // Medical Information
  medicalHistory: {
    type: String,
    trim: true,
    default: 'No significant medical history provided.',
  },
  
  // System Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// This line prevents Mongoose from redefining the model if it's already been compiled,
// which is important in a Next.js development environment.
export default mongoose.models.Patient || mongoose.model('Patient', PatientSchema);