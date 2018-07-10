// Global Variables
var currentUser = "";   
var scryfallURL = "https://api.scryfall.com/cards/search?q=";
var currentList = "collection";
var pages = 0;
var page = 0;
var totalMana = [];

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

/*
***functions***
checkUser
displayLogin
displayCreateAccount
login
createAccount
displayUserInfo
logout
displayCreateDeck
createDeck
getDecks
changeDeckName
addCardToCollection
addCardToDeck
changeCardAmount
displayDashboard
displayCharts
displayTable
*/

// Check local storage for active login
var checkUser = function() {
    var storedName = localStorage.getItem("username");
    if (storedName !== null) {
        currentUser = storedName;
        $(".card").hide();
        displayUserInfo();
        getDecks();
        displayCreateDeck();
        displayDashboard(currentList);
        displayTable(currentList);
    }
    else{
        displayLogin();
        displayCreateAccount();
    };
};

// Display login card
var displayLogin = function () {
    var card = $("<div>").attr("class", "card");
    card.attr("style", "width: 18rem;");
    var cardBody = $("<div>").attr("class", "card-body");

    var cardTitle = $("<h5>").attr("class", "card-title");
    cardTitle.text("Login");
    var loginForm = $("<form>");

    var usernameGroup = $("<div>").attr("class", "form-group");
    var usernameLabel = $("<label>").attr("for", "text");
    usernameLabel.text("User Name");
    var usernameInput = $("<input>").attr("class", "form-control");
    usernameInput.attr("type", "text");
    usernameInput.attr("id", "username-input");
    usernameInput.attr("placeholder", "User Name");
    var usernameSmall = $("<small>").attr("class", "form-text text-muted");
    usernameSmall.attr("id", "usernameHelp");
    usernameSmall.text("We'll never share your username with anyone else.");
    usernameGroup.append(usernameLabel);
    usernameGroup.append(usernameInput);
    usernameGroup.append(usernameSmall);
    loginForm.append(usernameGroup);

    var passwordGroup = $("<div>").attr("class", "form-group");
    var passwordLabel = $("<label>").attr("for", "text");
    passwordLabel.text("Password");
    var passwordInput = $("<input>").attr("class", "form-control");
    passwordInput.attr("type", "text");
    passwordInput.attr("id", "password-input");
    passwordInput.attr("placeholder", "Password");
    var passwordSmall = $("<small>").attr("class", "form-text text-muted");
    passwordSmall.attr("id", "passwordHelp");
    passwordSmall.text("We'll never share your password with anyone else.");
    passwordGroup.append(passwordLabel);
    passwordGroup.append(passwordInput);
    passwordGroup.append(passwordSmall);
    loginForm.append(passwordGroup);

    var loginSubmit = $("<button>").attr("class", "btn btn-primary");
    loginSubmit.attr("type", "submit");
    loginSubmit.attr("id", "login-submit");
    loginSubmit.text("Log In");
    loginForm.append(loginSubmit);

    cardBody.append(cardTitle);
    cardBody.append(loginForm);
    card.append(cardBody);
    $("#login").append(card);
};

// Display create account card
var displayCreateAccount = function () {
    var card = $("<div>").attr("class", "card");
    card.attr("style", "width: 18rem;");
    var cardBody = $("<div>").attr("class", "card-body");

    var cardTitle = $("<h5>").attr("class", "card-title");
    cardTitle.text("Create Account");
    var createAccountForm = $("<form>");

    var usernameGroup = $("<div>").attr("class", "form-group");
    var usernameLabel = $("<label>").attr("for", "text");
    usernameLabel.text("User Name");
    var usernameInput = $("<input>").attr("class", "form-control");
    usernameInput.attr("type", "text");
    usernameInput.attr("id", "userCreate-input");
    usernameInput.attr("placeholder", "User Name");
    var usernameSmall = $("<small>").attr("class", "form-text text-muted");
    usernameSmall.attr("id", "usernameHelp");
    usernameSmall.text("We'll never share your username with anyone else.");
    usernameGroup.append(usernameLabel);
    usernameGroup.append(usernameInput);
    usernameGroup.append(usernameSmall);
    createAccountForm.append(usernameGroup);

    var passwordGroup = $("<div>").attr("class", "form-group");
    var passwordLabel = $("<label>").attr("for", "text");
    passwordLabel.text("Password");
    var passwordInput = $("<input>").attr("class", "form-control");
    passwordInput.attr("type", "text");
    passwordInput.attr("id", "passwordCreate-input");
    passwordInput.attr("placeholder", "Password");
    var passwordSmall = $("<small>").attr("class", "form-text text-muted");
    passwordSmall.attr("id", "passwordHelp");
    passwordSmall.text("We'll never share your password with anyone else.");
    passwordGroup.append(passwordLabel);
    passwordGroup.append(passwordInput);
    passwordGroup.append(passwordSmall);
    createAccountForm.append(passwordGroup);

    var confirmGroup = $("<div>").attr("class", "form-group");
    var confirmLabel = $("<label>").attr("for", "text");
    confirmLabel.text("Confirm Password");
    var confirmInput = $("<input>").attr("class", "form-control");
    confirmInput.attr("type", "text");
    confirmInput.attr("id", "passwordConfirm-input");
    confirmInput.attr("placeholder", "Password");
    confirmGroup.append(confirmLabel);
    confirmGroup.append(confirmInput);
    createAccountForm.append(confirmGroup);

    var createAccountSubmit = $("<button>").attr("class", "btn btn-primary");
    createAccountSubmit.attr("type", "submit");
    createAccountSubmit.attr("id", "createAccount-submit");
    createAccountSubmit.text("Submit");
    createAccountForm.append(createAccountSubmit);

    cardBody.append(cardTitle);
    cardBody.append(createAccountForm);
    card.append(cardBody);
    $("#create-account").append(card);
};

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
            // var modal = $("<div>").attr("class", "modal");
            // var modalContent = $("<div>").attr("class", "modal-content");
            // var modalSpan = $("<span>").attr("class", "close").text("&times;");
            // var modalP = $("<p>").text("Invalid Username");

            // modalContent.append(modalSpan);
            // modalContent.append(modalP);
            // modal.append(modalContent);
            // modal.style.display = "block";

            // modalSpan.onclick = function() {
            //     modal.style.display = "none";
            // }
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
            localStorage.clear();
            localStorage.setItem("username", currentUser);
            $("#login").empty();
            $("#create-account").empty();
            displayUserInfo();
            getDecks();
            displayCreateDeck();
            displayDashboard(currentList);
            displayTable(currentList);
        };
    });
};
    
// Create Account function
var createAccount = function(username, password) {
    var invalidUser = false;
    users.once("value", function(snapshot) {
        snapshot.forEach(function(userSnapshot) {
            if (username == userSnapshot.val().username) {
                invalidUser = true;
            }
        });
        if (invalidUser == true) {
            var modal = document.getElementById('invalid-username');
            var span = document.getElementsByClassName("user-close")[0];
            modal.style.display = "block";
            span.onclick = function() {
                modal.style.display = "none";
            }
        }
        else {
            users.child(username).set({
                username: username,
                password: password
            });
        };
    });
};

// Display user info
var displayUserInfo = function() {
    var user = $("<p>").attr("id", "active-user").text("Hello, you are logged in as " + currentUser);
    var logoutBtn = $("<button>").attr("id", "logoutBtn").text("Logout");
    $("#user-info").append(user);
    $("#user-info").append(logoutBtn);
};

// Logout function
var logout = function() {
    currentUser = "";
    localStorage.clear();
    $(".user-stuff").empty();
    checkUser();
};

// Display create deck form
var displayCreateDeck = function() {
    var deckForm = $("<form>");
    deckForm.append('<input type="text" placeholder="Deck Name" id="deck-input">');
    deckForm.append('<input type="button" value="Create Deck" id="createDeck-submit">');
    $('#create-deck').append(deckForm);
};

// Create deck in database
var createDeck = function(deckName) {
    var decks = users.child("/" + currentUser + "/decks");
    decks.child(deckName).set({
        deckName: deckName
    });  
};

// Dynamically display buttons (or similar elements) for all decks created by the user that when clicked will display the cards in that deck.
var getDecks =  function() {
    $("#collection").empty();
    var collectionButton = $("<button>").attr("class", "collection-button");
    collectionButton.text("Collection");
    $("#collection").append(collectionButton);
    var deckList = users.child("/" + currentUser + "/decks");
    deckList.once("value", function(snapshot) {
        snapshot.forEach(function(deckSnapshot) {
            deckData = deckSnapshot.val();
            var deckButton = $("<button>").attr("class", "deck-button");
            deckButton.text(deckData.deckName);
            $("#collection").append(deckButton);
        });
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
        getDecks();
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
            console.log("Not a valid card.");
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
            console.log("Not a valid card.");
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
            if ((parseInt(snapshot.val().amount) - parseInt(amount)) <= 0) { 
                cardList.child(cardName).remove();
            }
            // If amount remains positive update the amount
            else { 
                var newAmount = parseInt(snapshot.val().amount) - parseInt(amount);
                var update = {};
                update["amount"] = newAmount;
                return cardList.child(cardName).update(update);
            }
        });
    };
};

// Display Dashboard
var displayDashboard = function(listName) {
    $("#table-title").empty();
    $("#dashboard").empty();

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
    var pageInput = $("<textarea>").attr("type", "text").attr("id", "page-input").attr("placeholder", "[page number]");
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
    var addCardsInput = $("<textarea>").attr("id", "addCards-input").attr("placeholder", "[amount] [card name]\n[amount] [card name]\n...");
    var addCardsSubmit = $("<input>").attr("type", "submit").attr("id", "addCards-submit").text("Submit");
    addCardsForm.append(addCardsLabel);
    addCardsForm.append(addCardsInput);
    addCardsForm.append(addCardsSubmit);
    addCards.append(addCardsForm);

    // Generate remove cards form
    var removeCards = $("<div>").attr("class", "col-md-3");
    var removeCardsForm = $("<form>").attr("id", "removeCards-form");
    var removeCardsLabel = $("<label>").attr("for", "removeCards-input").text("Remove Cards");
    var removeCardsInput = $("<textarea>").attr("id", "removeCards-input").attr("placeholder", "[amount] [card name]\n[amount] [card name]\n...");
    var removeCardsSubmit = $("<input>").attr("type", "submit").attr("id", "removeCards-submit").text("Submit");
    removeCardsForm.append(removeCardsLabel);
    removeCardsForm.append(removeCardsInput);
    removeCardsForm.append(removeCardsSubmit);
    removeCards.append(removeCardsForm);

    // Append elements to html boilerplate
    $("#dashboard").append(meta);
    $("#dashboard").append(addCards);
    $("#dashboard").append(removeCards);

    // Generate show charts button
    if (listName != "collection") {
        var charts = $("<div>").attr("class", "col-md-2").attr("id", "charts");
        var showCharts = $("<button>").attr("id", "charts-button").text("View Card Color Breakdown");
        charts.append(showCharts);
        $("#dashboard").append(charts);    
    }
};

// Display Charts
var displayCharts = function() {
    if (currentList != "collection") {
        var whiteMana = 0;
        var blueMana = 0;
        var blackMana = 0;
        var redMana = 0;
        var greenMana = 0;

        // Calculate total mana for each color
        for (var i = 0; i < totalMana.length; i++) {
            if (totalMana[i] == "{W}") {
                whiteMana++;
            }
            else if (totalMana[i] == "{U}") {
                blueMana++;
            }
            else if (totalMana[i] == "{B}") {
                blackMana++;
            }
            else if (totalMana[i] == "{R}") {
                redMana++;
            }
            else if (totalMana[i] == "{G}") {
                greenMana++;
            }
        };

        // Define data for chart
        var chartColors = [];
        var colorWhite = 'rgba(235, 235, 200, 1)';
        var colorBlue = 'rgba(0, 130, 230, 1)';
        var colorBlack = 'rgba(0, 0, 0, 1)';
        var colorRed = 'rgba(235, 0, 0, 1)';
        var colorGreen = 'rgba(0, 100, 0, 1)';

        var presentMana = [];
        var amountPerColor = [];
        if (whiteMana != 0) {
            presentMana.push("White Symbols");
            amountPerColor.push(whiteMana);
            chartColors.push(colorWhite);
        }
        if (blueMana != 0) {
            presentMana.push("Blue Symbols");
            amountPerColor.push(blueMana);
            chartColors.push(colorBlue);
        }
        if (blackMana != 0) {
            presentMana.push("Black Symbols");
            amountPerColor.push(blackMana);
            chartColors.push(colorBlack);
        }
        if (redMana != 0) {
            presentMana.push("Red Symbols");
            amountPerColor.push(redMana);
            chartColors.push(colorRed);
        }
        if (greenMana != 0) {
            presentMana.push("Green Symbols");
            amountPerColor.push(greenMana);
            chartColors.push(colorGreen);
        }

        console.log(presentMana);
        console.log(amountPerColor);

        // Create Doughnut Chart
        var chartTitle = $("<p>").attr("id", "chart-title").text("Card Color Breakdown");
        $("#charts").append(chartTitle);
        var canvas = $("<canvas>").attr("id", "myChart");
        canvas.attr("width", "100");
        canvas.attr("height", "100");
        $("#charts").append(canvas);
        $("#dashboard").append(charts);
        var ctx = document.getElementById("myChart").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: presentMana,
                datasets: [{
                    label: 'Card Color Breakdown',
                    data: amountPerColor,
                    backgroundColor: chartColors,
                    borderColor: chartColors,
                    borderWidth: 1
                }]
            },
            options: {
                legend: {
                    display: false
                }
            }
        });
    };
};

// Display Cards on Table
var displayTable = function(listName) {
    $("#list").empty();
    totalMana = [];

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
            pages = Math.ceil(cards.length / 100);
            if (pages === 0) {
                $("#page-label").text("Page 1 of 1");
            }
            else {
                $("#page-label").text("Page " + (page + 1) + " of " + (pages));
            }
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

                            // Get total mana cost for deck
                            var breakdown = [];
                            var manaCost = card.cost; 
                            var index = 0;
                            var stop = false;
                            while(stop == false) {
                                if (manaCost.length == 0) {
                                    stop = true;
                                }
                                else if (manaCost[index] == "}") {
                                    var mc = manaCost.substring(0, (index + 1));
                                    if (manaCost.length > (index + 1)) {
                                        manaCost = manaCost.substring(index+1);
                                    }
                                    else {
                                        manaCost = "";
                                    }
                                    breakdown.push(mc);
                                    index = 0;
                                }
                                else {
                                    index++;
                                };
                            };
                            if (card.amount > 1) {
                                var totalBreakdown = [];
                                totalBreakdown = totalBreakdown.concat(breakdown);
                                for (var i = 1; i < card.amount; i++) {
                                    totalBreakdown = totalBreakdown.concat(breakdown);
                                }
                                breakdown = totalBreakdown;
                            }
                            totalMana = totalMana.concat(breakdown);

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

/*
***$.on click events***
#login-submit
#createAccount-submit
#logoutBtn
#createDeck-submit
.collection-button
.deck-button
#update
#page-submit
#deckName-submit
#addCards-submit
#removeCards-submit
#charts-button
*/

// Click event for login
$(document.body).on("click", "#login-submit", function (event) {
    event.preventDefault();
    var name = $("#username-input").val().trim();
    var pass = $("#password-input").val().trim();
    login(name, pass);
});

// Click event for create account
$(document.body).on("click", "#createAccount-submit", function (event) {
    event.preventDefault();
    var username = $("#userCreate-input").val().trim();
    var password = $("#passwordCreate-input").val().trim();
    var confirm = $("#passwordConfirm-input").val().trim();
    if(password === confirm) {
        createAccount(username,password);
    };
});

// Click event for logout
$(document.body).on("click", "#logoutBtn", function() {
    event.preventDefault();
    logout();
});

// Click event for create deck
$(document.body).on("click", "#createDeck-submit", function(event) {
    event.preventDefault();
    var deckName = $("#deck-input").val().trim();
    createDeck(deckName);
    getDecks();
});


// Click event for display collection button
$(document.body).on("click", ".collection-button", function(event) {
    event.preventDefault();
    currentList = "collection";

    displayDashboard(currentList);
    displayTable(currentList);
});

// Click event for display deck button
$(document.body).on("click", ".deck-button", function(event) {
    event.preventDefault();;
    currentList = $(this).text();
    totalMana = [];
    displayDashboard(currentList);
    displayTable(currentList);
});

// Click event for updating the table
$(document.body).on("click", "#update", function(event) {
    event.preventDefault();

    displayDashboard(currentList);
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
            if (line[i] != "0" && line[i] != "1" && line[i] != "2" && line[i] != "3" && line[i] != "4" && line[i] != "5" && line[i] != "6" && line[i] != "7" && line[i] != "8" && line[i] != "9") {
                amount = line.substring(0, i).trim();
                cardName = line.substring(i).trim();
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

// Click event for removing cards from deck or collection
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
            if (line[i] != "0" && line[i] != "1" && line[i] != "2" && line[i] != "3" && line[i] != "4" && line[i] != "5" && line[i] != "6" && line[i] != "7" && line[i] != "8" && line[i] != "9") {
                amount = line.substring(0, i).trim();
                cardName = line.substring(i).trim();
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
                        changeCardAmount(currentList, card.name, amount);
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

$(document.body).on("click", "#charts-button", function(event) {
    event.preventDefault();
    $("#charts").empty();
    displayCharts();
});

// Initialize Website
$(document).ready(checkUser());