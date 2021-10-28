// Load the persons array
let people = require('./people');

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
    res.json(people);
})

// POST a new person in the array
app.post('/personas',function(req,res){
    // new person comes in the body of the http request
    let  {firstName, lastName, age} = req.body;
    // Check the object in the request is valid
    if ( [firstName,lastName,age].some( e => (e === undefined || e === '') ) ||
        ((typeof age != 'number') || age <0)
    ) {
        res.status(400).send({err:'Invalid object'})
    }
    // Check unicity of the persons name in the db
    else if ( people.some(p=>p.firstName === firstName) ){
        res.status(409).send({err:'Duplicated name!'})
    } else {
        let personIndex = people.push({firstName, lastName, age}) - 1;
        res.json(
            {
                firstName,
                lastName,
                age
            }
        );
    }
})