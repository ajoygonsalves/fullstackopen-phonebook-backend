const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const personRouter = require("./routes/persons"); // Import the routes

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.use((req, res, next) => {
  const options = { timeZoneName: "long" };
  req.requestTime = new Date().toLocaleString("en-UK", options);
  next();
});

app.use("/api/persons", personRouter); // Use the router for the person routes

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

app.get("/info", async (req, res) => {
  try {
    const count = await Person.count();
    res.send(
      `<p>Phonebook has info for ${count} people</p><p>Time: ${req.requestTime}</p>`
    );
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});

console.log("PORT: ", PORT);
