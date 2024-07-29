const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

// Määrittelee Person-scheman, jossa on name ja number -kentät
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
      },
    number: {
        type: String,
        required: true,
        validate: {
            // validointifunktio:
            validator: function(v) {
              // 2-3 merkkiä + väliviiva+ vähintään 5 merkkiä
              return /^\d{2,3}-\d{5,}$/.test(v);
            },
            
            message: props => `${props.value} is not a valid phone number!`
          }
      },
  })

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)