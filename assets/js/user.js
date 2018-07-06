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

//Variables..
var currentUser = "";  
var name = "";
var pass = "";
var userCreate = "";
var passCreate = "";
var passConfirm = "";      

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
var users = database.ref("/users");
  
// Login Function.
$("#logged").on("click", function (event) {
    event.preventDefault();


    var name = $("#username-input").val().trim();
    var pass = $("#password-input").val().trim();

    users.once("value", function(snapshot) {
        var validUser = false;
        var validPass = false;
        snapshot.forEach(function(userSnapshot) {
            if (userSnapshot.val().username == name) {
                validUser = true;
                if (userSnapshot.val().password == pass)  {
                    validPass = true;
                }
            }
        });
        if (validUser == false) {
            alert("invalid user");
        }
        else if (validPass == false) {
            alert("invalid password");
        }
        else {
            currentUser = name;
            console.log(currentUser);
            $(".card").hide();
            getDecks();
            createDeck()
        };
     });
});

// Create User/Password Function.
    $("#created").on("click", function (event) {
        event.preventDefault();
            
    var userCreate = $("#userCreate-input").val().trim();
    var passCreate = $("#passwordCreate-input").val().trim();
    var passConfirm = $("#passwordConfirm-input").val().trim();
    if(passCreate === passConfirm) {
        newUser(userCreate,passCreate);
    };
    // console.log(userCreate);
    // console.log(passCreate);
    // console.log(passConfirm);
    
//Code here to reference data base and look to see if username has already been added or not// If userName has been added  alert(newUserName must be chosen) If userName not added previously user can continue with creating account.


});

var newUser = function(username, password) {
    var invalidUser = false;
    users.once("value", function(snapshot) {
        snapshot.forEach(function(userSnapshot) {
            if (username == userSnapshot.val().username) {
                invalidUser = true;
            }
        });
        if (invalidUser == true) {
            alert("Username is already taken.");
        }
        else {
            users.child(username).set({
                username: username,
                password: password
            });
        };
    });
 };

// When logged in, display a button (or similar element) that when clicked will display the user's owned cards.




// Build a form for the user to create a new deck.
function createDeck() {
    $form = $("<form></form>");
    $form.append('<input type="text" value="text" id="deck-input">');
    $form.append('<input type="button" value="button" id="confirm">');
    $('body').append($form)
    $("#confirm").on("click", function (event) {
        event.preventDefault();
        var deckName = $("#deck-input").val().trim();
        addDeck(deckName);
    });
}
// Function that will add newly created deck to the database...
var addDeck = function(deckName) {
    var decks = users.child("/" + currentUser + "/decks");
    decks.child(deckName).set({
        deckName: deckName
    });  
};

// Dynamically display buttons (or similar elements) for all decks created by the user that when clicked will display the cards in that deck.

var getDecks =  function() {
    var deckList = users.child("/" + currentUser + "/decks");
    deckList.once("value", function(snapshot) {
        console.log(snapshot.val());
        snapshot.forEach(function(deckSnapshot) {
            deckData = deckSnapshot.val();
            console.log(deckData);
            console.log(deckData.deckName);
        });
    });
 };
 
 