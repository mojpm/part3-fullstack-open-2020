const mongoose = require('mongoose')

const connectDataBase = (password) => {
    const MONGODB_URI = `mongodb+srv://CKnite:${password}@cluster0.04ahz.mongodb.net/phoneboook?retryWrites=true&w=majority`

    mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })

    const personSchema = new mongoose.Schema({
        name: String,
        number: Number
    })

    personSchema.set('toJSON', {
        transform: (document, object) => {
            object.id = object._id.toString()
            delete object._id
            delete object.__v
        }
    })

    const Contact = mongoose.model('Contact', personSchema);

    const newContact = new Contact({
        name: process.argv[3],
        number: process.argv[4]
    })

    return {
        Contact: newContact,
        Model: Contact
    }
}

if (process.argv.length < 2) {
    console.log('CLI Format: node <file> <password> <name> <number>');
    return process.exit(1)
} else if (process.argv.length === 3) {
    const Model = connectDataBase(process.argv[2]).Model;
    Model
        .find({})
        .then(contacts => {
            console.log('Phonebook:');
            for (contact in contacts) {
                console.log(`${contacts[contact].name} ${contacts[contact].number}`);
            }
            mongoose.connection.close()
        })
        .catch(error => {
            console.log('THE ERROR IS =>>>>>>>>>>>>>>', error)
        })
} else {
    const Contact = connectDataBase(process.argv[2]).Contact;

    Contact
        .save()
        .then(result => {
            console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
            mongoose.connection.close()
        })
        .catch(error => {
            console.log('THE ERROR IS =>>>>>>>>>>>>>>', error)
        })
}
