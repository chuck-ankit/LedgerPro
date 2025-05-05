import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  customer: mongoose.Types.ObjectId;
  amount: number;
  date: Date;
  description: string;
  paymentMethod: string;
  reference: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    description: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['cash', 'bank_transfer', 'credit_card', 'check', 'other'],
    },
    reference: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPayment>('Payment', paymentSchema); 