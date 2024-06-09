const express = require("express");
const app = express();

const notes = [
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

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${notes.length} people</p><p>Time: ${req.requestTime}</p>`
  );
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
