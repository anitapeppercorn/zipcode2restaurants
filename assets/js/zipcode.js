var zipcodeFormEl = document.querySelector("#zipcode-form");
var nameInputEl = document.querySelector("#zipcodename");
var locationContainerEl = document.querySelector("#locations-container");
var locationSearchTerm = document.querySelector("#location-search-term");
 
var displaylocations = function (locations, searchTerm) {
 if (locations.length === 0) {
   locationContainerEl.textContent = "No locations found";
   return;
 }
 
 locationContainerEl.textContent = "";
 locationSearchTerm.textContent = searchTerm;
 console.log(searchTerm);
 console.log(locations);
 
 var locationName = locations.zip_code + "/" + locations.lat + "/" + locations.lng;
 console.log(locationName);
 
     // create a container for location
     var locationEl = document.createElement("div");
     locationEl.classList = "list-item flex-row justify-space-between align-center";
 
     // create a span element to hold location name
     var titleEl = document.createElement("span");
     titleEl.textContent = locationName;
 
         // append to container
         locationEl.appendChild(titleEl);
 
             //append container to the dom
             locationContainerEl.appendChild(locationEl);
 
};
 
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
 
zipcodeFormEl = addEventListener("submit", formSubmitHandler);
