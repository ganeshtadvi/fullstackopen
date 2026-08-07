import mongoose from "mongoose";

const password = process.env.DB_PASS

const username = process.env.USERNAME

const url = `mongodb+srv://${username}:${password}@fullstackopen.fatgvza.mongodb.net/?appName=fullstackopen`;


mongoose
  .connect(url)
  .then(() => console.log("Mongoose Connected.."))
  .catch((err) => console.log("Mongoose not Connected..,", err));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  
  person
    .save()
    .then(() => {
      console.log(
        `added ${process.argv[3]} number ${process.argv[4]} to phonebook`,
      );
      mongoose.connection.close();
    })
    .catch((err) => {
        console.log(err)
        mongoose.connection.close();
    });
 
} else if (process.argv.length == 3) {
  Person.find({})
    .then((persons) => {
      console.log("phonebook: ");
      persons.forEach((p) => {
        console.log(p.name, p.number);
      });
      mongoose.connection.close();
    })
    .catch((err) => {
      console.log(err);
      mongoose.connection.close();
    });
} else {
  console.log("No Arguments Passed..");
  mongoose.connection.close();
}


