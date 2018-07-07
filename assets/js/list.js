// Global Variables
var currentUser = "demo";
var scryfallURL = "https://api.scryfall.com/cards/search?q=";
var currentList = "Goblins";
var pages = 0;
var page = 0;


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
        var deckData = snapshot.val(); // Makes a copy of the database contents of Deck
        deckData.deckName = newDeckName; // Change name of deck in the copy
        var update = {}; // Creat an array of updates (because .set() does not allow partial changes to elements)
        update[oldDeckName] = null; // Delete the old deck from the database
        update[newDeckName] = deckData; // Create a new deck with the altered copy of deckData
        return decks.update(update); // Push update changes
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
            alert("Not a valid card.");
        }
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
            alert("Not a valid card.");
        }
    });
};

// Change Amount of Card
var changeCardAmount = function(listName, cardName, amount) {
    if (listName === "collection") {
        var cardList = users.child("/" + currentUser + "/collection/cards");
        cardList.child(cardName).once("value", function(snapshot) {
            // If amount is reduced to be equal to or below 0 remove all card data from database
            if ((snapshot.val().amount - amount) <= 0) { 
                cardList.child(cardName).remove();
            }
            // If amount remains positive update the amount
            else { 
                var newAmount = snapshot.val().amount - amount;
                var update = {};
                update["amount"] = newAmount;
                return cardList.child(cardName).update(update);
            }
        });
    }
    else { // listName is a deck
        var cardList = users.child("/" + currentUser + "/decks/" + listName + "/cards");
        cardList.child(cardName).once("value", function(snapshot) {
            // If amount is reduced to be equal to or below 0 remove all card data from database
            if ((snapshot.val().amount - amount) <= 0) { 
                cardList.child(cardName).remove();
            }
            // If amount remains positive update the amount
            else { 
                var newAmount = snapshot.val().amount - amount;
                var update = {};
                update["amount"] = newAmount;
                return cardList.child(cardName).update(update);
            }
        });
    };
};

// Display Dashboard
var displayDashboard = function(listName) {
    // Generate title
    var title;
    if (listName == "collection") {
        title = $("<h3>").text(currentUser + "'s Collection");
    }
    else {
        title = $("<h3>").text(listName);
    }
    $("#table-title").append(title);

    // Generate update table button
    var meta = $("<div>").attr("class", "col-md-2");
    var row1 = $("<div>").attr("class", "row");
    var updateBtn = $("<button>").attr("id", "update").text("Update Table");
    row1.append(updateBtn);
    meta.append(row1);

    // Generate change deck name form
    var row2 = $("<div>").attr("class", "row");
    var deckNameForm = $("<form>").attr("id", "deckName-form");
    var deckNameLabel = $("<label>").attr("for", "deckName-input").text("Change Deck Name");
    var deckNameInput = $("<textarea>").attr("type", "text").attr("id", "deckName-input");
    var deckNameSubmit = $("<input>").attr("type", "submit").attr("id", "deckName-submit").text("Submit");
    deckNameForm.append(deckNameLabel);
    deckNameForm.append(deckNameInput);
    deckNameForm.append(deckNameSubmit);
    row2.append(deckNameForm);

    // Generate a display by page form
    var row3 = $("<div>").attr("class", "row");
    var pageForm = $("<form>").attr("id", "page-form");
    var pageLabel = $("<label>").attr("for", "page-input").attr("id", "page-label").text("View Page");
    var pageInput = $("<textarea>").attr("type", "text").attr("id", "page-input");
    var pageSubmit = $("<input>").attr("type", "submit").attr("id", "page-submit").text("Submit");
    pageForm.append(pageLabel);
    pageForm.append(pageInput);
    pageForm.append(pageSubmit);
    row3.append(pageForm);

    if (listName == "collection") {
        meta.append(row3);
    }
    else {
        meta.append(row2);
    }

    // Generate add cards form
    var addCards = $("<div>").attr("class", "col-md-3");
    var addCardsForm = $("<form>").attr("id", "addCards-form");
    var addCardsLabel = $("<label>").attr("for", "addCards-input").text("Add Cards");
    var addCardsInput = $("<textarea>").attr("id", "addCards-input");
    var addCardsSubmit = $("<input>").attr("type", "submit").attr("id", "addCards-submit").text("Submit");
    addCardsForm.append(addCardsLabel);
    addCardsForm.append(addCardsInput);
    addCardsForm.append(addCardsSubmit);
    addCards.append(addCardsForm);

    // Generate remove cards form
    var removeCards = $("<div>").attr("class", "col-md-3");
    var removeCardsForm = $("<form>").attr("id", "removeCards-form");
    var removeCardsLabel = $("<label>").attr("for", "removeCards-input").text("Remove Cards");
    var removeCardsInput = $("<textarea>").attr("id", "removeCards-input");
    var removeCardsSubmit = $("<input>").attr("type", "submit").attr("id", "removeCards-submit").text("Submit");
    removeCardsForm.append(removeCardsLabel);
    removeCardsForm.append(removeCardsInput);
    removeCardsForm.append(removeCardsSubmit);
    removeCards.append(removeCardsForm);
    
    // Append elements to html boilerplate
    $("#dashboard").append(meta);
    $("#dashboard").append(addCards);
    $("#dashboard").append(removeCards);
}

// Display Cards on Table
var displayTable = function(listName) {
    $("#list").empty();

    // Create table elements
    var table = $("<table>").attr("class", "table").attr("id", "card-table");
    var thead = $("<thead>");
    var tr = $("<tr>");
    var th1 = $("<th>").attr("scope", "col").text("Amount");
    var th2 = $("<th>").attr("scope", "col").text("Name");
    var th3 = $("<th>").attr("scope", "col").text("Type");
    var th4 = $("<th>").attr("scope", "col").text("Cost");
    var th5 = $("<th>").attr("scope", "col").text("Power");
    var th6 = $("<th>").attr("scope", "col").text("Toughness");
    var tbody = $("<tbody>");

    // Append thead to table
    tr.append(th1);
    tr.append(th2);
    tr.append(th3);
    tr.append(th4);
    tr.append(th5);
    tr.append(th6);
    thead.append(tr);
    table.append(thead);

    if (listName == "collection") {
        var cardList = users.child("/" + currentUser + "/collection/cards");
        cardList.once('value', function(snapshot) {
            var cards = []; // Each card is to be pushed to this array to be sorted later (defaults to alphabetical ascending)
            var cardsPage = [];
            var cardRows = [];
            snapshot.forEach(function(cardSnapshot) {
                var cardData = cardSnapshot.val();
                var card = {
                    name: cardData.cardName,
                    amount: cardData.amount,
                    type: "",
                    cost: "",
                    power: "",
                    toughness: ""
                }
                cards.push(card);
            });
            pages = Math.floor(cards.length / 100);
            $("#page-label").text("Page " + (page + 1) + " of " + (pages));
            var cardsIndex = page * 100;
            for (i = 0; i < 100; i++) {
                if ((cardsIndex + i) < cards.length) {
                    cardsPage[i] = cards[cardsIndex + i];
                }
            }

            // Get additonal card data
            cardsPage.forEach(function(card) {
                var queryURL = scryfallURL + card.name;
                var index = cards.indexOf(card);
                // wait for ajax call to be completed before running rest of code
                $.when($.ajax({
                    url: queryURL,
                    method: "GET"
                })).done(function(response) {
                    var result = response.data;
                    result.forEach(function(resultCard) { 
                        // Get exact card match
                        if (card.name.toLowerCase() === (resultCard.name).toLowerCase()) {
                            card.type = resultCard.type_line;
                            card.cost = resultCard.mana_cost;
                            if (resultCard.power != undefined) {
                                card.power = resultCard.power;
                            }
                            if (resultCard.toughness != undefined) {
                                card.toughness = resultCard.toughness;
                            }

                            // Create table row elements
                            var tr = $("<tr>");
                            var tdAmount = $("<td>").text(card.amount);
                            var tdName = $("<td>").text(card.name);
                            var tdType = $("<td>").text(card.type);
                            var tdCost = $("<td>").text(card.cost);
                            var tdPower = $("<td>").text(card.power);
                            var tdToughness = $("<td>").text(card.toughness);

                            // Append td elements to tr
                            tr.append(tdAmount);
                            tr.append(tdName);
                            tr.append(tdType);
                            tr.append(tdCost);
                            tr.append(tdPower);
                            tr.append(tdToughness);

                            cardRows[index] = tr;
                        }
                    });
                    // Appends rows to tbody
                    cardRows.forEach(function(row) {
                        tbody.append(row);
                    });
                });
            });
        });
    }
    else { // listName is a deck
        var cardList = users.child("/" + currentUser + "/decks/" + listName + "/cards");
        cardList.once('value', function(snapshot) {
            var cards = []; // Each card is to be pushed to this array to be sorted later (defaults to alphabetical ascending)
            var cardRows = [];
            snapshot.forEach(function(cardSnapshot) {
                var cardData = cardSnapshot.val();
                var card = {
                    name: cardData.cardName,
                    amount: cardData.amount,
                    type: "",
                    cost: "",
                    power: "",
                    toughness: ""
                }
                cards.push(card);
            });

            // Get additonal card data
            cards.forEach(function(card) {
                var queryURL = scryfallURL + card.name;
                var index = cards.indexOf(card);
                // wait for ajax call to be completed before running rest of code
                $.when($.ajax({
                    url: queryURL,
                    method: "GET"
                })).done(function(response) {
                    var result = response.data;
                    result.forEach(function(resultCard) { 
                        // Get exact card match
                        if (card.name.toLowerCase() === (resultCard.name).toLowerCase()) {
                            card.type = resultCard.type_line;
                            card.cost = resultCard.mana_cost;
                            if (resultCard.power != undefined) {
                                card.power = resultCard.power;
                            }
                            if (resultCard.toughness != undefined) {
                                card.toughness = resultCard.toughness;
                            }

                            // Create table row elements
                            var tr = $("<tr>");
                            var tdAmount = $("<td>").text(card.amount);
                            var tdName = $("<td>").text(card.name);
                            var tdType = $("<td>").text(card.type);
                            var tdCost = $("<td>").text(card.cost);
                            var tdPower = $("<td>").text(card.power);
                            var tdToughness = $("<td>").text(card.toughness);

                            // Check if card is deck is also in your collection
                            var owned = false;
                            var ownedCards = users.child("/" + currentUser + "/collection/cards");
                            ownedCards.once('value', function(snapshot) {
                                snapshot.forEach(function(ownedCardSnapshot) {
                                    if (card.name == ownedCardSnapshot.val().cardName) {
                                        owned = true;
                                    }
                                });
                                if (owned == false) {
                                    tdName.attr("style", "color:red;");
                                }
                            });


                            // Append td elements to tr
                            tr.append(tdAmount);
                            tr.append(tdName);
                            tr.append(tdType);
                            tr.append(tdCost);
                            tr.append(tdPower);
                            tr.append(tdToughness);

                            cardRows[index] = tr;
                        }
                    });
                    // Appends rows to tbody
                    cardRows.forEach(function(row) {
                        tbody.append(row);
                    });
                });
            });
        });
    };
    
    // Append table to html boilerplate
    table.append(tbody);
    $("#list").append(table);
};

// Click event for updating the table
$(document.body).on("click", "#update", function(event) {
    event.preventDefault();

    displayTable(currentList);
});

// Click event for changing the page
$(document.body).on("click", "#page-submit", function(event) {
    event.preventDefault();

    var newPage = $("#page-input").val().trim();
    if (newPage > 0 && newPage <= pages) {
        page = parseInt(newPage - 1);
        displayTable(currentList);
    }
});

// Click event for changing deck name
$(document.body).on("click", "#deckName-submit", function(event) {
    event.preventDefault();

    var name = $("#deckName-input").val().trim();

    if (currentList != "collection" && name != "") {
        changeDeckName(currentList, name);
        currentList = name;

        // Generate title
        var title = $("<h3>").text(name);
        $("#table-title").empty();
        $("#table-title").append(title);
    }
});

// Click event for submitting new cards to deck or collection
$(document.body).on("click", "#addCards-submit", function(event) {
    event.preventDefault();

    var lines = $('#addCards-input').val().trim().split('\n');
    var badLines = [];

    // Get card name and amount from each line
    lines.forEach(function(line) {
        var cardName = "";
        var amount = "";
        for (var i = 0; i < line.length; i++) {
            // Check if character at [i] is a number and grab cardName and Amount
            if (line[i] == "0" || line[i] == "1" || line[i] == "2" || line[i] == "3" || line[i] == "4" || line[i] == "5" || line[i] == "6" || line[i] == "7" || line[i] == "8" || line[i] == "9") {
                cardName = line.substring(0, i).trim();
                amount = line.substring(i).trim();
                break;
            }
            // If number check was never passed add to badLines
            else if (i == (line.length - 1) && cardName == "" && amount == "") {
                badLines.push(line);
            };
        };
        // If amount is not a number add to badLines
        if (cardName != "" && isNaN(amount) == true) {
            badLines.push(line);
        }
        // If line contains only a number add to badLines
        else if (cardName == "" && isNaN(amount) == false) {
            badLines.push(line);
        };
        // If cardName is not blank and amount is a number
        if (cardName != "" && isNaN(amount) == false) {
            var queryURL = scryfallURL + cardName;

            $.when($.ajax({
                url: queryURL,
                method: "GET",
                error: function(){badLines.push(line);}
            })).done(function(response) {
                var result = response.data;
                result.forEach(function(card) { 
                    // Get exact card match
                    if (cardName.toLowerCase() === (card.name).toLowerCase()) {
                        if (currentList == "collection") {
                            addCardToCollection(cardName, amount);
                        } 
                        else {
                            addCardToDeck(currentList, cardName, amount);
                        }
                    }
                    // Else if cardName was not a real card add to badLines
                    else {
                        badLines.push(line);
                    };
                });
            });
        }
    });
    // var badText = "";
    // for (var i = 0; i < badLines.length; i++) {
    //     badText += badLines[i] + "\n"
    // }
    // $('#addCards-input').val(badText);
});

// Click event for submitting new cards to deck or collection
$(document.body).on("click", "#removeCards-submit", function(event) {
    event.preventDefault();

    var lines = $('#removeCards-input').val().trim().split('\n');
    var badLines = [];

    // Get card name and amount from each line
    lines.forEach(function(line) {
        var cardName = "";
        var amount = "";
        for (var i = 0; i < line.length; i++) {
            // Check if character at [i] is a number and grab cardName and Amount
            if (line[i] == "0" || line[i] == "1" || line[i] == "2" || line[i] == "3" || line[i] == "4" || line[i] == "5" || line[i] == "6" || line[i] == "7" || line[i] == "8" || line[i] == "9") {
                cardName = line.substring(0, i).trim();
                amount = line.substring(i).trim();
                break;
            }
            // If number check was never passed add to badLines
            else if (i == (line.length - 1) && cardName == "" && amount == "") {
                badLines.push(line);
            };
        };
        // If amount is not a number add to badLines
        if (cardName != "" && isNaN(amount) == true) {
            badLines.push(line);
        }
        // If line contains only a number add to badLines
        else if (cardName == "" && isNaN(amount) == false) {
            badLines.push(line);
        };
        // If cardName is not blank and amount is a number
        if (cardName != "" && isNaN(amount) == false) {
            var queryURL = scryfallURL + cardName;

            $.when($.ajax({
                url: queryURL,
                method: "GET",
                error: function(){badLines.push(line);}
            })).done(function(response) {
                var result = response.data;
                result.forEach(function(card) { 
                    // Get exact card match
                    if (cardName.toLowerCase() === (card.name).toLowerCase()) {
                        changeCardAmount(currentList, cardName, amount);
                    }
                    // Else if cardName was not a real card add to badLines
                    else {
                        badLines.push(line);
                    };
                });
            });
        }
    });
    // var badText = "";
    // for (var i = 0; i < badLines.length; i++) {
    //     badText += badLines[i] + "\n"
    // }
    // $('#removeCards-input').val(badText);
});

displayDashboard(currentList);
displayTable(currentList);