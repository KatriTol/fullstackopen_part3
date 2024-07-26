const mongoose = require('mongoose')

// Tarkistaa, onko komentoriviparametreja vähemmän kuin 3
if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

// Ottaa kolmannen komentoriviparametrin, joka on salasana
const password = process.argv[2]

// Luo yhteysosoitteen MongoDB:lle käyttäen salasanaa
const url =
  `mongodb+srv://tolonenkatri:${password}@cluster0.dvcdvx3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// Asettaa Mongoose-konfiguraation
mongoose.set('strictQuery', false)
mongoose.connect(url)

// Määrittelee Person-scheman, jossa on name ja number -kentät
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})


// Luo Person-mallin käyttämällä personSchemaa
const Person = mongoose.model('Person', personSchema)

// jos annetaan vain salasana,tulostetaan kaikki henkilöt
if (process.argv.length===3) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
      })

}

// Jos annetaan salasanan lisäksi nimi ja numero, tallennetaan uusi henkilö
else if(process.argv.length===5) {
const name= process.argv[3]
const number = process.argv[4]
const person = new Person({
  name:name,
  number: number,
})
person.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}
else {
    console.log('give password, name and number to add a new person');
    mongoose.connection.close();
  }

