import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide the title']
    },
    content: {
        type: String,
        required: [true, 'Please provide content'],
    }
})

export default mongoose.model('Post', PostSchema);