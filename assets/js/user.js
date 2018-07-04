// var queryURL = "https://api.scryfall.com/cards/search?q=";
// var cardName = "raging+goblin";

// queryURL = queryURL + cardName;

// $.ajax({
//     url: queryURL,
//     method: "GET"
// }).then(function(response) {
    
//     result = response.data;
//     console.log(result);

// });

        // $(document).ready(function () {
        //     // Create jqxExpander.
        //     $("#createAccount").jqxExpander({  toggleMode: 'none', width: '350px', showArrow: false });

        //     // Create jqxInput.
        //     $("#userName").jqxInput({  width: '300px', height: '20px' });

        //     // Create jqxPasswordInput.
        //     $("#password").jqxPasswordInput({  width: '300px', height: '20px', showStrength: true, showStrengthPosition: "right" });
        //     $("#passwordConfirm").jqxPasswordInput({  width: '300px', height: '20px' });

        //     // Create jqxButton.
        //     $("#submit").jqxButton({ theme: theme });

        //     // Create jqxValidator.
        //     $("#form").jqxValidator({
        //         rules: [
        //                 { input: "#userName", message: "Username is required!", action: 'keyup, blur', rule: 'required' },
        //                 { input: "#password", message: "Password is required!", action: 'keyup, blur', rule: 'required' },
        //                 { input: "#passwordConfirm", message: "Password is required!", action: 'keyup, blur', rule: 'required' },
        //                 {
        //                     input: "#passwordConfirm", message: "Passwords should match!", action: 'keyup, blur', rule: function (input, commit) {
        //                         var firstPassword = $("#password").jqxPasswordInput('val');
        //                         var secondPassword = $("#passwordConfirm").jqxPasswordInput('val');
        //                         return firstPassword == secondPassword;
        //                     }
        //                 },
        //         ],  hintType: "label"
        //     });
        //     // Validate the Form.
        //     $("#submit").click(function () {
        //         $('#form').jqxValidator('validate');
        //     });
        //     // Update the jqxExpander's content if the validation is successful.
        //     $('#form').on('validationSuccess', function (event) {
        //         $("#createAccount").jqxExpander('setContent', '<span style="margin: 10px;">Account created.</span>');
        //     });
        // });
    
// Initialize Firebase
var config = {
    apiKey: "AIzaSyDScSf1S8uKg9PMcsGP28eu1CNePMO6dxk",
    authDomain: "userlogins-8a849.firebaseapp.com",
    databaseURL: "https://userlogins-8a849.firebaseio.com",
    projectId: "userlogins-8a849",
    storageBucket: "userlogins-8a849.appspot.com",
    messagingSenderId: "653623148641"
  };

firebase.initializeApp(config);

// Variable to reference database.
var database = firebase.database();

// Login Variables.
  var name = "";
  var pass = "";
  var userCreate = "";
  var passCreate = "";
  var passConfirm = "";
// Login Function.

  $("#logged").on("click", function (event) {
    event.preventDefault();


    var name = $("#username-input").val().trim();
    var pass = $("#password-input").val().trim();
    console.log(name);
    console.log(pass);
    database.ref().set({
        name: name,
        pass: pass,
  })


// Create User/Password Function.
    $("#created").on("click", function (event) {
        event.preventDefault();

    var userCreate = $("#userCreate-input").val().trim();
    var passCreate = $("#passwordCreate-input").val().trim();
    var passConfirm = $("#passwordConfirm-input").val().trim();
    
    console.log(userCreate);
    console.log(passCreate);
    console.log(passConfirm);
   
    database.ref().set({
        userCreate: userCreate,
        passCreate: passCreate,
        passConfirm: passConfirm,
    });
});
    
    

//   var addUser = function(username, password) {
//     users.child(username).set({
//         username: username,
//         password: password
//     })
//   };

// adduser(name,pass): add to onclick event for login later. 

})

//Code here to reference data base and look to see if username has already been added or not// If userName has been added  alert(newUserName must be chosen) If userName not added previously user can continue with creating account.

//Code here to reference data base and look to see if username (put in login form) matches database.

