var userKeyZomato = "fd85c6b350ae3ae83bcb37148a9f1d69";
var restaurantDisplay = document.querySelector("#restaurant-display");

// User Input hard variables
var zipToLat = "37.8";
var zipToLon = "-122.3";
var userCuisine = "Deli";

var numberOfCards = 3;
/**
 * Functions to make cards and render
 * Name: makeCardDOM
 * Parameters: restaurant, type - array 
 * Return: DOM element
 */
// Make the card
var makeCardDOM = function(restaurant){
  var cardDOM = document.createElement("div");
  cardDOM.innerHTML = 
  `<div id="card-${restaurant.id}">
    <h3 class="restaurant-name">${restaurant.name}</h3>
    <div class="restaurant-cuisine">${restaurant.cuisines}</div>
    <div class="restaurant-address">Address: ${restaurant.address}</div>
    <div class="restaurant-timings">Schedule: ${restaurant.timings}</div>
    <a class="restaurant-url" href=${restaurant.menu_url}>Website</a>
    <div class="restaurant-tele">Telephone: ${restaurant.phone_numbers}</div>
  </div>`;
  return cardDOM; 
};

// Render 3 cards to DOM
var make3Cards = function (restaurants, index) {
  for (; index < numberOfCards; index++) {
    var rest = restaurants[index].restaurant;
    restaurantDisplay.appendChild(makeCardDOM(rest));
  }
  numberOfCards += 3;
  return index; // return index after making card
};

var displayMoreRestaurants = document.querySelector("#display-more-restaurants");

/**
 * Function to make display more button display the next 3 from localStorage
 */
displayMoreRestaurants.addEventListener("click", function(){
  var localRestaurants = JSON.parse(window.localStorage.getItem("restaurants"));
  var localIndex = parseInt(window.localStorage.getItem('index'));

  localIndex = make3Cards(localRestaurants, localIndex);

  window.localStorage.setItem('index', localIndex);
});

var getRestaurants = function(){
  fetch(`https://developers.zomato.com/api/v2.1/cuisines?lat=${zipToLat}&lon=${zipToLon}`,
  {headers: {
    "user-key": userKeyZomato,
    "content-type": "application/json"
  }})
  .then(function(response) {
    if (response.ok) {
        return response.json();
    } else {
        alert("Please enter a valid zip code.");
    }
  })
  .then(function(response) {
    console.log("res: 131", response)
    for (var i = 0; i < response.cuisines.length; i++) {
      if (response.cuisines[i].cuisine.cuisine_name == userCuisine) {
        console.log(response.cuisines[i].cuisine.cuisine_id);
        var userCuisineID = response.cuisines[i].cuisine.cuisine_id

        fetch(`https://developers.zomato.com/api/v2.1/search?entity_type=city&lat=${zipToLat}&lon=${zipToLon}&cuisines=${userCuisineID}&sort=real_distance`,
        {headers: {
          "user-key": userKeyZomato,
          "content-type": "application/json"
        }})
        .then(function(response) {
          if (response.ok) {
              return response.json();
          } else {
              alert("Please enter a valid zip code.");
          }
        })
        .then(function(response) {
          var index = 0; 
          var restaurants = response.restaurants;
          window.localStorage.setItem('restaurants', JSON.stringify(restaurants));
          
          index = make3Cards(restaurants, index);

          console.log("index", index)
          window.localStorage.setItem('index', index);
          
        });
      };
    };
  });
};

getRestaurants();