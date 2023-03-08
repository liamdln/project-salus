import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    colour: {
        type: String,
        required: true
    },
    power: {
        type: Number,
        required: true
    },

})

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
    },
    enabled: {
        type: Boolean,
        required: true
    },
    devAccount: {
        type: Boolean,
        required: false
    },
    roles: [roleSchema],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;