const express = require('express')
const morgan = require('morgan')
const app = express()
require('dotenv').config()

const Person = require('./models/person')
const cors = require('cors')
app.use(express.static('dist'))

app.use(cors())
app.use(express.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
// app.use(morgan(':body'))

let persons = [ 
]

app.get('/info', (request, response) => {
  Person.countDocuments({}).then(count => {
    const currentDate = new Date()
    const content = `
      <p>Phonebook has info for ${count} people</p>
      <p>${currentDate}</p>
    `
    response.send(content)
  })
})



/*
app.get('/api/persons', (request, response) => {
    response.json(persons)
  })
*/
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
    })
  })


app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.error('Error retrieving person by ID:', error)
      response.status(400).send({ error: 'malformatted id' })
    })

}
)



app.delete('/api/persons/:id', (request, response) => {
        const id = request.params.id
        persons = persons.filter(person => person.id !== id)
      
        response.status(204).end()
      })

      /*
      const generateId = () => {
        return Math.floor(Math.random() * 1000000)
      }
    */
app.post('/api/persons', (request, response) => {
  const body = request.body
      
    if (!body.name) {
      return response.status(400).json({ 
      error: 'name missing' 
      })
      }
    if (!body.number) {
      return response.status(400).json({ 
      error: 'number missing' 
      })
      }
  // Tarkistetaan, onko tietokannassa jo henkilö samalla nimellä
  Person.findOne({ name: body.name })
  .then(existingPerson => {
    // Jos henkilö löytyy, palautetaan virheilmoitus
    if (existingPerson) {
      return response.status(400).json({ error: 'name must be unique' })
    }

    // Jos henkilöä ei löydy, luodaan uusi henkilö ja tallennetaan tietokantaan
    const person = new Person({
      name: body.name,
      number: body.number,
    })

    person.save()
      .then(savedPerson => {
        response.json(savedPerson) 
      })
      
  })
    })
      
    
      

  const PORT = process.env.PORT
  // const PORT = process.env.PORT || 3001
  // const PORT = 3001
  app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
    