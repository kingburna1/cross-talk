
import mongoose from 'mongoose';
import bcrypt from 'bcrypt'; // <-- NEW IMPORT

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
 confirm_password: { type: String, required: true },
 
}, {
    timestamps: true 
});

// --- Pre-save Hook to Hash Password ---
userSchema.pre('save', async function (next) {
    // Only hash if the password field is new or has been modified
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

const User = mongoose.model('User', userSchema);
export default User;