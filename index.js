// Load the persons array
const peopleDB = require('./people');

// Configure express
let express = require('express');
app = express();
app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.use(express.static('public'))
app.listen(3000);



// DEFINE THE ROUTES OF THE API

// GET the list of people
app.get('/personas',function(req,res){
    res.json(peopleDB.people);
})

// POST a new person in the array
app.post('/personas',function(req,res){
    // new person comes in the body of the http request
    let  {firstName, lastName, age} = req.body;
    // Check the object in the request is valid
    if ( !personObjectIsValid({firstName, lastName, age}) ){
        res.status(400).send({err:'Invalid object in request body'})
    } else {
        let person = peopleDB.addPerson({firstName, lastName, age})
        res.json(
            person
        );
    }
})

// PUT to update the data of a person in the array
app.put('/personas/:id',function(req,res){
    // Id of the person entry in the DB
    let id = parseInt(req.params.id);
    // Check that there is a user with the requested id
    let person = peopleDB.people.find( person => person.id === id);
    if (person === undefined){
        res.status(404).send('Not found');
        return;
    }
    // Check the object in the request is valid and then update the entry
    let  {firstName, lastName, age} = req.body;
    if ( !personObjectIsValid({firstName, lastName, age}) ){
        res.status(400).send({err:'Invalid object in request body'})
    } else {
        person.firstName = firstName;
        person.lastName = lastName;
        person.age = age;
        res.json(
            person
        );
    }    
})

// Delete to remove a person from the array
app.delete('/personas/:id',function(req,res){
    // Id of the person entry in the DB
    let id = parseInt(req.params.id);
    // Check that there is a user with the requested id
    let person = peopleDB.people.find( person => person.id === id);
    if (person === undefined){
        res.status(404).send('Not found');
    } else{
        let removePosition = peopleDB.people.findIndex(p=>p.id == id);
        console.log(removePosition);
        peopleDB.people.splice(removePosition,1);
        res.json(person);
    }
})


function personObjectIsValid({firstName, lastName, age}) {
    return !(
        [firstName,lastName,age].some( e => (e === undefined || e === '') ) ||
        (typeof age != 'number') || age <0
    );
}