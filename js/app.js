// global variance to calculate abuse
var abuse = 0;


// add class function
function addClass(elName,className) {
  var element = document.getElementById(elName);
  element.classList.add(className);
}

// remove class function
function removeClass(elName,className) {
  var element = document.getElementById(elName);
  element.classList.remove(className);
}

//add text to HTML element
function addText(id,str) {
  var div = document.getElementById(id);
  div.innerHTML = str;
}


// function to calculate chicken varaince (actual vs epcs)
function calculate_chicken() {
  // get number of cooked pieces and convert to int number
  var chickenAmount = document.getElementById("chicken-cooked").value;
  if (chickenAmount == "") {
    chickenAmount = 0;
  }
  chickenAmount = parseInt(chickenAmount,10);

// get number of input trash pieces and convert to int number
  var chickenTrash = document.getElementById("chicken-trash").value;
  if (chickenTrash == "") {
    chickenTrash = 0;
  }
  chickenTrash = parseInt(chickenTrash,10);

// get number of unaccounted for pieces and convert to int number
  var chickenUnaccounted = document.getElementById("chicken-uacc").value;
  if (chickenUnaccounted == "") {
    chickenUnaccounted = 0;
  }
  chickenUnaccounted = parseInt(chickenUnaccounted,10);

// get number of physicaly wasted pieces and convert to int number
  var chickenWasted = document.getElementById("chicken-waste").value;
  if (chickenWasted == "") {
    chickenWasted = 0;
  }
  chickenWasted = parseInt(chickenWasted,10);

// calculate variance between physical waste and epcs waste
  var varaincePieces = (chickenTrash + chickenUnaccounted) - chickenWasted;
  var diff = (varaincePieces/chickenAmount) * 100;
  diff = parseFloat(diff);
  diff = diff.toFixed(2);


// if var greater that 10% add danger class, otherwise add success class
   if(diff > -10 && diff < 10) {
     removeClass("chicken-var-proc", "bg-danger");
     addClass("chicken-var-proc", "bg-success");
   } else if(diff <= -10 || diff >= 10){
     removeClass("chicken-var-proc", "bg-sucess");
     addClass("chicken-var-proc", "bg-danger");
     abuse = abuse + 1;
   } else {
     removeClass("chicken-var-proc", "bg-danger");
     removeClass("chicken-var-proc", "bg-sucess");
     addClass("chicken-var-proc", "bg-secondary");
   }

   // alert(chickenAmount + " " + chickenTrash  + " " + chickenUnaccounted  + " " + chickenWasted);
   // alert(diff);
   document.getElementById("chicken-var-pc").value = (varaincePieces);
   document.getElementById("chicken-var-proc").value = (diff + "%");

}


// function to calculate fillet varaince (actual vs epcs)
function calculate_fillet() {
  // get number of cooked pieces and convert to int number
  var filletAmount = document.getElementById("fillet-cooked").value;
  if (filletAmount == "") {
    filletAmount = 0;
  }
  filletAmount = parseInt(filletAmount,10);

// get number of input trash pieces and convert to int number
  var filletTrash = document.getElementById("fillet-trash").value;
  if (filletTrash == "") {
    filletTrash = 0;
  }
  filletTrash = parseInt(filletTrash,10);

// get number of unaccounted for pieces and convert to int number
  var filletUnaccounted = document.getElementById("fillet-uacc").value;
  if (filletUnaccounted == "") {
    filletUnaccounted = 0;
  }
  filletUnaccounted = parseInt(filletUnaccounted,10);

// get number of physicaly wasted pieces and convert to int number
  var filletWasted = document.getElementById("fillet-waste").value;
  if (filletWasted == "") {
    filletWasted = 0;
  }
  filletWasted = parseInt(filletWasted,10);

// calculate variance between physical waste and epcs waste
  var varaincePieces = (filletTrash + filletUnaccounted) - filletWasted;
  var diff = (varaincePieces/filletAmount) * 100;
  diff = parseFloat(diff);
  diff = diff.toFixed(2);


// if var greater that 10% add danger class, otherwise add success class
  if(diff > -10 && diff < 10) {
    removeClass("fillet-var-proc", "bg-danger");
    addClass("fillet-var-proc", "bg-success");
  } else if(diff <= -10 || diff >= 10){
    removeClass("fillet-var-proc", "bg-sucess");
    addClass("fillet-var-proc", "bg-danger");
    abuse = abuse + 1;
  } else {
    removeClass("fillet-var-proc", "bg-danger");
    removeClass("fillet-var-proc", "bg-sucess");
    addClass("fillet-var-proc", "bg-secondary");
  }

   // alert(filletAmount + " " + filletTrash  + " " + filletUnaccounted  + " " + filletWasted);
   // alert(diff);
   document.getElementById("fillet-var-pc").value = (varaincePieces);
   document.getElementById("fillet-var-proc").value = (diff + "%");

}

// function to calculate mini fillet varaince (actual vs epcs)
function calculate_mf() {
  // get number of cooked pieces and convert to int number
  var mfAmount = document.getElementById("mf-cooked").value;
  if (mfAmount == "") {
    mfAmount = 0;
  }
  mfAmount = parseInt(mfAmount,10);

// get number of input trash pieces and convert to int number
  var mfTrash = document.getElementById("mf-trash").value;
  if (mfTrash == "") {
    mfTrash = 0;
  }
  mfTrash = parseInt(mfTrash,10);

// get number of unaccounted for pieces and convert to int number
  var mfUnaccounted = document.getElementById("mf-uacc").value;
  if (mfUnaccounted == "") {
    mfUnaccounted = 0;
  }
  mfUnaccounted = parseInt(mfUnaccounted,10);

// get number of physicaly wasted pieces and convert to int number
  var mfWasted = document.getElementById("mf-waste").value;
  if (mfWasted == "") {
    mfWasted = 0;
  }
  mfWasted = parseInt(mfWasted,10);

// calculate variance between physical waste and epcs waste
  var varaincePieces = (mfTrash + mfUnaccounted) - mfWasted;
  var diff = (varaincePieces/mfAmount) * 100;
  diff = parseFloat(diff);
  diff = diff.toFixed(2);


// if var greater that 10% add danger class, otherwise add success class
  if(diff > -10 && diff < 10) {
    removeClass("mf-var-proc", "bg-danger");
    addClass("mf-var-proc", "bg-success");
  } else if(diff <= -10 || diff >= 10){
    removeClass("mf-var-proc", "bg-sucess");
    addClass("mf-var-proc", "bg-danger");
    abuse = abuse + 1;
  } else {
    removeClass("mf-var-proc", "bg-danger");
    removeClass("mf-var-proc", "bg-sucess");
    addClass("mf-var-proc", "bg-secondary");
  }

   // alert(mfAmount + " " + mfTrash  + " " + mfUnaccounted  + " " + mfWasted);
   // alert(diff);
   document.getElementById("mf-var-pc").value = (varaincePieces);
   document.getElementById("mf-var-proc").value = (diff + "%");

}

// function to calculate Zinger varaince (actual vs epcs)
function calculate_zinger() {
  // get number of cooked pieces and convert to int number
  var zingerAmount = document.getElementById("zinger-cooked").value;
  if (zingerAmount == "") {
    zingerAmount = 0;
  }
  zingerAmount = parseInt(zingerAmount,10);

// get number of input trash pieces and convert to int number
  var zingerTrash = document.getElementById("zinger-trash").value;
  if (zingerTrash == "") {
    zingerTrash = 0;
  }
  zingerTrash = parseInt(zingerTrash,10);

// get number of unaccounted for pieces and convert to int number
  var zingerUnaccounted = document.getElementById("zinger-uacc").value;
  if (zingerUnaccounted == "") {
    zingerUnaccounted = 0;
  }
  zingerUnaccounted = parseInt(zingerUnaccounted,10);

// get number of physicaly wasted pieces and convert to int number
  var zingerWasted = document.getElementById("zinger-waste").value;
  if (zingerWasted == "") {
    zingerWasted = 0;
  }
  zingerWasted = parseInt(zingerWasted,10);

// calculate variance between physical waste and epcs waste
  var varaincePieces = (zingerTrash + zingerUnaccounted) - zingerWasted;
  var diff = (varaincePieces/zingerAmount) * 100;
  diff = parseFloat(diff);
  diff = diff.toFixed(2);


// if var greater that 10% add danger class, otherwise add success class
  if(diff > -10 && diff < 10) {
    removeClass("zinger-var-proc", "bg-danger");
    addClass("zinger-var-proc", "bg-success");
  } else if(diff <= -10 || diff >= 10){
    removeClass("zinger-var-proc", "bg-sucess");
    addClass("zinger-var-proc", "bg-danger");
    abuse = abuse + 1;
  } else {
    removeClass("zinger-var-proc", "bg-danger");
    removeClass("zinger-var-proc", "bg-sucess");
    addClass("zinger-var-proc", "bg-secondary");
  }

   // alert(zingerAmount + " " + zingerTrash  + " " + zingerUnaccounted  + " " + zingerWasted);
   // alert(diff);
   document.getElementById("zinger-var-pc").value = (varaincePieces);
   document.getElementById("zinger-var-proc").value = (diff + "%");

}

// function to calculate Hot Wings varaince (actual vs epcs)
function calculate_hw() {
  // get number of cooked pieces and convert to int number
  var hwAmount = document.getElementById("hw-cooked").value;
  if (hwAmount == "") {
    hwAmount = 0;
  }
  hwAmount = parseInt(hwAmount,10);

// get number of input trash pieces and convert to int number
  var hwTrash = document.getElementById("hw-trash").value;
  if (hwTrash == "") {
    hwTrash = 0;
  }
  hwTrash = parseInt(hwTrash,10);

// get number of unaccounted for pieces and convert to int number
  var hwUnaccounted = document.getElementById("hw-uacc").value;
  if (hwUnaccounted == "") {
    hwUnaccounted = 0;
  }
  hwUnaccounted = parseInt(hwUnaccounted,10);

// get number of physicaly wasted pieces and convert to int number
  var hwWasted = document.getElementById("hw-waste").value;
  if (hwWasted == "") {
    hwWasted = 0;
  }
  hwWasted = parseInt(hwWasted,10);

// calculate variance between physical waste and epcs waste
  var varaincePieces = (hwTrash + hwUnaccounted) - hwWasted;
  var diff = (varaincePieces/hwAmount) * 100;
  diff = parseFloat(diff);
  diff = diff.toFixed(2);


// if var greater that 10% add danger class, otherwise add success class
  if(diff > -10 && diff < 10) {
    removeClass("hw-var-proc", "bg-danger");
    addClass("hw-var-proc", "bg-success");
  } else if(diff <= -10 || diff >= 10){
    removeClass("hw-var-proc", "bg-sucess");
    addClass("hw-var-proc", "bg-danger");
    abuse = abuse + 1;
  } else {
    removeClass("hw-var-proc", "bg-danger");
    removeClass("hw-var-proc", "bg-sucess");
    addClass("hw-var-proc", "bg-secondary");
  }

   // alert(hwAmount + " " + hwTrash  + " " + hwUnaccounted  + " " + hwWasted);
   // alert(diff);
   document.getElementById("hw-var-pc").value = (varaincePieces);
   document.getElementById("hw-var-proc").value = (diff + "%");

}


// function to calculate Veggie Tenders varaince (actual vs epcs)
function calculate_vt() {
  // get number of cooked pieces and convert to int number
  var vtAmount = document.getElementById("vt-cooked").value;
  if (vtAmount == "") {
    vtAmount = 0;
  }
  vtAmount = parseInt(vtAmount,10);

// get number of input trash pieces and convert to int number
  var vtTrash = document.getElementById("vt-trash").value;
  if (vtTrash == "") {
    vtTrash = 0;
  }
  vtTrash = parseInt(vtTrash,10);

// get number of unaccounted for pieces and convert to int number
  var vtUnaccounted = document.getElementById("vt-uacc").value;
  if (vtUnaccounted == "") {
    vtUnaccounted = 0;
  }
  vtUnaccounted = parseInt(vtUnaccounted,10);

// get number of physicaly wasted pieces and convert to int number
  var vtWasted = document.getElementById("vt-waste").value;
  if (vtWasted == "") {
    vtWasted = 0;
  }
  vtWasted = parseInt(vtWasted,10);

// calculate variance between physical waste and epcs waste
  var varaincePieces = (vtTrash + vtUnaccounted) - vtWasted;
  var diff = (varaincePieces/vtAmount) * 100;
  diff = parseFloat(diff);
  diff = diff.toFixed(2);


// if var greater that 10% add danger class, otherwise add success class
  if(diff > -10 && diff < 10) {
    removeClass("vt-var-proc", "bg-danger");
    addClass("vt-var-proc", "bg-success");
  } else if(diff <= -10 || diff >= 10){
    removeClass("vt-var-proc", "bg-sucess");
    addClass("vt-var-proc", "bg-danger");
    abuse = abuse + 1;
  } else {
    removeClass("vt-var-proc", "bg-danger");
    removeClass("vt-var-proc", "bg-sucess");
    addClass("vt-var-proc", "bg-secondary");
  }

   // alert(vtAmount + " " + vtTrash  + " " + vtUnaccounted  + " " + vtWasted);
   // alert(diff);
   document.getElementById("vt-var-pc").value = (varaincePieces);
   document.getElementById("vt-var-proc").value = (diff + "%");

}

// function to calculate OTHER product varaince (actual vs epcs)
function calculate_other() {
  // get number of cooked pieces and convert to int number
  var otherAmount = document.getElementById("other-cooked").value;
  if (otherAmount == "") {
    otherAmount = 0;
  }
  otherAmount = parseInt(otherAmount,10);

// get number of input trash pieces and convert to int number
  var otherTrash = document.getElementById("other-trash").value;
  if (otherTrash == "") {
    otherTrash = 0;
  }
  otherTrash = parseInt(otherTrash,10);

// get number of unaccounted for pieces and convert to int number
  var otherUnaccounted = document.getElementById("other-uacc").value;
  if (otherUnaccounted == "") {
    otherUnaccounted = 0;
  }
  otherUnaccounted = parseInt(otherUnaccounted,10);

// get number of physicaly wasted pieces and convert to int number
  var otherWasted = document.getElementById("other-waste").value;
  if (otherWasted == "") {
    otherWasted = 0;
  }
  otherWasted = parseInt(otherWasted,10);

// calculate variance between physical waste and epcs waste
  var varaincePieces = (otherTrash + otherUnaccounted) - otherWasted;
  var diff = (varaincePieces/otherAmount) * 100;
  diff = parseFloat(diff);
  diff = diff.toFixed(2);


// if var greater that 10% add danger class, otherwise add success class
  if(diff > -10 && diff < 10) {
    removeClass("other-var-proc", "bg-danger");
    addClass("other-var-proc", "bg-success");
  } else if(diff <= -10 || diff >= 10){
    removeClass("other-var-proc", "bg-sucess");
    addClass("other-var-proc", "bg-danger");
    abuse = abuse + 1;
  } else {
    removeClass("other-var-proc", "bg-danger");
    removeClass("other-var-proc", "bg-sucess");
    addClass("other-var-proc", "bg-secondary");
  }

   // alert(otherAmount + " " + otherTrash  + " " + otherUnaccounted  + " " + otherWasted);
   // alert(diff);
   document.getElementById("other-var-pc").value = (varaincePieces);
   document.getElementById("other-var-proc").value = (diff + "%");

}


// check if PCS was abused. It checks number of producta above 10% VARIANCE
function checkIfAbused() {
  if(abuse >= 2) {
    pcs_check_text = "Product control system was abused. Varaince was greater than 10% for " + abuse + " products.";
    abuseClass = "alert-danger";
  } else if (abuse  == 1){
    pcs_check_text = "Variance was greater than 10% for ONE of checked products. No PCS abuse.";
    abuseClass = "alert-warning";
  } else {
    pcs_check_text = "Great PCS controls. There was not a problem with any of checked products. Well done to the team!";
    abuseClass = "alert-success";
  }
  // function returns options base on pcs check
  return {
    abText:pcs_check_text,
    abClass:abuseClass
   };
}

// remove all required classes base of return from checkIfAbused function
function removeClasses() {
  removeClass("abuse-text", "alert-danger");
  removeClass("abuse-text", "alert-success");
  removeClass("abuse-text", "alert-warning");
  removeClass("abuse-text", "d-none");
}

// function to check if pcs was abused
function calculate() {
  var pcs_check_text = "";
  var abuseClass = "bg-success";
  abuse = 0;
  calculate_chicken();
  calculate_fillet();
  calculate_mf();
  calculate_zinger();
  calculate_hw();
  calculate_vt();
  calculate_other();

// use value returned by checkIfAbused function
  var isAbused = checkIfAbused();

// remove all required classes base of return from checkIfAbused function
  removeClasses();

// add all required classes base of return from checkIfAbused function
  addClass("abuse-text", "d-block");
  addClass("abuse-text", isAbused.abClass);

// apend text base of return from checkIfAbused function
  addText("abuse-text", isAbused.abText);

}
