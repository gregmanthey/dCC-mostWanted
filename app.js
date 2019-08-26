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
    let displayOption = promptFor("Found " + person.firstName + " " + person.lastName + " . Do you want to know their Info (i), Family (f), or Descendants (d)? Type the option you want or Restart (r) or Quit (q)", charsLetters);
    switch(displayOption){
      case "info":
      case "i":
        displayPerson(person);
        break;
      case "family":
      case "f":
        displayFamily(people, person);
        break;
      case "descendants":
      case "d":
        displayDescendants(searchForDescendants(people, person.id));
        break;
      case "restart":
      case "r":
        app(people);
        return;
      case "quit":
      case "q":
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
  let query = promptFor("Do you want to search by Gender (g), Date of Birth (d), Height (h), Weight (w), Eye Color (e), or Occupation (o)? Type the option you want.", charsLetters);
  let possibleSuspects;
  switch(query) {
    case "gender":
    case "g":
      possibleSuspects = searchByGender(people);
      break;
    case "date of birth":
    case "d":
      possibleSuspects = searchByDob(people);
      break;
    case "height":
    case "h":
      possibleSuspects = searchByHeight(people);
      break;
    case "weight":
    case "w":
      possibleSuspects = searchByWeight(people);
      break;
    case "eye color":
    case "e":
      possibleSuspects = searchByEyeColor(people);
      break;
    case "occupation":
    case "o":
      possibleSuspects = searchByOccupation(people);
      break;
    default:
      alert("Please enter a valid input, lest you be sent to the Perseus Veil.");
      return searchByTraits(people);
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

function searchParents(people, person){
  let parent = [];
  for(let i = 0; i < people.length; i++){
    if(person.parents.includes(people[i].id)){
      parent.push(people[i]);
    }
  }
  return parent;
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
  let suspectParents = searchParents(people, person);
  let alertList = "Immediate family members of " + person.firstName + " " + person.lastName + ":\n\n";
  alertList += "Parents:\n";
  if(suspectParents.length === 0){
    alertList += "No known parents\n"
  }
  else{
    for(let i = 0; i < suspectParents.length; i++){
      alertList += suspectParents[i].firstName + " " + suspectParents[i].lastName + "\n";
    }
  }
  alertList += "\nSpouse:\n";
  if(suspectSpouse.length === 0){
    alertList += "No known spouses\n"
  }
  else{
    alertList += suspectSpouse[0].firstName + " " + suspectSpouse[0].lastName + "\n";
  }
  alertList += "\nChildren:\n";
  if(suspectChildren.length === 0){
    alertList += "No known children\n"
  }
  else{
    for(let i = 0; i < suspectChildren.length; i++){
      alertList += suspectChildren[i].firstName + " " + suspectChildren[i].lastName + "\n";
    }
  }
  alert(alertList);
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
    let validLetters = /[^a-zA-Z]{1,}/g;
  if(!validLetters.test(input) || input === "eye color"){
    return true; //default validation only
  }
  else{
    alert("Please enter only valid characters.\nAccepted characters:\nletters");
    return false;
  }
}

function charsNumbers(input){
  let validNumbers = /[^-/.0-9]{1,}/g;
  if(!validNumbers.test(input)){
    return true; //default validation only
  }
  else{
    alert("Please enter only valid characters.\nAccepted characters:\nnumbers, / or . or - (for dates)");
    return false;
  }
}

function removeLeadingZeros(input){
  let leadingZeroes = /^0+/;
  let subsequentleadingZeros = /[-/.]0+|[-.]/g;
  if(leadingZeroes.test(input) || subsequentleadingZeros.test(input)){
    input = input.replace(leadingZeroes, "");
    input = input.replace(subsequentleadingZeros, "/");
  }

  return input;
}

