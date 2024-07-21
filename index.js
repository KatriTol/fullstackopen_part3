const express = require('express')
const app = express()

app.use(express.json())

let persons = [ {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": "1"
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": "2"
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": "3"
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": "4"
  }
]


app.get('/info', (request, response) => {
    const count = persons.length
    const currentDate = new Date()
  
    const content = `
      <p>Phonebook has info for ${count} people</p>
      <p>${currentDate}</p>
    `
    response.send(content)
  })
  
app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  const PORT = 3001
  app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })