

// Will store the cards from the current API call
var currentCards = {};
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
    var name = card.name;
    var creature = card.type_line;
    var flavorText = card.flavor_text;
    var cardText = card.oracle_text;
    var cost = card.mana_cost;
    var power = card.power;
    var toughness = card.toughness;
    var cardFront = "<img src='" + card.image_uris['normal'] + "' width='300px' height='400px'/>";

    // Join all of the data with `<br />`s
    var powTough = [power, toughness].join("/")
    var data = [name, creature, cardText, flavorText, cost, powTough].join("<br/>");
    
    // Append the data to `#info`
    $('#info').append(data, "<br>");
    // Append the card front to `#oneCard`
    $('#oneCard').append(cardFront);

    var addCard =  $('#info').append("<button>Add Card to Collection</button>")

    var addCardBtn = addCard.append(data);
    
    addCardBtn.on('click', addCardToCollection());
    
});



