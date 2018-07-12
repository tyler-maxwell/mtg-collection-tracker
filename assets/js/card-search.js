// Global variables
var currentUser = "";
var currentCard = "";
var currentCards = {};
var scryfallURL = "https://api.scryfall.com/cards/search?q=";

// Initialize Firebase
var config = {
    apiKey: "AIzaSyANlnAX3fUp_UIjqAdPX7ZrHpqtPwl1f_o",
    authDomain: "mtg-tracker-42a3b.firebaseapp.com",
    databaseURL: "https://mtg-tracker-42a3b.firebaseio.com",
    projectId: "mtg-tracker-42a3b",
    storageBucket: "mtg-tracker-42a3b.appspot.com",
    messagingSenderId: "308304012668"
};
firebase.initializeApp(config);
var database = firebase.database();
var users = database.ref("/users");

$("#hide").click(function(){
    $("info").hide();
});

// User clicks on the search button
$('#searchBtn').on('click', function(event) {
    // Prevent page refresh
    event.preventDefault();

    // Empty the card list
    $("#list").empty();

    // Clear out the current cards
    currentCards = {};

    // Get the card name from the user's input
    var cardName = $('#search').val().trim();

    // Call the API
    $.ajax({
        url: 'https://api.scryfall.com/cards/search?q=' + cardName,
        method: 'GET'
    }).then(function(response) {
        // Clear the input element
        // $('#search').val('');

        // Store the results in a `results` variable
        var results = response.data;
        console.log(results);        // Loop through the results
        for (let i = 0; i < results.length; i++) {
            // Store the result at the current index in the results in a `result` variable
            var result = results[i];

            // Store the result inside `currentCards` using the ID it has in the API response
            currentCards[result.id] = result;

            // Append the card to `#list`
            // `src` is pretty obvious
            // `data-id` is equal to result.id, meaning it is the same as what we stored it in the `currentCards` object as
            $('#list').append("<img src='" + result.image_uris['normal'] + "' class='card' data-id='" + result.id + "' width='250px' height='350px'/>");
        }
    });

    $("#info").empty();
    $('#oneCard').empty();

    //Styles
    $("#info").css("border", "");
    $("#info").css("border-radius", "");
    $("#info").css("color", "");
    $("#info").css("background", "");
    $("#info").css("margin-bottom", "");
});

// User clicks on a card
$('#list').on('click', '.card', function() {
    // Empty the `#searchForm` element
    // $('#searchForm').empty();
    $("#info").empty();
    $('#oneCard').empty();
    // Empty the `#list` element
    $("#list").empty();
    
    // Get the `data-id` attribute from the card that was clicked on
    // Get the object that this ID references in `currentCards`
    // Set this object to the variable `card`
    var card = currentCards[$(this).data('id')];

    // Get the relevant data from the object
    currentCard = card.name;
    var nameCost = $("<p>").text(card.name + " — " + card.mana_cost);
    var creature = $("<p>").text(card.type_line);
    var flavorText = $("<p>").text(card.flavor_text).attr("style", "font-style: italic;");
    var cardText = $("<p>").text(card.oracle_text);
    var powTough = $("<p>").text(card.power + "/" + card.toughness);
    var cardFront = "<img src='" + card.image_uris['normal'] + "' width='300px' height='400px'>";


    // Append the data to `#info`
    $('#info').append(nameCost);
    $('#info').append(creature);
    $('#info').append(cardText);
    $('#info').append(flavorText);
    $('#info').append(powTough);
    // Append the card front to `#oneCard`
    $('#oneCard').append(cardFront);

    if (currentUser != "") {
        var deckList = users.child("/" + currentUser + "/decks");
        deckList.once("value", function(snapshot) {
            var decks = [];
            snapshot.forEach(function(deckSnapshot) {
                decks.push(deckSnapshot.val().deckName);
            });
            var decksForm = $("<form>");
            var decksSelect = $("<select>").attr("name", "decks");
            decksSelect.attr("id", "deck-select");
            for (var i = 0; i < decks.length; i++) {
                var deckOption = $("<option>").attr("value", decks[i]).text(decks[i]);
                decksSelect.append(deckOption);
            };
            var addToDeckBtn = $("<input>").attr("type", "submit");
            addToDeckBtn.attr("id", "add-to-deck");
            addToDeckBtn.attr("value", "Add Card to Deck");

            var addToCollectionBtn = $("<input>").attr("type", "submit");
            addToCollectionBtn.attr("id", "add-to-collection");
            addToCollectionBtn.attr("value", "Add Card to Collection");

            var numInput = $("<input>").attr("type", "number");
            numInput.attr("min", "1");
            numInput.attr("max", "20");
            numInput.attr("id", "num-input");

            decksForm.append(numInput);
            decksForm.append(decksSelect);
            decksForm.append("<br/>");
            decksForm.append(addToDeckBtn);
            decksForm.append("<br/>");
            decksForm.append(addToCollectionBtn);
            $("#info").append(decksForm);
        });
    }

    //Styles
    $("#info").css("border", "2px solid black");
    $("#info").css("border-radius", "4px");
    $("#info").css("color", "white");
    $("#info").css("background", "rgb(0, 0, 0, 0.8)");
    $("#info").css("margin-bottom", "20px");
});



// Click event for loginBtn
$(document.body).on("click", "#loginBtn", function (event) {
    event.preventDefault();
    var modal = document.getElementById('user-login');
    var span = document.getElementsByClassName("login-close")[0];
    modal.style.display = "block";
    span.onclick = function() {
        modal.style.display = "none";
    };
});

// Click event for login-submit
$(document.body).on("click", "#login-submit", function (event) {
    event.preventDefault();
    var name = $("#username-input").val().trim();
    var pass = $("#password-input").val().trim();
    login(name, pass);
});

// Click event for add-to-deck
$(document.body).on("click", "#add-to-deck", function() {
    event.preventDefault();
    var deck = document.getElementById("deck-select").value;
    var amount = document.getElementById("num-input").value;
    if (amount > 0) {
        addCardToDeck(deck, currentCard, amount);
    }
    else {
        addCardToDeck(deck, currentCard, 1);
    }
});

// Click event for add-to-collection
$(document.body).on("click", "#add-to-collection", function() {
    event.preventDefault();
    var amount = document.getElementById("num-input").value;
    if (amount > 0) {
        addCardToCollection(currentCard, amount);
    }
    else {
        addCardToCollection(currentCard, 1);
    }
});

// Login function
var login = function(username, password) {
    var name = username;
    var pass = password;
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
            var modal = document.getElementById('invalid-username');
            var span = document.getElementsByClassName("user-close")[0];
            modal.style.display = "block";
            span.onclick = function() {
                modal.style.display = "none";
            }
        }
        else if (validPass == false) {
            var modal = document.getElementById('invalid-password');
            var span = document.getElementsByClassName("password-close")[0];
            modal.style.display = "block";
            span.onclick = function() {
                modal.style.display = "none";
            }        
        }
        else {
            currentUser = name;
            $("#loginBtn").remove();
            var modal = document.getElementById('user-login');
            modal.style.display = "none";
        };
    });
};

// Add Card to Deck
var addCardToDeck = function(deckName, cardName, amount) {
    var queryURL = scryfallURL + cardName;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        var result = response.data;
        var match = false; // Boolean to test if user input matches a real MTG Card
        result.forEach(function(card) {
            if (cardName.toLowerCase() === (card.name).toLowerCase()) {
                var scryName = card.name;
                var deck = users.child("/" + currentUser + "/decks/" + deckName + "/cards");
                deck.child(scryName).once("value", function(snapshot) {
                    // If card already exists in collection add the amount entered by the user to the amount already present in the database
                    if (snapshot.val() != null) { 
                        var newAmount = parseInt(amount) + parseInt(snapshot.val().amount);
                        deck.child(scryName).set({
                            cardName: scryName,
                            amount: newAmount
                        });
                    }
                    // If card does not already exist in collection place it in database with user defined values
                    else { 
                        deck.child(scryName).set({
                            cardName: scryName,
                            amount: amount
                        }); 
                    };
                });
                match = true;
            }
        });
        if (match === false) {
            console.log("Not a valid card.");
        }
    });
};

// Add Card to Collection
var addCardToCollection = function(cardName, amount) {
    var queryURL = scryfallURL + cardName;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        var result = response.data;
        var match = false; // Boolean to test if user input matches a real MTG Card
        result.forEach(function(card) {
            if (cardName.toLowerCase() === (card.name).toLowerCase()) {
                var scryName = card.name;
                var collection = users.child("/" + currentUser + "/collection/cards");
                collection.child(scryName).once("value", function(snapshot) {
                    // If card already exists in collection add the amount entered by the user to the amount already present in the database
                    if (snapshot.val() != null) { 
                        var newAmount = parseInt(amount) + parseInt(snapshot.val().amount);
                        collection.child(scryName).set({
                            cardName: scryName,
                            amount: newAmount
                        });
                    }
                    // If card does not already exist in collection place it in database with user defined values
                    else { 
                        collection.child(scryName).set({
                            cardName: scryName,
                            amount: amount
                        }); 
                    };
                });
                match = true;
            }
        });
        if (match === false) {
            console.log("Not a valid card.");
        }
    });
};
