import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

import Person from "./models/person.js";

const app = express();

app.use(express.static("dist"));
app.use(express.json());

const PORT = process.env.PORT || 3001;

morgan.token("body", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return "";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);



app.get("/", (req, res) => {
  res.send("Welcome to homepage");
});


app.get("/api/persons", (req, res) => {
  Person.find({}).then((response) => {
    res.send(response);
  });
});

app.get("/api/persons/:id", (req, res,next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if(!person){
        return res.status(404).end()
      }
      res.send(person);
    })
    .catch((err) => {
    next(err)
    });
});

app.get("/info", (req, res) => {
  Person.countDocuments({})
    .then(count => {
      res.send(`
        <p>Phonebook has info for ${count} people.</p>
        <p>${new Date()}</p>
      `);
    });
});

app.post("/api/persons", (req, res,next) => {
  const { name, number } = req.body;
  if (!name && !number) {
    return res.status(400).send("Name and number fields are missing");
  }
  if (!name) {
    return res.status(400).send("Name field is missing");
  }
  if (!number) {
    return res.status(400).send("Number field is missing");
  }
  const person = new Person({
    name,
    number,
  });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((err) => {
    next(err)
    });
});

app.delete("/api/persons/:id", (req, res, next) => {
  console.log("Deleting:", req.params.id);

  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => {
      next(err);
    });
});

app.put('/api/persons/:id',(req,res,next)=>{

  const {name,number}=req.body

  Person.findById(req.params.id).then(person=>{
    if(!person){
     return res.status(404).end()
    }
    person.name=name
    person.number=number
    return person.save().then((updatedPerson)=>{
      res.status(200).send(updatedPerson)
    })
  }).catch(error=>next(error))
})

const errorHandler=(error,req,res,next)=>{
  console.log(error.message)
  if(error.name=="CastError"){
    return res.status(400).json({ error: "malformatted id" });
  }
  else if(error.name==="ValidationError"){
    return res.status(400).json({error: error.message})
  }
next(error)
}


app.use(errorHandler)


app.listen(PORT, (err) => {
  if (!err) {
    console.log(`Server running on port ${PORT}`);
  } else {
    console.log(`something goes wrong`, err);
  }
});
