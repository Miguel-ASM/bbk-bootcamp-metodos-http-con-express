const peopleDB = {
    people : [],
    newId  : 0,
    addPerson : function({firstName,lastName,age}){
        let person = {
            id: ++this.newId,
            ...{
                firstName,
                lastName,
                age
            }
        };
        this.people.push(person)
        return person;
    }
}

let people = [
    {
        firstName : "Miguel Ángel",
        lastName  : "Simón Martínez",
        age       : 29,
    },
    {
        firstName : "Cecilia",
        lastName  : "d'Angelo",
        age       : 30,
    },
    {
        firstName : "Miguel Ángel",
        lastName  : "Simón Torres",
        age       : 61,
    },
    {
        firstName : "Predestinación",
        lastName  : "Martínez Sánchez",
        age       : 54,
    },
    {
        firstName : "Ornella",
        lastName  : "Morana",
        age       : 32,
    },
    {
        firstName : "Adrián",
        lastName  : "Parra Rodríguez",
        age       : 32,
    },

]

people.forEach(person=>peopleDB.addPerson(person));

module.exports = peopleDB;