const express = require('express')
const morgan = require('morgan')
const app = express()
require('dotenv').config()

const Person = require('./models/person')

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  } 
  else if (error.isAxiosError) {
    return response.status(error.response.status).json({ 
      error: error.response.data.error || 'Axios error' 
    })
  }
  

  next(error)
}
const cors = require('cors')
app.use(express.static('dist'))

app.use(cors())
app.use(express.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
// app.use(morgan(':body'))

let persons = [ 
]

app.get('/info', (request, response,next) => {
  Person.countDocuments({}).then(count => {
    const currentDate = new Date()
    const content = `
      <p>Phonebook has info for ${count} people</p>
      <p>${currentDate}</p>
    `
    response.send(content)
  })
  .catch(error => next(error))
})


app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
    })
    .catch(error => next(error))
  })


app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error)
    )

}
)


app.delete('/api/persons/:id', (request, response,next) => {
Person.findByIdAndDelete(request.params.id)
.then(result => {
  response.status(204).end()
})
.catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
  const body = request.body
  // alla olevat tarkistukset eivät toimi
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
      
  
    const person = new Person({
      name: body.name,
      number: body.number,
    })

    person.save()
      .then(savedPerson => {
        response.json(savedPerson) 
        
      })
      .catch(error => next(error))
      
      
  })
  

      
  
  // PUT-reitti olemassa olevan henkilön päivittämiseksi
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})  

  app.use(errorHandler)    

  const PORT = process.env.PORT
  // const PORT = process.env.PORT || 3001
  // const PORT = 3001
  app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
    