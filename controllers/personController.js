const mongoose = require("mongoose");
const Person = require("../models/person");

const getAllPersons = async (req, res) => {
  try {
    const persons = await Person.find({});
    res.json(persons);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
};

const getPersonById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const personById = await Person.findById(id);

    if (personById) {
      res.status(200).json({ message: "User found", person: personById });
    } else {
      res.status(404).json({ message: "Sorry, user not found" }).end();
    }
  } catch (error) {
    next(error);
  }
};

const deletePerson = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const personById = await Person.findById(id);

    if (!personById) {
      return res.status(404).json({ message: "Sorry, user not found" });
    }

    await Person.deleteOne({ _id: id });
    res.status(200).json({ message: "User deleted", person: personById });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const createPerson = async (req, res, next) => {
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
    next(error);
  }
};

const updatePerson = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, phoneNumber } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      id,
      { firstName, lastName, phoneNumber },
      { new: true, runValidators: true, context: "query" }
    );

    if (!updatedPerson) {
      return res.status(404).json({ message: "Person not found" });
    }

    res
      .status(200)
      .json({ message: "Person updated successfully", person: updatedPerson });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Unable to edit person", error: error.message });
  }
};

module.exports = {
  getAllPersons,
  getPersonById,
  deletePerson,
  createPerson,
  updatePerson,
};
