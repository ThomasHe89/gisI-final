var basemapUrl = 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png';
var attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';


///////////////////////////////////////////////////////////////////////
// Map 1                                                             //
///////////////////////////////////////////////////////////////////////

// - deleted - 

///////////////////////////////////////////////////////////////////////
// Select data for Maps 2 & 3                                                             //
///////////////////////////////////////////////////////////////////////

// this object is empty, but when we call getJSON(), we'll set it to the result
var globalData;
// assigning "abs15" saves us the if statement further down below 
var selectedYear = "abs15"; 
var selectedYear2 = "rel15";

//listen for clicks on the dropdown
/*
$("ul.dropdown-menu li a").click(function(e) {
  selectedYear = e.target.id;
  document.getElementsByClassName("info")[0].innerHTML = '<h4>Immigration in 20'+ selectedYear.substr(3,4) + '</h4>' + 'Hover over a state';
  //iterate over each layer (polygon) in the geojson, 
  //call setStyle() on each, pass in 2nd argument with 
  //whatever property the user selected
  geo2.eachLayer(function (layer) {  
      layer.setStyle(style(layer.feature, selectedYear)) 
  });
  infoHelper(selectedYear);
});
*/
$("#yearSelect2 :input").change(function() {
    console.log(this.id); // points to the clicked input button
    selectedYear = this.id;
    selectedYear2 = "rel" + selectedYear.substr(3,4)
  //reset info window every time user selects new year
  //(otherwise the old number will still be up)
  //these are basically additional info.update functions
  document.getElementsByClassName("info2")[0].innerHTML = '<h4>Asylum applications in 20'+ selectedYear.substr(3,4) + '</h4>' + 'Hover over a state';
  document.getElementsByClassName("info3")[0].innerHTML = '<h4>Asylum applications in 20'+ selectedYear.substr(3,4) + '</h4>' + 'Hover over a state';
  //for each map, iterate over each layer (polygon) in the geojson, 
  //call setStyle() on each, pass in 2nd argument with 
  //whatever property the user selected
  geo2.eachLayer(function (layer) {  
      layer.setStyle(style2(layer.feature, selectedYear)) 
  });
  geo3.eachLayer(function (layer) {  
      layer.setStyle(style3(layer.feature, selectedYear)) 
  });
  infoHelper(selectedYear);
  infoHelper2(selectedYear2);
});

///////////////////////////////////////////////////////////////////////
// Map 2                                                             //
///////////////////////////////////////////////////////////////////////

var map2 = L.map('map2', {
  scrollWheelZoom: true
}).setView( [55.924586,9.228516], 3);

//clean background
var tile2 = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
      id: 'mapbox.light'
    });
tile2.addTo(map2);

function brewer2(d) {
    return d > 100000 ? '#0000cc' :
           d > 75000  ? '#BD0026' :
           d > 50000  ? '#E31A1C' :
           d > 30000  ? '#FC4E2A' :
           d > 10000  ? '#FD8D3C' :
           d > 5000   ? '#FEB24C' :
           d > 1000   ? '#FED976' :
                        '#FFEDA0';
}

//added a 2nd argument to style() so we can get different fill colors depending on which property we are styling
function style2(featureData) {
  // //not necessary because of initial assignment
  // //first time it runs, use 'abs15'
  // if (!selectedYear) {
  //   selectedYear = "abs15";
  // }

  return {
      fillColor: brewer2(featureData.properties[selectedYear]),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
  };
}

function infoHelper(selectedYear) {
  // //not necessary because of initial assignment
  // //first time it runs, use 'abs15'
  // if (!selectedYear) {
  //   selectedYear = "abs15";
  // }
  return selectedYear;
}

function infoHelper2(selectedYear) {
  return selectedYear2;
}

//control that shows state info on hover
var info2 = L.control();

info2.onAdd = function(map) {
  this._div = L.DomUtil.create('div', 'info2');
  this.update();
  return this._div;
};

info2.update = function(properties) {
  console.log(selectedYear);
  this._div.innerHTML = '<h4>Asylum applications in 20'+ selectedYear.substr(3,4) + '</h4>' +  (properties ?
    '<b>' + properties.SOVEREIGNT + '</b><br />' + properties[selectedYear]
    : 'Hover over a state');
};

info2.addTo(map2);

//this function is set to run when a user mouses over any polygon
function mouseover2(e) {
  var layer = e.target;
  layer.setStyle({
      weight: 2,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
  });

  if (!L.Browser.ie && !L.Browser.opera) {
      layer.bringToFront();
  }

  //update the text in the infowindow with whatever was in the data
  info2.update(layer.feature.properties);
}

//this runs on mouseout
function reset2(e) {
  console.log(e.target);
  e.target.setStyle(style2(e.target.feature));
  // sneak in a second info2.update() function
  document.getElementsByClassName("info2")[0].innerHTML = '<h4>Asylum applications in 20'+ selectedYear.substr(3,4) + '</h4>' + 'Hover over a state';
}

//this is executed once for each feature in the data, and adds listeners
function done2(feature, layer) {
  layer.on({
      mouseover: mouseover2,
      mouseout: reset2
      //click: zoomToFeature
  });
}

//helper functions are defined -> get data and render map!
//need to specify style and onEachFeature options when calling L.geoJson().
var geo2;
$.getJSON('data/allData.geojson', function(allData) {
  geo2 = L.geoJson(allData,{
    style: style2,
    onEachFeature: done2
  }).addTo(map2);
});
var legend2 = L.control({position: 'bottomright'});

legend2.onAdd = function(map) {

  var div = L.DomUtil.create('div', 'info2 legend'),
    grades = [0, 1000, 5000, 10000, 30000, 50000, 75000, 100000],
    labels = [],
    from, to;

  for (var i = 0; i < grades.length; i++) {
    from = grades[i];
    to = grades[i + 1];

    labels.push(
      '<i style="background:' + brewer2(from + 1) + '"></i> ' +
      from + (to ? ' &ndash; ' + to : '+'));
  }

  div.innerHTML = labels.join('<br>');
  return div;
};

legend2.addTo(map2);

///////////////////////////////////////////////////////////////////////
// Map 3                                                             //
///////////////////////////////////////////////////////////////////////

var map3 = L.map('map3', {
  scrollWheelZoom: true
}).setView( [55.924586,9.228516], 3);

//clean background
var tile3 = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
      id: 'mapbox.light'
    });

tile3.addTo(map3);

function brewer3(d) {
    return d > .015  ? '#0000cc' :
           d > .01   ? '#BD0026' :
           d > .005  ? '#E31A1C' :
           d > .0025 ? '#FC4E2A' :
           d > .001  ? '#FD8D3C' :
           d > .0005 ? '#FEB24C' :
           d > .0001 ? '#FED976' :
                       '#FFEDA0';
}

//this function returns a style object, but dynamically sets fillColor based on the data
function style3(featureData) {
  return {
      fillColor: brewer3(featureData.properties[selectedYear2]),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
  };
}

//control that shows state info on hover
var info3 = L.control();

info3.onAdd = function(map) {
  this._div = L.DomUtil.create('div', 'info3');
  this.update();
  return this._div;
};

info3.update = function(properties) {
  this._div.innerHTML = '<h4>Asylum applications in 20'+ selectedYear2.substr(3,4) + '</h4>' +  (properties ?
    '<b>' + properties.SOVEREIGNT + '</b><br />' + (properties[selectedYear2]*100).toFixed(2) + '%'
    : 'Hover over a state');
};

info3.addTo(map3);

var geo3;

//this function is set to run when a user mouses over any polygon
function mouseover3(e) {
  var layer = e.target;
  layer.setStyle({
      weight: 2,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
  });

  if (!L.Browser.ie && !L.Browser.opera) {
      layer.bringToFront();
  }

  //update the text in the infowindow with whatever was in the data
  info3.update(layer.feature.properties);
}

//this runs on mouseout
function reset3(e) {
  e.target.setStyle(style3(e.target.feature));
  document.getElementsByClassName("info3")[0].innerHTML = '<h4>Asylum applications in 20'+ selectedYear.substr(3,4) + '</h4>' + 'Hover over a state';
}

//this is executed once for each feature in the data, and adds listeners
function done3(feature, layer) {
  layer.on({
      mouseover: mouseover3,
      mouseout: reset3
      //click: zoomToFeature
  });
}

//all of the helper functions are defined -> get data and render it!
//need to specify style and onEachFeature options when calling L.geoJson().
var geo3;
$.getJSON('data/allData.geojson', function(allData) {
  geo3 = L.geoJson(allData,{
    style: style3,
    onEachFeature: done3
  }).addTo(map3);
});

var legend3 = L.control({position: 'bottomright'});

legend3.onAdd = function(map) {

  var div = L.DomUtil.create('div', 'info3 legend'),
    grades = [0, .0001, .0005, .001, .0025, .005, .01, .015],
    labels = [],
    from, to;

  for (var i = 0; i < grades.length; i++) {
    from = grades[i];
    to = grades[i + 1];

    labels.push(
      '<i style="background:' + brewer3(from + 10e-5) + '"></i> ' +
      (from*100).toFixed(2) + '%' + (to ? ' &ndash; ' + (to*100).toFixed(2) + '%' : '+'));
  }

  div.innerHTML = labels.join('<br>');
  return div;
};

legend3.addTo(map3);

///////////////////////////////////////////////////////////////////////
// Pie Chart 1                                                       //
///////////////////////////////////////////////////////////////////////

var pie = new d3pie("pieChart", {
  "header": {
    "title": {
      "text": "Attacks on refugee hostels",
      "fontSize": 28,
      "font": "open sans"
    },
    "subtitle": {
      "text": "Almost none of the crimes have been solved.",
      "color": "#999999",
      "fontSize": 14,
      "font": "open sans"
    },
    "titleSubtitlePadding": 9
  },
  "footer": {
    "color": "#999999",
    "fontSize": 10,
    "font": "open sans",
    "location": "bottom-left"
  },
  "size": {
    "canvasWidth": 600,
    "pieOuterRadius": "90%"
  },
  "data": {
    "sortOrder": "value-asc",
    "content": [
      {
        "label": "no suspect yet identified",
        "value": 169,
        "color": "#bd0026"
      },
      {
        "label": "suspect identified",
        "value": 41,
        "color": "#f03b20"
      },
      {
        "label": "charges filed",
        "value": 8,
        "color": "#fd8d3c"
      },
      {
        "label": "conviction",
        "value": 4,
        "color": "#fecc5c"
      }
    ]
  },
  "labels": {
    "outer": {
      "format": "label",
      "pieDistance": 32
    },
    "inner": {
      "format": "value"
    },
    "mainLabel": {
      "fontSize": 12
    },
    "value": {
      "color": "#ffffff",
      "decimalPlaces": 0
    },
    "value": {
      "color": "#252525",
      "fontSize": 12
    },
    "lines": {
      "enabled": true
    },
    "truncation": {
      "enabled": true
    }
  },
  "effects": {
    "pullOutSegmentOnClick": {
      "effect": "elastic",
      "speed": 400,
      "size": 8
    }
  },
  "misc": {
    "gradient": {
      "enabled": true,
      "percentage": 100
    }
  }
});

///////////////////////////////////////////////////////////////////////
// Pie Chart 2                                                       //
///////////////////////////////////////////////////////////////////////

var pie2 = new d3pie("pieChart2", {
  "header": {
    "title": {
      "text": "Attacks by state",
      "fontSize": 28,
      "font": "open sans"
    },
    "subtitle": {
      "text": "64 out of 222 attacks in Saxony alone.",
      "color": "#999999",
      "fontSize": 14,
      "font": "open sans"
    },
    "titleSubtitlePadding": 9
  },
  "footer": {
    "color": "#999999",
    "fontSize": 10,
    "font": "open sans",
    "location": "bottom-left"
  },
  "size": {
    "canvasWidth": 600,
    "pieOuterRadius": "90%"
  },
  "data": {
    "sortOrder": "value-desc",
    "content": [
      {
        "label": "Schlewswig-Hol.",
        "value": 7,
        "color": "#2484c1"
      },
      {
        "label": "Bremen",
        "value": 2,
        "color": "#0c6197"
      },
      {
        "label": "Hamburg",
        "value": 2,
        "color": "#4daa4b"
      },
      {
        "label": "Mecklenbg.-W.P.",
        "value": 16,
        "color": "#90c469"
      },
      {
        "label": "Lower Saxony",
        "value": 5,
        "color": "#daca61"
      },
      {
        "label": "Brandenburg",
        "value": 13,
        "color": "#e4a14b"
      },
      {
        "label": "Berlin",
        "value": 20,
        "color": "#e98125"
      },
      {
        "label": "North Rhine-W.",
        "value": 21,
        "color": "#cb2121"
      },
      {
        "label": "Saxony-Anhalt",
        "value": 15,
        "color": "#830909"
      },
      {
        "label": "Thuringia",
        "value": 8,
        "color": "#923e99"
      },
      {
        "label": "Rhineland-Pal.",
        "value": 6,
        "color": "#ae83d5"
      },
      {
        "label": "Hesse",
        "value": 10,
        "color": "#bf273e"
      },
      {
        "label": "Saxony",
        "value": 64,
        "color": "#ce2aeb"
      },
      {
        "label": "Saarland",
        "value": 2,
        "color": "#bca44a"
      },
      {
        "label": "Baden-Württ.",
        "value": 17,
        "color": "#618d1b"
      },
      {
        "label": "Bavaria",
        "value": 14,
        "color": "#1ee67b"
      }
    ]
  },
  "labels": {
    "outer": {
      "format": "label",
      "pieDistance": 32
    },
    "inner": {
      "format": "value"
    },
    "mainLabel": {
      "fontSize": 12
    },
    "value": {
      "color": "#ffffff",
      "decimalPlaces": 0
    },
    "value": {
      "color": "#252525",
      "fontSize": 12
    },
    "lines": {
      "enabled": true
    },
    "truncation": {
      "enabled": true
    }
  },
  "effects": {
    "pullOutSegmentOnClick": {
      "effect": "elastic",
      "speed": 400,
      "size": 8
    }
  },
  "misc": {
    "gradient": {
      "enabled": true,
      "percentage": 100
    }
  }
});
