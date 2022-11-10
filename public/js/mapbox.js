

const locations = JSON.parse(document.getElementById('map').dataset.locations)
console.log(locations);


mapboxgl.accessToken = 'pk.eyJ1IjoidGhvbW1pIiwiYSI6ImNsYWF2ZHRtMjAwNWszdm54ZWx0MWw2ZmUifQ.sSHGdj2Ly1AT3nRQyurgxQ';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11'
});


