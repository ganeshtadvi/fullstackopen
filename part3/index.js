import express from "express";
import morgan from "morgan";
import dotenv from 'dotenv'
const app = express();

app.use(express.static('dist'))
app.use(morgan("tiny"));
app.use(express.json());

const PORT =process.env.PORT|| 3001;

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
morgan.token('post', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ' '
})
const persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (req, res) => {
  res.send("Welcome to homepage");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const person = persons.find((p) => p.id === req.params.id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).send(`Not Found`);
  }
});


app.delete("/api/persons/:id", (req, res) => {
  const personId = req.params.id;
  const personIndex = persons.findIndex((p) => p.id === personId);
  if (personIndex != -1) {
    persons.splice(personIndex, 1);
    console.log(persons);
    return res.status(200).send("Person deleted from phonebook");
  }
  res.status(404).send("Person not found in phonebook!");
});


app.post("/api/persons", (req, res) => {
  const newId = String(Math.floor(Math.random() * 1000000));

  const newPersonObj = {
    id: newId,
    name: req.body.name,
    number: req.body.number,
  };
  if (!newPersonObj.name && !newPersonObj.number) {
    return res.status(400).send("Name and number fields are missing");
  }

  if (!newPersonObj.name) {
    return res.status(400).send("Name field is missing");
  }

  if (!newPersonObj.number) {
    return res.status(400).send("Number field is missing");
  }

  const checkDuplicateName = persons.some((p) => p.name === newPersonObj.name);
  if (checkDuplicateName) {
    return res.status(400).json({ error: "name must be unique" });
  }
  persons.push(newPersonObj);
  res.status(201).json(newPersonObj);
});


app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people.</p>
    <p>${new Date()}</p>`,
  );
});



app.listen(PORT, (err) => {
  if (!err) {
    console.log(`Server running on port ${PORT}`);
  } else {
    console.log(`something goes wrong`, err);
  }
});
