const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

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

const note = {
  id: 1,
  name: "Arto Hellas",
  number: "040-123456",
};

notes = notes.concat(note);

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.use(cors());

app.use(express.static("dist"));

app.use(express.json());

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.use((req, res, next) => {
  const options = { timeZoneName: "long" };
  req.requestTime = new Date().toLocaleString("en-UK", options);
  next();
});

app.get("/api/persons", async (req, res) => {
  try {
    const persons = await Person.find({});
    res.json(persons);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

app.get("/api/persons/:id", async (req, res) => {
  try {
    const personById = await Person.findById(req.params.id);
    console.log(personById);
    res.status(200).json({ message: "User found", person: personById });
  } catch (error) {
    res.status(404).json({ message: "Sorry, user not found" });
  }
});

app.delete("/api/persons/:id", async (req, res) => {
  try {
    const personById = await Person.findById(req.params.id);

    if (!personById) {
      return res.status(404).json({ message: "Sorry, user not found" });
    }

    console.log({ personById });
    await Person.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "User deleted", person: personById });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/persons", async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber } = req.body;

    if (!firstName) {
      return res.status(400).json({ error: "First name is missing" });
    }

    if (!lastName) {
      return res.status(400).json({ error: "Last name is missing" });
    }

    if (!phoneNumber) {
      return res.status(400).json({ error: "Phone number is missing" });
    }

    const newPerson = new Person({ firstName, lastName, phoneNumber });

    await newPerson.save();

    // Sending the success message and the newPerson object
    res
      .status(201)
      .json({ message: "Person added successfully", person: newPerson });
  } catch (error) {
    console.log("Error, could not post", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/persons/:id", async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, phoneNumber } = req.body;

  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      id,
      { firstName, lastName, phoneNumber },
      { new: true, runValidators: true }
    );

    if (!updatedPerson) {
      return res.status(404).json({
        message: "Person not found",
      });
    }

    res.status(200).json({
      message: "Person updated successfully",
      person: updatedPerson,
    });
  } catch (error) {
    console.error("Error updating person:", error);
    res.status(500).json({
      message: "Unable to edit person",
      error: error.message,
    });
  }
});

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${notes.length} people</p><p>Time: ${req.requestTime}</p>`
  );
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});

console.log("PORT: ", process.env.PORT);
