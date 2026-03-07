import mongoose from 'mongoose';

const pickupSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    device: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Device',
    },
    pickupAddress: {
      type: String,
      required: true,
    },
    preferredDate: {
      type: Date,
      required: true,
    },
    preferredTime: {
      type: String,
      required: true,
    },
    specialInstructions: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: ['Scheduled', 'Agent Assigned', 'Completed', 'Cancelled'],
      default: 'Scheduled',
    },
  },
  {
    timestamps: true,
  }
);

const PickupRequest = mongoose.model('PickupRequest', pickupSchema);

export default PickupRequest;
