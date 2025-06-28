import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  experience: { type: Number, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  hospital: { type: String, required: true },
  password: { type: String, required: true, trim: true}
}, { timestamps: true });

const Doctor = mongoose.model('Doctor', DoctorSchema);

export default Doctor;

