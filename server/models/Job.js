import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['applied', 'interview', 'offer', 'rejected'],
      default: 'applied',
    },
    location: { type: String, trim: true },
    salary: { type: Number },
    link: { type: String, trim: true },
    notes: { type: String, trim: true },
    dateApplied: { type: Date },
  interviewDates: [{ type: Date }],
  offerDate: { type: Date },
  rejectedDate: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

jobSchema.index({ createdBy: 1, createdAt: -1 });
jobSchema.index({ createdBy: 1, status: 1 });

const Job = mongoose.model('Job', jobSchema);
export default Job;
