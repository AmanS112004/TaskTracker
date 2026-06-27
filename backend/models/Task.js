import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 500,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["Todo", "In Progress", "Completed"],
      default: "Todo",
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },
    dueDate: {
      type: Date,
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ user: 1 });
taskSchema.index({ title: "text", description: "text" });

const Task = mongoose.model("Task", taskSchema);

export default Task;
