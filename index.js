const express = require("express");
const app = express();

let notes = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.use(express.json());

app.use((req, res, next) => {
  const options = { timeZoneName: "long" };
  req.requestTime = new Date().toLocaleString("en-UK", options);
  next();
});

app.get("/api/persons", (req, res) => {
  res.send(notes);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const note = notes.find((note) => note.id === Number(id));

  if (note) {
    res.json(note);
  } else {
    res.status(404).json({ error: "Invalid URI" });
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const initialLength = notes.length;
  notes = notes.filter((note) => note.id !== Number(id));

  if (notes.length < initialLength) {
    res.status(204).end();
  } else {
    res.status(404).json({ error: "Note not found" });
  }
});

app.post("/api/persons", (req, res) => {
  const initialLength = notes.length;

  notes.push({
    id: generateId(),
    name: req.body.name,
    number: req.body.number,
  });

  if (notes.length > initialLength) {
    res.status(200).json({ message: "Added successfully" });
  }
});

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${notes.length} people</p><p>Time: ${req.requestTime}</p>`
  );
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
