// Will store the cards from the current API call
var currentCards = {};

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
        $('#search').val('');

        // Store the results in a `results` variable
        var results = response.data;

        // Loop through the results
        for (let i = 0; i < results.length; i++) {
            // Store the result at the current index in the results in a `result` variable
            var result = results[i];

            // Store the result inside `currentCards` using the ID it has in the API response
            currentCards[result.id] = result;

            // Append the card to `#list`
            // `src` is pretty obvious
            // `data-id` is equal to result.id, meaning it is the same as what we stored it in the `currentCards` object as
            $('#list').append("<img src='" + result.image_uris['normal'] + "' class='card' data-id='" + result.id + "' /><br />");
        }
    });
});

// User clicks on a card
$('#list').on('click', '.card', function() {
    // Empty the `#searchForm` element
    $('#searchForm').empty();

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
    var legality = card.legalities;
    var cardFront = "<img src='" + card.image_uris['normal'] + "' />";

    // Join all of the data with `<br />`s
    var data = [name, creature, flavorText, legality].join("<br />");

    // Append the data to `#info`
    $('#info').append(data);
    // Append the card front to `#oneCard`
    $('#oneCard').append(cardFront);
});






 