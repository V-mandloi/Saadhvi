import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  degree: { type: String, required: true },
  registrationNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true }
});

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;