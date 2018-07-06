var queryURL = "https://api.scryfall.com/cards/search?q=";
var cardName = "raging+goblin";

queryURL = queryURL + cardName;

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response) {
    
    result = response.data;
    // console.log(result);
});
