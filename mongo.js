const mongoose = require("mongoose");
const Person = require("./models/person");

const mongooseURL = process.env.MONGODB_URL;

main().catch((err) => console.log(err));

mongoose.set("strictQuery", false);

async function main() {
  try {
    await mongoose.connect(mongooseURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Success, you're connected agent 1928");

    const personSchema = mongoose.Schema({
      firstName: String,
      lastName: String,
      phoneNumber: String,
    });

    const [firstName, lastName] = personName.split(" ");
    const Person = mongoose.model("Person", personSchema);

    const newPerson = new Person({
      firstName,
      lastName,
      phoneNumber: personNumber,
    });

    await newPerson.save();

    console.log(`Added ${personName} number ${personNumber} to phonebook`);

    // console.log(db);
    await mongoose.connection.close();
  } catch (error) {
    console.log("Oops, error! : ", error);
    process.exit(1);
  }
}
