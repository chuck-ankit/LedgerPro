import mongoose, { Document, Schema } from 'mongoose';

export interface ICashbook extends Document {
  date: Date;
  description: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  reference?: string;
  createdAt: Date;
  updatedAt: Date;
}

const cashbookSchema = new Schema<ICashbook>(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['income', 'expense'],
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
    },
    reference: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Cashbook = mongoose.model<ICashbook>('Cashbook', cashbookSchema);

export default Cashbook; 