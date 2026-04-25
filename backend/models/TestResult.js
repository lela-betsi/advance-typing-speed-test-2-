import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    wpm: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    level: { type: String, default: "low" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("TestResult", testSchema);
