

const express = require('express')
const morgan = require('morgan')
const app = express()
const bodyParser = require('body-parser')

const Contact = require('./models/contact')

morgan.token('body', (req, res) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  } else {
    return ' '
  }
})

app.use(
  express.static('build'),
  bodyParser.json(),
  morgan(':method :url :status :res[content-length] - :response-time ms :body'),
)

let people = [
]

app.get('/info', (req, res) => {
  total_people = people.reduce((acc, cur) => acc += 1, 0);
  date_now = new Date()
  res.send(`<p>Puhelinluettelossa on ${total_people} henkilön tiedot<br/>${date_now}`)
})

app.get('/api/persons', (req, res) => {
  Contact.find({}).then(people => {
    people = people
    res.json(people.map(person => person.toJSON()))
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Contact.findById(req.params.id)
    .then(contact => {
      if (contact) {
        res.json(contact.toJSON())
      } else {
        res.status(204).end()
      }
    })
    .catch(error => next(error))
})

const generateId = () => {
  const newId = Math.floor(Math.random() * Math.floor(1000000))
  return newId
}

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  
  const person = new Contact({
    name: body.name,
    number: body.number
  })
  
  person.save()
    .then(savedPerson => {
      res.json(savedPerson.toJSON())
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const contact = {
    name: body.name,
    number: body.number
  }

  Contact.findByIdAndUpdate(req.params.id, contact, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  
  Contact.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})