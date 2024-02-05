require([
  'esri/Map',
  'esri/views/SceneView',
  'esri/layers/FeatureLayer',
  'esri/Graphic'
], function(Map, SceneView, FeatureLayer, Graphic) {

  var map = new Map({
    basemap: 'gray-vector',
    ground: 'world-elevation'
  });

  var view = new SceneView({
    container: 'viewDiv',
    map: map,
    camera: {
      position: [-90.1994, 38.627, 3000],
      tilt: 75
    }
  });

  var neighborhoodsLayer = new FeatureLayer({
    portalItem: {
      id: '3377546c0dd24dd789eaabd126f2fbb8' // ID for neighborhoods layer
    },
     opacity: 0.3 // Set the opacity to 30%
  });

  var crimePointsLayer = new FeatureLayer({
    portalItem: {
      id: '57f32ae532c241aa99b758872139e072' // ID for crime points layer
    }
  });

  map.add(neighborhoodsLayer);
  map.add(crimePointsLayer);

  var isReportingCrime = false;

  function addCrimeIncident(lat, lon, date, crimeType, details) {
    var point = {
      type: 'point',
      longitude: lon,
      latitude: lat
    };

    var pointGraphic = new Graphic({
      geometry: point,
      symbol: {
        type: 'simple-marker',
        color: '#ff0000',
        size: 8
      },
      attributes: {
        crimeType: crimeType,
        date: date,
        details: details
      },
      popupTemplate: {
        title: '<b>{crimeType}</b>',
        content: 'Date: {date}<br>{details}'
      }
    });

    view.graphics.add(pointGraphic);
  }

  document.getElementById('addCrimeButton').addEventListener('click', function() {
    alert('Click on the map to report a crime incident.');
    isReportingCrime = true;
  });

  view.on('click', function(event) {
    if (isReportingCrime) {
      view.hitTest(event).then(function(response) {
        if (response.results.length) {
          var mapPoint = response.results[0].mapPoint;
          var date = prompt('Enter date (YYYY-MM-DD):');
          var crimeType = prompt('Enter crime type:');
          var details = prompt('Enter additional details:');

          if (date && crimeType && details) {
            addCrimeIncident(mapPoint.latitude, mapPoint.longitude, date, crimeType, details);
            isReportingCrime = false;
          } else {
            alert('Invalid input. Crime incident not reported.');
          }
        }
      });
    }
  });
});
