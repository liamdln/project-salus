import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    encryptedPassword: {
        type: String,
        required: true,
        minlength: 8
    }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;