let personTable = document.querySelector('table');
let personTableBody = personTable.querySelector('tbody');
let addPersonForm = document.querySelector('#addPersonForm');
let myModal = document.querySelector('#myModal');
let closeModalButton = document.querySelector('#myModal span.close');
let updatPersonForm = document.querySelector('#updatePersonForm');


// Load the people list from the API
showPersonsList();


// Events of the modal window

// Close the modal if the user clicks X
closeModalButton.addEventListener('click',()=>{
    myModal.style.display = "none";
})

// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click',event => {
    if (event.target == myModal) {
        myModal.style.display = "none";
    }
});

// Variable to save the id of the user that is going to be updated in the modal
let updatingUserId;
// Variable to store the table row of the user that it is going to be updated
let updatingUserRow;

// event for modal form submit
updatPersonForm.addEventListener('submit',event=>{
    event.preventDefault();
    let requestBody = {
        firstName : updatPersonForm.elements['firstName'].value,
        lastName : updatPersonForm.elements['lastName'].value,
        age : parseInt(updatPersonForm.elements['age'].value)
    }
    if (requestBody.age < 0){
        alert('age can not be negative!')
        return;
    }
    fetch(
        `/personas/${updatingUserId}`,
        {
            method : 'PUT',
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
    .then(({firstName,lastName,age})=>{
        // Clear and hide the person update form
        updatPersonForm.reset();
        myModal.style.display = 'none';
        // Update the content of the row with the response content
        let rowCells = updatingUserRow.querySelectorAll('td');
        rowCells[0].innerHTML = firstName;
        rowCells[1].innerHTML = lastName;
        rowCells[2].innerHTML = age;
    })
    .catch(alert);
})

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
            row.remove();
        })
        .catch(alert);
    });

    row.querySelector('.editPersonButton').addEventListener('click',()=>{
        // Set the id of the user that is going to be modified and the reference
        // to its row in the table
        updatingUserId = person.id;
        updatingUserRow = row;
        // Update the fields in the form with the content of the table row
        let rowData = row.querySelectorAll('td');
        updatPersonForm.elements['firstName'].value = rowData[0].innerHTML;
        updatPersonForm.elements['lastName'].value  = rowData[1].innerHTML;
        updatPersonForm.elements['age'].value       = rowData[2].innerHTML;
        // Display the form
        myModal.style.display = "block";
    })
}

