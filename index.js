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

app.get('/api/persons', (request, response) => {
    Contact
        .find({})
        .then(notes => {
            console.log(notes.length)
            console.log(notes)
            response.json(notes)
        })
        .catch(error => next(error))
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
        .catch(error => error)
});

app.get('/api/persons/:id', (request, response, next) => {
    console.log(request.params.id)
    Contact
        .findById(request.params.id)
        .then(note => {
            if (note) {
                response.json(note)
            } else {
                response
                    .status(400)
                    .end()
            }
        })
        .catch(error => next(error))
})



app.delete(`/api/persons/:id`, (request, response) => {
    Contact
        .findByIdAndDelete(request.params.id)
        .then(result => {
            response
                .status(204)
                .end()
        })
        .catch(error => next(error))
});

app.post(`/api/persons`, (request, response) => {
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
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    if (error.message === 'CastError') {
        response
            .status(400)
            .send({
                error: 'malformatted URL'
            })
    }
}

app.use(errorHandler);
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
