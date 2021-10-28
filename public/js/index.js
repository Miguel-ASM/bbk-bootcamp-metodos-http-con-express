let personTable = document.querySelector('table');
let personTableBody = personTable.querySelector('tbody');
let addPersonForm = document.querySelector('#addPersonForm');

showPersonsList();

addPersonForm.addEventListener('submit',(event)=>{
    event.preventDefault();
    let form = event.target;
    let requestBody = {
        firstName : form.elements['firstName'].value,
        lastName : form.elements['lastName'].value,
        age : parseInt(form.elements['age'].value)
    }
    if (requestBody.age < 0){
        alert('age can not be negative!')
        return;
    }
    form.reset();
    fetch(
        '/personas',
        {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify(requestBody)
        }
    ).then(response=>{
        if (response.ok){
            return response.json()
        } else {
            throw `Error code ${response.status}`;
        }
    })
    .then(createPersonHtml)
    .catch(alert);
})


function showPersonsList(){
    fetch('/personas')
    .then(response=>response.json())
    .then( persons=>persons.forEach(createPersonHtml) )
}

function createPersonHtml(person){
    let row = document.createElement('tr');
    personTableBody.appendChild(row);
    row.innerHTML = `
    <td>${person.firstName}</td>
    <td>${person.lastName}</td>
    <td>${person.age}</td>
    <td>
        <button class="editPersonButton">
            edit
        </button>
        <button class="removePersonButton">
            remove
        </button>
    </td>
    `
    // Add event listeners to the buttons
    row.querySelector('.removePersonButton').addEventListener('click',()=>{
        fetch(
            `/personas/${person.id}`,
            {
                method : 'DELETE',

            }
        ).then(response=>{
            if (response.ok){
                return response.json()
            } else {
                throw `Error code ${response.status}`;
            }
        })
        .then(data=>{
            alert(`${data.firstName} ${data.lastName} has been deleted`);
            row.remove();
        })
        .catch(alert);
        })
}

