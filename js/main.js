/*-----------------
     VARIABLES
------------------*/

//basic inputs
let form = document.querySelector('form');
let basicFieldSet = document.querySelector('.basic');
let nameInput = document.getElementById('name');
let emailInput = document.getElementById('mail');
let jobInput = document.getElementById('title');
let designInput = document.getElementById('design');
let otherInput = document.getElementById('other-title');
// hide other input on page load
addHidden(otherInput);

//color options
let colorSection = document.getElementById('colors-js-puns');
let colorInput = document.getElementById('color');
let cornflowerblueOption = document.querySelector('[value="cornflowerblue"]');
let darkslategreyOption = document.querySelector('[value="darkslategrey"]');
let goldOption = document.querySelector('[value="gold"]');
let tomatoOption = document.querySelector('[value="tomato"]');
let steelblueOption = document.querySelector('[value="steelblue"]');
let dimgreyOption = document.querySelector('[value="dimgrey"]');
//Hide the "Color" label and select menu until a T-Shirt design is selected
addHidden(colorSection);

//activity options
let activitiesFieldSet = document.querySelector('.activities');
let jsFrameworksCheckbox = document.querySelector('[name="js-frameworks"]');
let jslibsCheckbox = document.querySelector('[name="js-libs"]');
let expressCheckbox = document.querySelector('[name="express"]');
let nodeCheckbox = document.querySelector('[name="node"]');
let jsFrameworksLabel = jsFrameworksCheckbox.parentElement;
let jslibsLabel = jslibsCheckbox.parentElement;
let expressLabel = expressCheckbox.parentElement;
let nodeLabel = nodeCheckbox.parentElement;
let npmLabel = document.querySelector('[name="npm"]').parentElement;
let allCheckboxes = document.querySelectorAll('[type="checkbox"]');
let allActivityLabels = document.querySelectorAll('.activities label');

//payment options
let paymentFieldSet =  document.querySelector('.payment-set');
let paymentInput = document.getElementById('payment');
let creditCardInfo = document.getElementById('credit-card');
let paypalInfo = document.getElementById('paypal');
let bitcoinInfo = document.getElementById('bitcoin');
//put credit card as default option
paymentInput.value = 'credit card';
addHidden(paypalInfo);
addHidden(bitcoinInfo);



/*-------------------------
  INPUT TOGGLING FUNCTIONS
---------------------------*/


//remove hidden class
function removeHidden(element){
  if (element != null){
    if (element.getAttribute("class").indexOf("is-hidden") > -1) {
      element.className -= " is-hidden";
    }
  }
}


//add hidden class
function addHidden(element){
  //make sure to not add duplicate hidden classes
  if (element.getAttribute("class") == null || element.getAttribute("class").indexOf("is-hidden") === -1){
    element.className += " is-hidden";
  }
}


//toggle adding and removing other input if job title is "other"
function toggleInput() {
  if (jobInput.value === 'other'){
    removeHidden(otherInput);
  } else {
    addHidden(otherInput);
  }
}


//check for colors in DOM based on attribute value and add if they dont exist
function checkAndAddColor(color, option){
  if (colorInput.querySelector(`[value="${color}"]`) === null){
    colorInput.appendChild(option);
  }
}


//toggle the colors that should be shown for each theme
function toggleColors() {
  if (designInput.value === 'js puns'){
    //first show color section
    removeHidden(colorSection);
    //then correct options
    colorInput.removeChild(tomatoOption);
    colorInput.removeChild(steelblueOption);
    colorInput.removeChild(dimgreyOption);
    checkAndAddColor("cornflowerblue", cornflowerblueOption);
    checkAndAddColor("darkslategrey", darkslategreyOption);
    checkAndAddColor("gold", goldOption);
  } else if (designInput.value === 'heart js'){
    //same as up top but different options
    removeHidden(colorSection);
    colorInput.removeChild(cornflowerblueOption);
    colorInput.removeChild(darkslategreyOption);
    colorInput.removeChild(goldOption);
    checkAndAddColor("tomato", tomatoOption);
    checkAndAddColor("steelblue", steelblueOption);
    checkAndAddColor("dimgrey", dimgreyOption);
  } else {
    //if none selected hide color section
    addHidden(colorSection);
  }
}


//disable and enable checkbox
function toggleCheckbox(checkbox, conflictingCheckbox, label){
  if (checkbox.checked){
    conflictingCheckbox.disabled = true;
    //add class to show checkbox is disabled more clearly
    label.setAttribute("class", "disabled");
  } else {
    conflictingCheckbox.disabled = false;
    //remove disabled styling
    label.removeAttribute("class");
  }
}


//toggle disabled for activities upon time conflicts
function toggleActivities() {
  toggleCheckbox(jsFrameworksCheckbox, expressCheckbox, expressLabel);
  toggleCheckbox(jslibsCheckbox, nodeCheckbox, nodeLabel);
  toggleCheckbox(expressCheckbox, jsFrameworksCheckbox, jsFrameworksLabel);
  toggleCheckbox(nodeCheckbox, jslibsCheckbox, jslibsLabel);
}


//get all checked prices
function getPriceTotal(){
  let prices = [];
  let checkedPrices = [];
  //first collect all prices
  allActivityLabels.forEach((label) => {
    //find the index value of price, then take that substring and set it to price variable. (make sure its a number)
    let price = parseInt(label.innerText.substr(label.innerText.indexOf("$") + 1));
    //push price to array of all prices
    prices.push(price);
  });
  //second correlate checkboxes with prices
  allCheckboxes.forEach((checkbox, i) => {
    if (checkbox.checked){
      //push price into new array if box is checked
      checkedPrices.push(prices[i]);
    }
  });
  //reduce array to return total sum
  let total = checkedPrices.reduce((sum, price) => {
    return sum + price;
  }, 0);

  return total;
}


//adds price element to end of activities field set
function addPricetoDOM(){
  //checks if price element exists and then removes old element
  if (activitiesFieldSet.querySelector('h2') != null){
    let priceElement = activitiesFieldSet.querySelector('h2');
    activitiesFieldSet.removeChild(priceElement);
  }
  //adds new price element with new total
  let priceElement = document.createElement('h2');
  activitiesFieldSet.appendChild(priceElement);
  let price = document.createTextNode(`$${getPriceTotal()}`);
  priceElement.appendChild(price);
}


//toggles payment info based on input value
function togglePaymentInfo(){
  if (paymentInput.value === "select_method"){
    addHidden(creditCardInfo);
    addHidden(paypalInfo);
    addHidden(bitcoinInfo);
  } else if (paymentInput.value === "credit card"){
    removeHidden(creditCardInfo);
    addHidden(paypalInfo);
    addHidden(bitcoinInfo);
  } else if (paymentInput.value === "paypal"){
    addHidden(creditCardInfo);
    removeHidden(paypalInfo);
    addHidden(bitcoinInfo);
  } else if (paymentInput.value === "bitcoin"){
    addHidden(creditCardInfo);
    addHidden(paypalInfo);
    removeHidden(bitcoinInfo);
  }
}



/*-----------------------------
  FORM VALIDATION FUNCTIONS
------------------------------*/


//add error message and adds classes to input
function addError(input, id, msg, parent, errorTotal){
  if (document.getElementById(id) == null){
    let span = document.createElement("span");
    span.setAttribute("id", id);
    span.setAttribute("class", "error");
    span.innerText = msg;
    parent.insertBefore(span, input.nextSibling);
  }
}


//removes error message from input
function removeError(id, parent, errorTotal){
  let span = document.getElementById(id);
  if (span != null){
    parent.removeChild(span);
  }
}


//check input for validation errors
function checkInput(input, id, msg, parent, ...conditions){
  //if any condition comes back as true store in variable
  let isTrue = conditions.some(condition => condition === true);
  //if true is stored in variable add error to DOM
  if (isTrue) {
    addError(input, id, msg, parent);
    //if no condition is true come back false and remove error if it exists
  } else {
    removeError(id, parent);
  }
}


//function that gets total number errors appended to DOM
function getErrorTotal() {
  let errors = document.querySelectorAll('.error');
  return errors.length;
}


//validates form
function validateForm(input){
  // Name field can't be blank
  console.log(input);
  if (input.id === "name" || input.id === "sign-up-form"){
    // blank conditions
    let nameNull = nameInput.value == null;
    let nameEmpty = nameInput.value == "";
    checkInput(nameInput, "name-loc", "Please enter a name", basicFieldSet, nameNull, nameEmpty);
  }

  //email cant be blank
  if (input.id === "mail" || input.id === "sign-up-form"){
    let emailNull = emailInput.value == null;
    let emailEmpty = emailInput.value == "";
    checkInput(emailInput, "mail-loc", "Email field can't be blank", basicFieldSet, emailEmpty, emailNull);
  }

  // Email field must be a validly formatted e-mail address
  // dont run unless other email error doesnt exist
  if (emailInput.value != null && input.id === "mail" || input.id === "sign-up-form"){
    let atposition=emailInput.value.indexOf("@");
    let dotposition=emailInput.value.lastIndexOf(".");
    let atPositionNotFirst = atposition<1;
    let dotPositionAfterAt = dotposition<atposition+2;
    let dotPositionAfterLongerThanTwo = dotposition+2>=emailInput.value.length;
    checkInput(emailInput, "mail-loc", "Please enter a valid email address", basicFieldSet, atPositionNotFirst, dotPositionAfterAt, dotPositionAfterLongerThanTwo);
  }


  // Must select at least one checkbox under the "Register for Activities" section of the form.
  if (input.type === "checkbox" || input.id === "sign-up-form"){
    let checkboxes = document.querySelectorAll('input[type="checkbox"]');
    //converts to array to use some method. some checks if any of the inputs in node list are checked
    let checkedOne = Array.prototype.slice.call(checkboxes).some(x => x.checked);
    checkInput(npmLabel, "check-loc", "Please check at least one activity", activitiesFieldSet, !checkedOne);
  }


  // If the selected payment option is "Credit Card,"
  if (paymentInput.value === "credit card"){
    let ccnum = document.getElementById('cc-num').value;
    let zip = document.getElementById('zip').value;
    let cvv = document.getElementById('cvv').value;

    //credit card number isnt empty
    if (input.id === "cc-num" || input.id === "sign-up-form"){
      let ccnumNull = ccnum == null;
      let ccnumEmpty = ccnum == "";
      checkInput(creditCardInfo, "ccnum-loc", "Please enter a credit card number", paymentFieldSet, ccnumNull, ccnumEmpty);
    }

    // Credit card field should only accept a number between 13 and 16 digits
    if (input.value != "" && input.id === "cc-num" || input.id === "sign-up-form"){
      let ccIsANumber = isNaN(ccnum);
      let lessThanThirteen = ccnum.length < 13;
      let greaterThanSixteen = ccnum.length > 16;
      checkInput(creditCardInfo, "ccnum-loc", "Enter a number between 13 and 16 digits", paymentFieldSet, ccIsANumber, lessThanThirteen, greaterThanSixteen);
    }

    //ZIP isnt empty
    if (input.id === "zip" || input.id === "sign-up-form"){
      let zipNull = zip == null;
      let zipEmpty = zip == "";
      checkInput(creditCardInfo, "zip-loc", "Please insert zip code", paymentFieldSet, zipNull, zipEmpty);
    }

    // The zipcode field should accept a 5-digit number
    if (input.id === "zip" || input.id === "sign-up-form"){
      let zipIsANumber = isNaN(zip);
      let zipLengthFive = zip.length !== 5;
      checkInput(creditCardInfo, "zip-loc", "Zip should be a 5 digit number", paymentFieldSet, zipIsANumber, zipLengthFive);
    }

    //cvv isnt empty
    if (input.id === "cvv" || input.id === "sign-up-form"){
      let cvvNull = cvv == null;
      let cvvEmpty = cvv == "";
      checkInput(creditCardInfo, "cvv-loc", "Please enter CVV", paymentFieldSet, cvvNull, cvvEmpty);
    }

    // The CVV should only accept a number that is exactly 3 digits long
    if (input.id === "cvv" || input.id === "sign-up-form"){
      let cvvIsANumber = isNaN(cvv);
      let cvvLengthThree = cvv.length !== 3;
      checkInput(creditCardInfo, "cvv-loc", "CVV should be a 3 digit number", paymentFieldSet, cvvIsANumber, cvvLengthThree);
    }
  }

}



/*-----------------
      EVENTS
------------------*/


//NAME INPUT
//set focus on first text field
nameInput.focus();

//JOB ROLE
//text field will be revealed when "other" option is selected from drop down menu
jobInput.addEventListener('change', toggleInput);

//T-SHIRT INFO
//only display color options that match the design selected in the "Design" menu
designInput.addEventListener('change', toggleColors);

//REGISTER FOR ACTIVITIES
//If the user selects a workshop, don't allow selection of a workshop at the same date and time
activitiesFieldSet.addEventListener('change', function() {
  toggleActivities();
  //also add up price total
  addPricetoDOM();
});

//PAYMENT INFO
//Display payment sections based on the payment option chosen in the select menu
paymentInput.addEventListener('change', togglePaymentInfo);

//FORM VALIDATION ALL ON SUBMIT
//If any of the following validation errors exist, prevent the user from submitting the form:
form.addEventListener('submit', function(e) {
  validateForm(e.target);
  //if there are zero errors after validation submit the form
  if (getErrorTotal() === 0){
    form.submit();
    //otherwise prevent from submitting
  } else {
    e.preventDefault();
  }
});

//FORM VALIDATION REAL TIME ON INPUT CHANGE
form.addEventListener('input', function(e){
  validateForm(e.target);
});

//FORM VALIDATION FOR CHECKBOXES
form.addEventListener('change', function(e){
  validateForm(e.target);
})
