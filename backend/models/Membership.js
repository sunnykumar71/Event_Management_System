import mongoose from 'mongoose';

const membershipSchema = mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true,
    },
    duration: {
      type: String,
      enum: ['6 months', '1 year', '2 years'],
      default: '6 months',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'cancelled'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to calculate endDate based on duration
membershipSchema.pre('save', function (next) {
  if (this.isModified('duration') || this.isNew) {
    const start = new Date(this.startDate);
    if (this.duration === '6 months') {
      start.setMonth(start.getMonth() + 6);
    } else if (this.duration === '1 year') {
      start.setFullYear(start.getFullYear() + 1);
    } else if (this.duration === '2 years') {
      start.setFullYear(start.getFullYear() + 2);
    }
    this.endDate = start;
  }
  next();
});

const Membership = mongoose.model('Membership', membershipSchema);

export default Membership;




