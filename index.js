const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

let people = [
  {
    id: 0,
    name: 'lauri',
    number: '0123456789',
  },
  {
    id: 1,
    name: 'lauri',
    number: '0123456789',
  },
  {
    id: 2,
    name: 'lauri',
    number: '0123456789',
  },
  {
    id: 3,
    name: 'lauri',
    number: '0123456789',
  },
  {
    id: 4,
    name: 'lauri',
    number: '0123456789',
  },
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>')
})

app.get('/info', (req, res) => {
  total_people = people.reduce((acc, cur) => acc += 1, 0);
  date_now = new Date()
  res.send(`<p>Puhelinluettelossa on ${total_people} henkilön tiedot<br/>${date_now}`)
})

app.get('/api/persons', (req, res) => {
  res.json(people)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = people.find(person => person.id === id)
  
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

const generateId = () => {
  const newId = Math.floor(Math.random() * Math.floor(1000000))
  return newId
}

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({
      error: 'you need to send both name and a number'
    })
  }

  if (people.find(person => person.name === body.name)) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }
  
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  people = people.concat(person)

  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  people = people.filter(person => person.id !== id);

  res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log('running')
})