// Global Variables
var currentUser = "demo";
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

// Add Deck
var addDeck = function(deckName) {
    var decks = users.child("/" + currentUser + "/decks");
    decks.child(deckName).set({
        deckName: deckName
    });  
};

// Change Deck Name
var changeDeckName = function (oldDeckName, newDeckName) {
    var decks = users.child("/" + currentUser + "/decks");
    decks.child(oldDeckName).once('value').then(function(snapshot) {
        var deckData = snapshot.val();
        deckData.deckName = newDeckName;
        var update = {};
        update[oldDeckName] = null;
        update[newDeckName] = deckData;
        return decks.update(update);
    });
};

// Add Card to Collection
var addCardToCollection = function(cardName, amount) {
    queryURL = scryfallURL + cardName;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        result = response.data;
        var match = false;
        result.forEach(function(card) {
            if (cardName.toLowerCase() === (card.name).toLowerCase()) {
                var scryName = card.name;
                var collection = users.child("/" + currentUser + "/collection/cards");
                collection.child(scryName).once("value", function(snapshot) {
                    if (snapshot.val() != null) {
                        var newAmount = amount + snapshot.val().amount;
                        collection.child(scryName).set({
                            cardName: scryName,
                            amount: newAmount
                        });
                    }
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
            alert("Not a valid card.");
        }
    });
};

// Add Card to Deck
var addCardToDeck = function(deckName, cardName, amount) {
    queryURL = scryfallURL + cardName;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        result = response.data;
        var match = false;
        result.forEach(function(card) {
            if (cardName.toLowerCase() === (card.name).toLowerCase()) {
                var scryName = card.name;
                var deck = users.child("/" + currentUser + "/decks/" + deckName + "/cards");
                deck.child(scryName).once("value", function(snapshot) {
                    if (snapshot.val() != null) {
                        var newAmount = amount + snapshot.val().amount;
                        deck.child(scryName).set({
                            cardName: scryName,
                            amount: newAmount
                        });
                    }
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
            alert("Not a valid card.");
        }
    });
};

// Change Amount of Card
var changeCardAmount = function(listName, cardName, amount) {
    if (listName === "collection") {
        var cardList = users.child("/" + currentUser + "/collection/cards");
        cardList.child(cardName).once("value", function(snapshot) {
            if ((snapshot.val().amount - amount) <= 0) {
                cardList.child(cardName).remove();
            }
            else {
                var newAmount = snapshot.val().amount - amount;
                var update = {};
                update["amount"] = newAmount;
                return cardList.child(cardName).update(update);
            }
        });
    }
    else {
        var cardList = users.child("/" + currentUser + "/decks/" + listName + "/cards");
        cardList.child(cardName).once("value", function(snapshot) {
            if ((snapshot.val().amount - amount) <= 0) {
                cardList.child(cardName).remove();
            }
            else {
                var newAmount = snapshot.val().amount - amount;
                var update = {};
                update["amount"] = newAmount;
                return cardList.child(cardName).update(update);
            }
        });
    };
};

// Display Cards on Table
var displayTable = function(listName) {
    if (listName == "collection") {
        var cardList = users.child("/" + currentUser + "/collection/cards");
        cardList.once('value', function(snapshot) {

            snapshot.forEach(function(cardSnapshot) {
              var cardData = cardSnapshot.val();
              console.log(cardData);
              console.log(cardData.cardName);
              console.log(cardData.amount);
            });
        });
    }
    else {
        var cardList = users.child("/" + currentUser + "/decks/" + listName + "/cards");
    };
};

displayTable("collection");