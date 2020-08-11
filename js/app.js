//global variables
let employees = [];
let employeeNames = [];
const randomUserUrl = `https://randomuser.me/api/?results=12&inc=name, picture,
email, location, phone, dob &noinfo &nat=US`;
const gridContainer = document.querySelector('.grid-container');
const overlay = document.querySelector('.overlay');
const modalContainer = document.querySelector('.modal-content');
const modalClose = document.querySelector('.modal-close');

//uses the employee data received by the API and displays it on the page
function displayEmployees(employeeData) {
  employees = employeeData;
  let employeeHTML = '';
  
  employees.forEach((employee, index) => {
    let name = employee.name;
    let email = employee.email;
    let city = employee.location.city;
    let picture = employee.picture;

    employeeHTML += `
      <div class="card" data-index="${index}" id="card-${index}">
        <img class="profile-image" src="${picture.large}">
        <div class="text-container">
          <h2 class="name">${name.first} ${name.last}</h2>
          <p class="email">${email}</p>
          <p class="address">${city}</p>
        </div>
      </div>
    `
    employeeNames.push({name: `${employee.name.first.toLowerCase()} ${employee.name.last.toLowerCase()}`, index: `${index}`});

  })
  gridContainer.innerHTML = employeeHTML;
}

//displays the modal given the employee index 
function displayModal(index) {
  let {name, dob, phone, email,
  location: {city, street, state, postcode}, 
  picture }  = employees[index];

  let date = new Date(dob.date);
  const modalHTML = `
  <img class="profile-image" src="${picture.large}">
  <div class="text-container">
    <div class="arrow-div">
      <img class="previous-arrow" src="images/prev.png" data-index="${index}">
      <img class="next-arrow" src="images/next.png" data-index="${index}">
    </div>
    <h2 class="name">${name.first} ${name.last}</h2>
    <p class="email">${email}</p>
    <p class="address">${city}</p>
    <hr  />
    <p>${phone}</p>
    <p class="address">${street.number} ${street.name}, ${state} ${postcode}</p>
    <p>Birthday: 
    ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
  </div>
  `;

  overlay.classList.remove('hidden');
  modalContainer.innerHTML = modalHTML;
}


//fetches the employee data from the API 
fetch(randomUserUrl)
  .then(response => response.json())
  .then(response => response.results)
  .then(displayEmployees)
  .catch(err => console.log(err))


//calls the displayModal function when a .card div is clicked 
//passes the index of the nearest .card div as an argument to the displayModal function
gridContainer.addEventListener('click', event => {
  if (event.target !== gridContainer) {
    const card = event.target.closest('.card');
    const index = card.getAttribute('data-index');
    
    displayModal(parseInt(index));
  }
});

//closes the modal when the 'X' is clicked 
modalClose.addEventListener('click', event => {
  overlay.classList.add('hidden');
});

//each time a key is pressed in the search bar this code does the following
//stores the text value of the search bar in the 'search' variable
//checks each employee name to see if the name includes the text content of the search variable
//if the condition is true, the .card div is displayed
//if the condition is false, the .card div is hidden 
$('.search-bar').on('keyup', function() {
  let search = $('.search-bar').val();
  search = search.toLowerCase();

  for (let i = 0; i <= 11; i++) {
    let card = $(`#card-${i}`);
    let name = employeeNames[i].name.toLowerCase();
    
    if (name.includes(search)) {
      card.show();
    } else {
      card.hide();
    } 
  }
})
 
//this code displays the previous employee if the .previous-arrow image is clicked
//and displays the next employee if the .next-arrow image is clicked 
modalContainer.addEventListener('click', function(event) {
  if (event.target.className === 'previous-arrow') {
    let index = event.target.getAttribute('data-index');
    index = parseInt(index);
    if (index > 0) {
      index -= 1;
      displayModal(index);
    } 
  } else if (event.target.className === 'next-arrow')  {
    let index = event.target.getAttribute('data-index');
    index = parseInt(index);
    if (index < 11) {
      index += 1;
      displayModal(index);
    } 
  } 
})