import mongoose from 'mongoose';

const centerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    operatingHours: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    acceptedCategories: [{
      type: String
    }],
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  {
    timestamps: true,
  }
);

const CollectionCenter = mongoose.model('CollectionCenter', centerSchema);

export default CollectionCenter;
