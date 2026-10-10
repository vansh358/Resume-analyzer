const mongoose = require('mongoose');

const STATUSES = ['Wishlist', 'Applied', 'Interview', 'Offer', 'Rejected'];

const ApplicationSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    status: { type: String, enum: STATUSES, default: 'Wishlist' },
    matchScore: { type: Number, min: 0, max: 100 },
    jdText: String,
    notes: String,
    analysis: { type: mongoose.Schema.Types.ObjectId, ref: 'Analysis' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', ApplicationSchema);
module.exports.STATUSES = STATUSES;
