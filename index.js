const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const Person = require("./models/person");

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

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

app.get("/api/persons", async (req, res) => {
  try {
    const persons = await Person.find({});
    res.json(persons);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

app.get("/api/persons/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const personById = await Person.findById(id);

    if (personById) {
      res.status(200).json({ message: "User found", person: personById });
    } else {
      res.status(404).json({ message: "Sorry, user not found" }).end();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

app.delete("/api/persons/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const personById = await Person.findById(id);

    if (!personById) {
      return res.status(404).json({ message: "Sorry, user not found" });
    }

    console.log({ personById });
    await Person.deleteOne({ _id: id });
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

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      id,
      { firstName, lastName, phoneNumber },
      { new: true, runValidators: true }
    );

    if (!updatedPerson) {
      return res.status(404).json({ message: "Person not found" });
    }

    res
      .status(200)
      .json({ message: "Person updated successfully", person: updatedPerson });
  } catch (error) {
    console.error("Error updating person:", error);
    res
      .status(500)
      .json({ message: "Unable to edit person", error: error.message });
  }
});

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${notes.length} people</p><p>Time: ${req.requestTime}</p>`
  );
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});

console.log("PORT: ", process.env.PORT);
