import mongoose from "mongoose";

export const CommentSchema = new mongoose.Schema(
    {

        text: {
            type: String,
            required: true,
            unique: true,
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

export default mongoose.model("Comments", CommentSchema);
