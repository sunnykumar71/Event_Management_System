import mongoose from 'mongoose';

const guestSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: '',
    },
    eventName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['invited', 'confirmed', 'declined', 'attended'],
      default: 'invited',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const GuestList = mongoose.model('GuestList', guestSchema);

export default GuestList;
