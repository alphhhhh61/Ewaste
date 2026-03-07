import mongoose from 'mongoose';

const deviceSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    category: {
      type: String,
      required: true,
      enum: ['Mobile phones', 'Laptops', 'Tablets', 'Televisions', 'Printers', 'Computer accessories', 'Batteries'],
    },
    brand: {
      type: String,
      required: true,
    },
    modelName: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      required: true,
      enum: ['Working', 'Not Working', 'Broken Screen/Parts', 'Unknown'],
    },
    approximateAge: {
      type: String,
      required: true,
    },
    disposalMethod: {
      type: String,
      required: true,
      enum: ['Home Pickup', 'Center Drop-off'],
    },
    status: {
      type: String,
      required: true,
      enum: ['Registered', 'Pickup Scheduled', 'Picked Up', 'Completed'],
      default: 'Registered',
    },
    creditValue: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Device = mongoose.model('Device', deviceSchema);

export default Device;
