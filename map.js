"use strict";
var L,
    produktionsplatser,
    population,
    policeStations,
    skyddsrum,
    police = false,
    shelters = false,
    presets = [
        {
            displayName: "Zombie Apocalypse - Lone wolf",
            targetValues: {
                policeStations: (value) => {
                    return value * 25;
                },
                shelters: (value) => {
                    //return 100 - value * 50;
                    return 0;
                },
                population: (value) => {
                    return value * -0.05
                }
            }
        },
        {
            displayName: "Zombie Apocalypse - Team Player",
            targetValues: {
                policeStations: (value) => {
                    return value * 7;
                },
                shelters: (value) => {
                    return value * 1;
                },
                population: (value) => {
                    return value * 0.001;
                }
            }
        },
        {
            displayName: "Zombie Apocalypse - City Lurker",
            targetValues: {
                policeStations: (value) => {
                    return value * 10;
                },
                shelters: (value) => {
                    return 0;
                },
                population: (value) => {
                    return value * 0.0005;
                }
            }
        },
        {
            displayName: "Custom",
            targetValues: {}
        },
        {
            displayName: "War (not working)",
            targetValues: {
                policeStations: (value) => {
                    return value * 5;
                },
                shelters: (value) => {
                    return value * 0.1;
                }
            }
        },
        {
            displayName: "Nuclear War (not working)",
            targetValues: {
                policeStations: (value) => {
                    return value * 0;
                },
                shelters: (value) => {
                    return value * 10;
                }
            }
        }
    ];


for (var i = 0; i < presets.length; i++) {
    var option = document.createElement("option");
    option.innerHTML = presets[i].displayName;
    document.getElementById("presetSelect").appendChild(option);
}

/*var imageUrl = 'https://preview.c9users.io/gryphyx/hfs-2018/recolor.png',
    imageBounds = [[53.5, 10], [68.5, 25]];
L.imageOverlay(imageUrl, imageBounds).addTo(map);*/

/*var mapLayer = L.tileLayer.wms("https://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv", {
    layers: 'GEBCO_LATEST',
    format: 'image/png',
    transparent: false,
    attribution: "Weather data © 2012 IEM Nexrad"
});*/

/*var wmsLayer = L.tileLayer.wms('https://demo.boundlessgeo.com/geoserver/ows?', {
    layers: 'ne:ne'
}).addTo(map);*/



/*var wmsLayer = L.tileLayer.wms('https://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?', {
    layers: 'GEBCO_LATEST',
    opacity: 1
}).addTo(map);*/

var osm_overlay = L.tileLayer.wms('http://ows.terrestris.de/osm-gray/service', {
    layers: 'OSM-Overlay-WMS',
    opacity: 0.5
});

//produktionsplatser.features[0].geometry.coordinates

function calcDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(Math.abs(x1 - x2), 2) + Math.pow(Math.abs(y1 - y2), 2));
}

var stations = 0;
/*for (var i = 0; i < policeStations.length; i++) {
    if (calcDistance(59.3293, 18.0686, policeStations[i].location.gps.split(",")[0], policeStations[i].location.gps.split(",")[1]) < 0.5) {
        stations++;
    }
    var circle = L.circle([policeStations[i].location.gps.split(",")[0], policeStations[i].location.gps.split(",")[1]], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 50
    }).addTo(map);
}*/

var mapInit = false;

if (mapInit == false) {
    document.getElementById("next").onclick = function() {
        document.getElementById("status").innerHTML = "Processing... Check console for progress";
        setTimeout(initMap, 1000);
    };
}
else {}

var maxScore = 200;

function initMap() {
    if (map != undefined) { //Fisk
        map.off();
        map.remove();
    }
    mapInit = true;
    var map = L.map('map').setView([53, 10], 4.5);
    osm_overlay.addTo(map);


    resolutionY = 0.5 / document.getElementById("resolution").value;
    resolutionX = 0.2 / document.getElementById("resolution").value;
    /*if (police == true) {
        for (var y = box.miny; y < box.maxy; y += resolutionY) {
            console.log(Math.floor(((y - 10) / 15) * 100) + "%");
            for (var x = box.minx; x < box.maxx; x += resolutionX) {
                var numStations = 0;
                for (var i = 0; i < policeStations.length; i++) {
                    if (calcDistance(x, y, policeStations[i].location.gps.split(",")[0], policeStations[i].location.gps.split(",")[1]) < 0.25) {
                        numStations++;
                    }
                }
                if (numStations == 0) continue;
                var color = Math.floor(255 * (numStations / 10));
                if (color >= 255) {
                    color = 255;
                }
                //console.log(color + " -- " + (255 - color));
                var circle = L.rectangle([[x, y], [x + resolutionX, y + resolutionY]], {
                    //color: rgbToHex(255-color, color, 0),
                    fillColor: rgbToHex(255 - color, color, 0),
                    fillOpacity: 0.5,
                    radius: 10000,
                    stroke: false
                });
                circle.bindPopup("Stations: " + numStations);
                circle.addTo(map);
            }
        }
    }

    if (shelters == true) {
        for (var i = 0; i < 100; i++) {
            var circle = L.circle([skyddsrum.features[i].geometry.coordinates[1], skyddsrum.features[i].geometry.coordinates[0]], {
                //color: rgbToHex(255-color, color, 0),
                fillColor: rgbToHex(0, 0, 255),
                fillOpacity: 0.5,
                radius: 1000,
                stroke: false
            });
            circle.addTo(map);
        }
    }*/


    var preset = presets[document.getElementById("presetSelect").selectedIndex];
    if (preset.displayName == "Custom") {
        preset.targetValues.policeStations = eval("(function(value){return " + document.getElementById("stations").value + "})");
        preset.targetValues.shelters = eval("(function(value){return " + document.getElementById("shelters").value + "})");
        preset.targetValues.population = eval("(function(value){return " + document.getElementById("population").value + "})");
    }

    for (var y = box.miny; y < box.maxy; y += resolutionY) {
        console.log(Math.floor(((y - 10) / 15) * 100) + "%");
        for (var x = box.minx; x < box.maxx; x += resolutionX) {
            var score = 0;

            var numStations = 0;
            for (var i = 0; i < policeStations.length; i++) {
                if (calcDistance(x, y, policeStations[i].location.gps.split(",")[0], policeStations[i].location.gps.split(",")[1]) < 0.1) {
                    numStations++;
                }
            }

            var numShelters = 0;
            for (var i = 0; i < skyddsrum.features.length; i++) {
                if (calcDistance(x, y, skyddsrum.features[i].geometry.coordinates[1], skyddsrum.features[i].geometry.coordinates[0]) < 0.1) {
                    numShelters++;
                }
            }

            score += preset.targetValues.policeStations(numStations);
            score += preset.targetValues.shelters(numShelters);

            var people = 0;
            for (var i = 0; i < population.length; i++) {
                if (calcDistance(x, y, population[i].coordinates[1], population[i].coordinates[0]) < 0.5) {
                    people += population[i].pop;
                }
            }
            score += preset.targetValues.population(people);

            //console.log(color + " -- " + (255 - color));
            if (score == 0 || score == 100) continue;
            var color = Math.floor(((score + maxScore) / (maxScore * 2)) * 255);
            if (color < 0) {
                color = 0;
            }
            else if (color > 255) {
                color = 255;
            }


            //color = Math.floor(255 * (numShelters / 10));
            var circle = L.rectangle([[x, y], [x + resolutionX, y + resolutionY]], {
                //color: rgbToHex(255-color, color, 0),
                fillColor: rgbToHex(255 - color, color, 0),
                fillOpacity: 0.5,
                radius: 10000,
                stroke: false
            });
            circle.bindPopup("Stations: " + numStations + ", Shelters: " + numShelters + ", score: " + score + ", color: " + color + ", people: " + people + " coords: " + x + ":" + y);
            circle.addTo(map);
        }
    }

    for (var i = 0; i < 10000; i++) {
        var circle = L.circle([population[i].coordinates[1], population[i].coordinates[0]], {
            //color: rgbToHex(255-color, color, 0),
            fillColor: rgbToHex(255, 0, 60),
            fillOpacity: 0.5,
            radius: 1000,
            stroke: false
        });
        //circle.addTo(map);
    }
}

var box = {
    miny: 10,
    minx: 54,
    maxy: 25,
    maxx: 69
};


var points = ((box.maxy - box.miny) / 0.5) * ((box.maxx - box.minx) / 0.2);
var b = 0;

/*var showProgress = setInterval(function(){
    document.getElementById("progress").innerHTML="Processing: " + (b/points)*100 + "%";
}, 500);*/

var resolutionY = 0.5 / document.getElementById("resolution").value;
var resolutionX = 0.2 / document.getElementById("resolution").value;

//clearInterval(showProgress);

//console.log(policeStations[0].location.gps.split(",")[0]);

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

document.getElementById("status").innerHTML = "Choose preset";
