"use strict"
/*
Build all of your functions for displaying and gathering information below (GUI).
*/

// app is the function called to start the entire application
function app(people){
  let searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  let searchResults;
  switch(searchType){
    case 'yes':
      searchResults = searchByName(people);
      break;
    case 'no':
      searchResults = searchByTraits(people);
      // TODO: search by traits
      break;
      default:
    app(people); // restart app
      break;
  }
  
  // Call the mainMenu function ONLY after you find the SINGLE person you are looking for
  mainMenu(searchResults, people);
}

// Menu function to call once you find who you are looking for
function mainMenu(person, people){

  /* Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people. We need people in order to find descendants and other information that the user may want. */

  if(!person){
    alert("Could not find that individual.");
    return app(people); // restart
  }

  let displayOption = prompt("Found " + person.firstName + " " + person.lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'");

  switch(displayOption){
    case "info":
      displayPerson(person);
    // TODO: get person's info
    break;
    case "family":
    // TODO: get person's family
    break;
    case "descendants":
    // TODO: get person's descendants
    break;
    case "restart":
    app(people); // restart
    break;
    case "quit":
    return; // stop execution
    default:
    return mainMenu(person, people); // ask again
  }
}

function searchByName(people){
  let firstName = promptFor("What is the person's first name?", chars);
  let lastName = promptFor("What is the person's last name?", chars);

  let foundPerson = people.filter(function(person){
    if(person.firstName === firstName && person.lastName === lastName){
      console.log(person.firstName + person.lastName);
      return true;
    }
    else{
      return false;
    }
  });
  foundPerson = foundPerson[0];
  // TODO: find the person using the name they entered XXXX
  return foundPerson;
}

function searchByTraits(people){
  let query = promptFor("Do you want to search by 'gender', 'birthday', 'height', 'weight', 'eye color', or 'occupation'? Type the option you want or 'restart' or 'quit'.", chars);
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
    case "quit":
      return;
      break;
    default:
      alert("Please enter a valid input, n00b.")
      searchByTraits(people);
      break;
  }
  console.log("Possible suspects below:");
  console.log(possibleSuspects);
  return possibleSuspects;
}

function searchByGender(people){
  let gender = promptFor("What is the person's gender?", chars);

  let peopleWithGender = people.filter(function (person){
    if(person.gender === gender){
      return true;
    }
  });

  console.log(peopleWithGender);
  return peopleWithGender;
}

function searchByDob(people){
  let dob = promptFor("What is the person's date of birth?", chars);

  let peopleWithDob = people.filter(function (person){
    if(person.dob === dob){
      return true;
    }
  });

  console.log(peopleWithDob);
  return peopleWithDob;
}

function searchByHeight(people){
  let height = promptFor("What is the person's height?", chars);

  let peopleWithHeight = people.filter(function (person){
    if(person.height == height){
      return true;
    }
  });

  console.log(peopleWithHeight);
  return peopleWithHeight;
}

function searchByWeight(people){
  let weight = promptFor("What is the person's weight?", chars);

  let peopleWithWeight = people.filter(function (person){
    if(person.weight == weight){
      return true;
    }
  });

  console.log(peopleWithWeight);
  return peopleWithWeight;
}
function searchByEyeColor(people){
  let eyeColor = promptFor("What is the person's eye color?", chars);

  let peopleWithEyeColor = people.filter(function (person){
    if(person.eyeColor === eyeColor){
      return true;
    }
  });

  console.log(peopleWithEyeColor);
  return peopleWithEyeColor;
}

function searchByOccupation(people){
  let occupation = promptFor("What is the person's occupation?", chars);

  let peopleWithOccupation = people.filter(function (person){
    if(person.occupation === occupation){
      return true;
    }
  });

  console.log(peopleWithOccupation);
  return peopleWithOccupation;
}

// alerts a list of people
function displayPeople(people){
  alert(people.map(function(person){
    return person.firstName + " " + person.lastName;
  }).join("\n"));
}

function displayPerson(person){
  // print all of the information about a person: XXXXXX
  // height, weight, age, name, occupation, eye color. XXXXXXX
  let personInfo = "First Name: " + person.firstName + "\n";
  personInfo += "Last Name: " + person.lastName + "\n";
  personInfo += "Height: " + person.height + "\n";
  personInfo += "Weight: " + person.weight + "\n";
  personInfo += "Age:" + calculateAge(person.dob) + "\n";
  personInfo += "Occupation: " + person.occupation + "\n";
  personInfo += "Eye color: " + person.eyeColor + "\n";
  alert(personInfo);
}

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

// function that prompts and validates user input
function promptFor(question, valid){
  do{
    var response = prompt(question).trim();
  } 
  while(!response || !valid(response));
  return response;
}

// helper function to pass into promptFor to validate yes/no answers
function yesNo(input){
  return input.toLowerCase() == "yes" || input.toLowerCase() == "no";
}

// helper function to pass in as default promptFor validation
function chars(input){
  return true; // default validation only
}
