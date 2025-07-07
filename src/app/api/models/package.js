// src/models/package.js

import mongoose from "mongoose";

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Package name is required."],
    trim: true
  },
  description: {
    type: String,
    required: [true, "Description is required."]
  },
  price: {
    type: Number,
    required: [true, "Price is required."]
  },
  services: {
    type: [String],
    required: true,
    default: []
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: [true, "Hospital is required."]
  }
}, { timestamps: true });

export default mongoose.models.Package || mongoose.model("Package", packageSchema);