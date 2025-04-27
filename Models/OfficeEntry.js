// models/Office.js
import mongoose from 'mongoose';

const OfficeSchema = new mongoose.Schema({
  office_name: { type: String, required: true },
  office_number: { type: [String], required: true },
  office_address: { type: String},
  office_email: { type: String, required: true, unique: true },
  office_password: { type: String, required: true },
  office_logo: { type: String }, // URL or path for the uploaded file
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Role field
});

const OfficeEntry = mongoose?.models?.OfficeEntry || mongoose.model("OfficeEntry", OfficeSchema);

export default OfficeEntry;