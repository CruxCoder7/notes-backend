import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, "Provide a subject name"],
  },
  topic: {
    type: String,
    required: [true, "Provide a topic"],
  },
  semester: {
    type: Number,
    required: [true, "Provide semester num"],
  },
  url: {
    type: String,
    required: [true, "provide a URL"],
  },
});

export default mongoose.model("Note", NoteSchema);
