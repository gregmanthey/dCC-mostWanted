"use strict"

function app(people){
  let searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  let searchResults;
  switch(searchType){
    case 'yes':
      searchResults = searchByName(people);
      break;
    case 'no':
      searchResults = narrowSuspectsToOne(people);
      break;
      default:
    app(people);
      break;
  }
  
  mainMenu(searchResults, people);
}

function mainMenu(person, people){
  if(!person){
    alert("Could not find that individual.");
    return app(people);
  }

  while(true) {
    let displayOption = promptFor("Found " + person.firstName + " " + person.lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'", charsLetters);
    switch(displayOption){
      case "info":
        displayPerson(person);
      break;
      case "family":
        displayFamily(people, person);
      break;
      case "descendants":
        displayDescendants(searchForDescendants(people, person.id));
      break;
      case "restart":
      app(people);
      break;
      case "quit":
      return;
      default:
      return mainMenu(person, people);
    }
  }
}

function narrowSuspectsToOne(people){
  while(people.length > 1){
    people = searchByTraits(people);
  }

  let person = people[0];
  return person;
}

// Search Functions
function searchByName(people){
  let firstName = promptFor("What is the person's first name?", charsLetters);
  let lastName = promptFor("What is the person's last name?", charsLetters);

  let foundPerson = people.filter(function(person){
    if(person.firstName.toLowerCase() === firstName.toLowerCase() && person.lastName.toLowerCase() === lastName.toLowerCase()){
      console.log(person.firstName + person.lastName);
      return true;
    }
    else{
      return false;
    }
  });

  foundPerson = foundPerson[0];
  return foundPerson;
}

function searchByTraits(people){
  let query = promptFor("Do you want to search by 'gender', 'birthday', 'height', 'weight', 'eye color', or 'occupation'? Type the option you want or 'restart' or 'quit'.", charsLetters);
  let possibleSuspects;
  switch(query) {
    case "gender":
      possibleSuspects = searchByGender(people);
      break;
    case "birthday":
      possibleSuspects = searchByDob(people);
      break;
    case "height":
      possibleSuspects = searchByHeight(people);
      break;
    case "weight":
      possibleSuspects = searchByWeight(people);
      break;
    case "eye color":
      possibleSuspects = searchByEyeColor(people);
      break;
    case "occupation":
      possibleSuspects = searchByOccupation(people);
      break;
    case "restart":
      app(people);
      break;
    default:
      alert("Please enter a valid input, n00b.")
      searchByTraits(people);
      break;
  }
  if(possibleSuspects.length > 1){
    alert(possibleSuspects.length + " possible suspects remain:");
    displayPeople(possibleSuspects);
  }
  return possibleSuspects;
}

function searchByGender(people){
  let gender = promptFor("What is the person's gender?", charsLetters);

  let peopleWithGender = people.filter(function (person){
    if(person.gender.toLowerCase() === gender.toLowerCase()){
      return true;
    }
  });
  
  return peopleWithGender;
}

function searchByDob(people){
  let dob = promptFor("What is the person's date of birth?", charsNumbers);
  dob = removeLeadingZeros(dob);

  let peopleWithDob = people.filter(function (person){
    if(person.dob === dob){
      return true;
    }
  });
  
  return peopleWithDob;
}

function searchByHeight(people){
  let height = promptFor("What is the person's height?", charsNumbers);

  let peopleWithHeight = people.filter(function (person){
    if(person.height == height){
      return true;
    }
  });
  
  return peopleWithHeight;
}

function searchByWeight(people){
  let weight = promptFor("What is the person's weight?", charsNumbers);

  let peopleWithWeight = people.filter(function (person){
    if(person.weight == weight){
      return true;
    }
  });

  return peopleWithWeight;
}

function searchByEyeColor(people){
  let eyeColor = promptFor("What is the person's eye color?", charsLetters);

  let peopleWithEyeColor = people.filter(function (person){
    if(person.eyeColor.toLowerCase() === eyeColor.toLowerCase()){
      return true;
    }
  });

  return peopleWithEyeColor;
}

function searchByOccupation(people){
  let occupation = promptFor("What is the person's occupation?", charsLetters);

  let peopleWithOccupation = people.filter(function (person){
    if(person.occupation.toLowerCase() === occupation.toLowerCase()){
      return true;
    }
  });

  return peopleWithOccupation;
}

function searchSpouse(people, person){
  let spouse = [];
  for(let i = 0; i < people.length; i++){
    if(people[i].currentSpouse == person.id){
      spouse.push(people[i]);
    }
  }
  return spouse;
}

function searchChildren(people, person){
  let children = [];
  for(let i = 0; i < people.length; i++){
    if(people[i].parents.includes(person.id)){
        children.push(people[i]);
    }
  }
  return children;
}

function searchForDescendants(people, SSN, children = []){ 
  for(let i = 0; i < people.length; i++){
    if(people[i].parents.includes(SSN)){
      children.push(people[i]);
      searchForDescendants(people, people[i].id, children);
    }
  }
  return children;
}

// Display Functions
function displayPeople(people){
  alert(people.map(function(person){
    return person.firstName + " " + person.lastName;
  }).join("\n"));
}

function displayPerson(person){
  let personInfo = "First Name: " + person.firstName + "\n";
  personInfo += "Last Name: " + person.lastName + "\n";
  personInfo += "Height: " + person.height + "\n";
  personInfo += "Weight: " + person.weight + "\n";
  personInfo += "Age:" + calculateAge(person.dob) + "\n";
  personInfo += "Occupation: " + person.occupation + "\n";
  personInfo += "Eye color: " + person.eyeColor + "\n";
  alert(personInfo);
}

function displayFamily(people, person) {
  let suspectSpouse = searchSpouse(people, person);
  let suspectChildren = searchChildren(people, person);
  
  alert(person.firstName + " has " + suspectChildren.length + " children:");
  displayPeople(suspectChildren);
  
  alert(person.firstName + " has " + suspectSpouse.length + " current spouse\(s\):");
  displayPeople(suspectSpouse);
}

function displayDescendants(descendants){
  
  if(descendants.length > 0){
    let listOfDescendants = "Their descendants are: \n";
    for(let i = 0; i < descendants.length; i++){
      listOfDescendants += descendants[i].firstName + " " + descendants[i].lastName + "\n";
    }
    alert(listOfDescendants);
  }
  else {
    alert("No known descendants. The blood line ends here.");
  }

}

// Calculations
function calculateAge(dob){
  let today = new Date();
  today = [today.getMonth() + 1, today.getDate(), today.getFullYear()];
  let dobArray = dob.split("/");
  let age = today[2] - dobArray[2];
  if (today[0] < dobArray[0] || 
    (today[0] == dobArray[0] && today[1] < dobArray[1])) {
    age -= 1;
  }
  return age;
}

// Prompts/Inputs/Filters
function promptFor(question, valid){
  do{
    var response = prompt(question).trim().toLowerCase();
  } 
  while(!response || !valid(response));
  return response;
}

function yesNo(input){
  return input.toLowerCase() == "yes" || input.toLowerCase() == "no";
}

function charsLetters(input){
    // remove leading zeros
    // accept x/x/xxxx or x-x-xxxx
    let validLetters = /[^a-zA-Z]/;
  if(!validLetters.test(input) || input === "eye color"){
    return true; //default validation only
  }
  else{
    alert("Please enter valid characters.\nAccepted characters:\nletters");
    return false;
  }
}

function charsNumbers(input){
  let validNumbers = /[^-/0-9]/;
  if(!validNumbers.test(input)){
    return true; //default validation only
  }
  else{
    alert("Please enter valid characters.\nAccepted characters:\nnumbers, / and - (for dates)");
    return false;
  }
}

function removeLeadingZeros(input){
  if(input[0] == 0){
    input = input.split("").splice(1).join("");
    return input;
    // let afterSlash = input.split("").indexOf("/");
    // console.log(afterSlash);
    // console.log(input);
    // input = input.indexOf(afterSlash+1);
    // console.log(input);
    // return input;
  }
}