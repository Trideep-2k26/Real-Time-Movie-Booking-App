import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  bookings: [{
    type: mongoose.Types.ObjectId,
    ref: "Booking"
  }],
});

const User = mongoose.model('User', userSchema);
export default User;
