export const displayMap = locations => {
    mapboxgl.accessToken =
      'pk.eyJ1IjoidGhvbW1pIiwiYSI6ImNsYWF2ZHRtMjAwNWszdm54ZWx0MWw2ZmUifQ.sSHGdj2Ly1AT3nRQyurgxQ';
  
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/thommi/clacbc2eu000a16ruj9udrg8v',
      // style: 'mapbox://styles/thommi/clacb9y7s000s14sdjy3djsu1',
      // style: 'mapbox://styles/jonasschmedtmann/cjvi9q8jd04mi1cpgmg7ev3dy',
      // scrollZoom: false
      // center: [-118.113491, 34.111745],
      // zoom: 10,
      // interactive: false
    });
  
    const bounds = new mapboxgl.LngLatBounds(); // are which will displayed on the map
  
    locations.forEach(loc => {
      // Create marker
      const el = document.createElement('div');
      el.className = 'marker'; // we give the div a class called marker, which is already styled in our css
  
      // Add marker
      new mapboxgl.Marker({ 
        element: el, // thats the div we created
        anchor: 'bottom' // bottom of the pin is located right on the coordinates point
      })
        .setLngLat(loc.coordinates) // coordinates field is in our tour.json inside locations. it holds as value an array of [lat, long] coordinates
        .addTo(map);
  
      // Add popup - for seeing location names on the map
      new mapboxgl.Popup({
        offset: 30 // we dont want to overlay the paragraph over the div, thats why we are moving the paragraph up with offset:30 property.
      })
        .setLngLat(loc.coordinates)
        .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`) // we see the day and description which is saved inside our tour documents field locations.day and locations.description
        .addTo(map);
  
      // Extend map bounds to include current location
      bounds.extend(loc.coordinates);
    });
  
    map.fitBounds(bounds, {
      padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100
      }
    });
  };




