// Global Variables
var currentUser = "demo";

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

// Scryfall API
var queryURL = "https://api.scryfall.com/cards/search?q=";
var cardName = "raging+goblin";

queryURL = queryURL + cardName;

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response) {
    result = response.data;
    console.log(result);
});

// Add Deck
var addDeck = function(deckName) {
    var decks = users.child("/" + currentUser + "/decks");
    decks.child(deckName).set({
        deckName: deckName
    });  
};

// Add Card to Collection
var addCardToCollection = function(cardName, amount) {
    var collection = users.child("/" + currentUser + "/collection/cards");
    collection.child(cardName).set({
        cardName: cardName,
        amount: amount
    });    
};

// Add Card to Deck
var addCardToDeck = function(deckName, cardName, amount) {
    var deck = users.child("/" + currentUser + "/decks/" + deckName + "/cards");
    deck.child(cardName).set({
        cardName: cardName,
        amount: amount
    });  
};

// Display Cards on Table
var displayTable = function(listName) {
    if (listName == "collection") {
        var cardList = users.child("/" + currentUser + "/collection/cards");
        cardList.once('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
              var childData = childSnapshot.val();
              console.log(childData);
            });
        });
    }
    else {
        var cardList = users.child("/" + currentUser + "/decks/" + listName + "/cards");
    };
}

displayTable("collection");