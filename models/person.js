const mongoose = require("mongoose");

const mongooseURL = process.env.MONGODB_URL;

mongoose.set("strictQuery", true);

// Define the schema
const personSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phoneNumber: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// Define the model
const Person = mongoose.model("Person", personSchema);

async function main() {
  try {
    await mongoose.connect(mongooseURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("##### Connected to Mongo! #####");
  } catch (e) {
    console.log("Error: ", e);
    process.exit(1);
  }
}

// Call the main function to connect to the database
main().catch(console.error);

module.exports = Person;
