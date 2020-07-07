//define variables to capture zipcodeinput
var zipcodeFormEl = document.querySelector("#zipcode-form");
var nameInputEl = document.querySelector("#zipcodename");
var locationContainerEl = document.querySelector("#locations-container");
var locationSearchTerm = document.querySelector("#location-search-term");

//define variable to display restaurants
var userKeyZomato = "fd85c6b350ae3ae83bcb37148a9f1d69";
var restaurantDisplay = document.querySelector("#restaurant-display");

/* User Input hard variables
var zipToLat = "37.8";
var zipToLon = "-122.3"; */
var userCuisine = "Deli";
 
 //This exists only for the purpose of rendering latitude and longitude on screen. 
 //This render isn't needed for the final app
var displaylocations = function (locations, searchTerm) {
 //if zipcode entered does not return a latitude and longitude
 if (locations.length === 0) {
   locationContainerEl.textContent = "No locations found";
   return;
 }
 //Console logging zipcode and latitude and longitude to know we are on the right track
 locationContainerEl.textContent = "";
 locationSearchTerm.textContent = searchTerm;
 console.log(searchTerm);
 console.log(locations);
 
 //Defining a variable called locationName. 
 //This exists only for the purpose of rendering latitude and longitude on screen. 
 //This render isn't needed for the final app
 var locationName = locations.zip_code + "/" + locations.lat + "/" + locations.lng;
 console.log(locationName);
 
     // create a container for location rendering
     //This render isn't needed for the final app
     var locationEl = document.createElement("div");
     locationEl.classList = "list-item flex-row justify-space-between align-center";
 
     // create a span element to hold location name in rendering
     //This render isn't needed for the final app
     var titleEl = document.createElement("span");
     titleEl.textContent = locationName;
 
         // append to container
         //This render isn't needed for the final app
         locationEl.appendChild(titleEl);
 
             //append container to the dom
             //This render isn't needed for the final app
             locationContainerEl.appendChild(locationEl);
 
};

//Code to display restuarants on screen
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



//start of main API to fetch information
var getzipcodelocations = function (zipcode) {
    var apiUrl = "https://www.zipcodeapi.com/rest/Kw3XyO3XjHqeVTrhowyUEZnz9nUaRX5lyiHa59PozklLlOy8NPjDqAlF2MVdmyEd/info.json/" + zipcode + "/degrees";
    
    fetch(apiUrl)
      .then(function (answer) {
        if (answer.ok) {
          answer.json().then(function (data) {
            displaylocations(data, zipcode);
            var ziptolat = data.lat
            var ziptolng = data.lng
            console.log (ziptolat)
            console.log (ziptolng)
                .then(function(ziptolat, ziptolng){
                    fetch(`https://developers.zomato.com/api/v2.1/cuisines?lat=${ziptolat}&lon=${ziptolng}`,
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







                })


          });
        } else {
          alert("Error " + answer.statusText);
        }
      })
      .catch(function (error) {
        //notice this `.catch()` getting chained onto the end of the `.then` method
        alert("Unable to connect to Zipcode API server");
      });
   };




//This function exists to read the correct zipcode from the input form
var formSubmitHandler = function (event) {
 event.preventDefault();
 console.log(event);
 var zipcodename = nameInputEl.value.trim();
 console.log(nameInputEl.value);
 
 if (zipcodename) {
   getzipcodelocations(zipcodename);
   nameInputEl.value = "";
 } else {
   alert("Please enter zipcodename");
 }
};

//This event listener listens for the submit button to be clicked 
//after zipcode is entered into input form
zipcodeFormEl = addEventListener("submit", formSubmitHandler);
