////////////////////////////Variables//////////////////////////////////////

//ipify api key
const api_key = 'at_fBhFEZI3AjDNmPmJPRshNDrIL2dBC';

//Constants to get the DOM elements from the IP information area
const ipAddress = document.getElementById("IP-Address");
const ipLocation = document.getElementById("location");
const timezone = document.getElementById("timezone");
const isp = document.getElementById("isp");

//Constant to get the input element
const input = document.getElementById("ipInput");

//Regular Expressions
const ipExp = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
const domainExp = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;

////////////////////////////Events//////////////////////////////////////

//Window eventlistener to launch page loads
window.addEventListener("load", () => {
  //Call init function
  init();
});

//Add an submit event listener to the form on the page.
document.querySelector("form").addEventListener("submit", async (event) => {
  //Prevent form defaults
  event.preventDefault();
  //Constant to aquire IPDetails from the query from input.value
  const queryData = await getIPDetails(input.value);
  //Call the loadData function to load the data into the page
  loadData(queryData);
});

////////////////////////////Functions//////////////////////////////////////

//Async function to initialize the owners IP and location
async function init() {
  //Set the input.value to an empty string
  input.value = "";
  //set data to Call the getLocalIPData
  const data = await getLocalIPData();
  //Call the loadData function to load the data into the page
  loadData(data);
}

//Async function Gets the owners IP Details
async function getLocalIPData() {
  //fetch the data from ipify
  const response = await fetch(
    `https://geo.ipify.org/api/v1?apiKey=${api_key}`
  );
  //set data = response json
  const data = await response.json();
  //return data
  return data;
}

//LoadData into document
function loadData(data) {
  //Variables for latitude and longitude set to null
  let lat = null;
  let lng = null;
  //Fill the page elements with incomming data
  ipAddress.innerHTML = data.ip;
  ipLocation.innerHTML = `${data.location.city}, ${data.location.region}`;
  timezone.innerHTML = "UTC" + data.location.timezone;
  isp.innerHTML = data.isp;
  //Set the latitude and longitude
  lat = data.location.lat;
  lng = data.location.lng;
  //Call the drawMap function giving it the latitude and longitude
  drawMap(lat, lng);
}

//Draw the map on the page
function drawMap(lat, lng) {
  //grab the inside div of the map-container
  document.querySelector(".map-container").innerHTML = "<div id='map'></div>";
  //Create mymap variable and set the view to the incomming latitude and longitude
  var mymap = L.map("map").setView([lat, lng], 18);
  //Create a constant marker to put on the map with the incomming latitude and longitude
  const marker = L.marker([lat, lng]).addTo(mymap);
  //set marker latitude and longitude
  marker.setLatLng([lat, lng]);
  //Add a tileLayer to the map setting its details
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>.' + ' Challenge by<a href = "https://www.frontendmentor.io?ref=challenge" target = "_blank"> Frontend Mentor</a>.' +
      ' Coded by<a href = "https://kennethlamb.me/" target = "_blank"> Kenneth Lamb</a>.',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
  }).addTo(mymap);
}

//Async function to get IP details from a query
async function getIPDetails(query) {
  //Variable to hold the type of query
  let type = null;

  //Test if the query is formated in IP or Domain
  if(ipExp.test(query)) {
    type = "ipAddress";
  }
  else if(domainExp.test(query)) {
    type = "domain";
  }
  else {
    //TODO insert an error message here
    return;
  }
  //fetch the data from ipify
  const response = await fetch(
    `https://geo.ipify.org/api/v1?apiKey=${api_key}&${type}=${query}`
  );
  //set data = response json
  const data = await response.json();
  //return data
  return data;
}
