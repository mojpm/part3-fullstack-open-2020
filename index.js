const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'));

morgan.token('logpost', (req, res) => {
    console.log(res.body);
})
app.use(morgan('logpost'))

let phonebook = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456'
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5323523'
    },
    {
        id: 3,
        name: 'Dan Abramov',
        number: '12-43-234345'
    },
    {
        id: 4,
        name: 'Mary Poppendick',
        number: '39-23-6423122'
    }
]

const baseURL = '/api/persons';

app.get('/', (req, res) => {
    res.send('<h1>Hello from the server</h1>')
});

app.get(baseURL, (request, response) => {
    response.json(phonebook)
});

app.get(`${baseURL}/:id`, (request, response) => {
    const requestID = Number(request.params.id);
    const person = phonebook.find(person => person.id === requestID);

    if (!person) {
        return response.status(404).end()
    }

    response.json(person)
});

app.get('/info', (request, response) => {

    response.send(`
    <div>
        <p> The Phonebook has info for ${phonebook.length} people</p>
        <p>${new Date()}</p>
    </div>
    `)
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

    if (phonebook.find(person => person.name === newPerson.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateID(),
        name: newPerson.name,
        number: newPerson.number
    }
    phonebook = phonebook.concat(person);
    response.json(phonebook);
})

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});

