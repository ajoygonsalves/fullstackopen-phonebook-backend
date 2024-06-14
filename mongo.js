const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "As arguments please provide: <password> <person-name> <person-number>"
  );
  process.exit(1);
}

const password = process.argv[2];
const personName = process.argv[3];
const personNumber = process.argv[4];

const mongooseURL = `mongodb+srv://ajoygonsalves:${password}@production.fltizzk.mongodb.net/?retryWrites=true&w=majority&appName=Production`;

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
