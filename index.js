require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Contact = require('./models/contact')

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan('tiny'));

morgan.token('logpost', (req, res) => {
    console.log(res.body);
})
app.use(morgan('logpost'))

const baseURL = '/api/persons';

app.get(baseURL, (request, response) => {
    Contact
        .find({})
        .then(notes => {
            console.log(notes.length)
            response.json(notes)
        })
});

app.get('/info', (request, response) => {
    Contact
        .find({})
        .then(notes => {
            response.send(
                `<div>
                <p> The Phonebook has info for ${notes.length} people</p>
                <p>${new Date()}</p>
            </div>`
            )
        })
});


app.get(`${baseURL}/:id`, (request, response) => {
    const requestID = Number(request.params.id);
    const person = phonebook.find(person => person.id === requestID);

    if (!person) {
        return response.status(404).end()
    }

    response.json(person)
});


app.delete(`${baseURL}/:id`, (request, response) => {
    const requestID = Number(request.params.id);
    phonebook = phonebook.filter(person => person.id !== requestID);

    response.status(204).end()
});

const generateID = () => {
    const maxID = phonebook.length > 0 ? Math.max(...phonebook.map(p => p.id)) : 0;
    return maxID + 1
}

app.post(`${baseURL}`, (request, response) => {
    const newPerson = request.body;

    if (!newPerson.name && newPerson.number) {
        return response.status(400).json({
            error: 'Person must have a name and a number'
        })
    }

    const person = new Contact({
        name: newPerson.name,
        number: newPerson.number
    })

    person
        .save()
        .then(savedNote => {
            response.json(savedNote)
        })
})

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
