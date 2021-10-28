fetch('/personas')
.then(r=>r.json())
.then(data=>data.forEach(person=>console.log(person.firstName)));

