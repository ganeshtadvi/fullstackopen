import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength:3,
    required: true,
  },
  number: {
    type: String,
    minlength:8,
    required: true,
    validate: {
      validator: function (value) {
        return /^\d{2,3}-\d+$/.test(value);
      },
      message: "Phone number must be in the format XX-XXXXXXXX or XXX-XXXXXXXX"
    }
  },
});



const Person = mongoose.model("Person", personSchema);

export default Person;