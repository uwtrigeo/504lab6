// Mapbox basemap
var map = L.map('map').setView([40.53131646519857, -99.29443181421964], 5);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoidHJpZ2VvIiwiYSI6ImNsZHZ5YW9tYjAyODAzdXM4bHlwbjhnNm4ifQ.kHTDG7XT7noaK7zzYwHYbA'
}).addTo(map);

// Editable layer
var drawnItems = L.featureGroup().addTo(map);

// Draw control
new L.Control.Draw({
    draw : {
        polygon : true,
        polyline : true,
        rectangle : false,     // Rectangles disabled
        circle : false,        // Circles disabled 
        circlemarker : false,  // Circle markers disabled
        marker: true
    },
    edit : {
        featureGroup: drawnItems
    }
}).addTo(map);

//Form popup
function createFormPopup() {
    var popupContent = 
        '<form>' +
        'Description:<br><input type="text" id="input_desc"><br>' +
        'Age:<br><input type="text"id="input_age"><br>' +
        'Gender:<br><input type="text" id="input_gender"><br>' +
        'Traveled from:<br><input type="text" id="input_from"><br>' +
        'User\'s Name:<br><input type="text" id="input_name"><br>' +
        '<input type="button" value="Submit" id="submit">' +
        '</form>'
    drawnItems.bindPopup(popupContent).openPopup();
}

//Add event to draw control
map.addEventListener("draw:created", function(e) {
    e.layer.addTo(drawnItems);
    createFormPopup();
});

// Set data
function setData(e) {
    if(e.target && e.target.id == "submit") {
        // Get user name and description00
        var enteredage = document.getElementById("input_age").value;
        var enteredgender = document.getElementById("input_gender").value;
        var enteredfrom = document.getElementById("input_from").value;
        var enteredUsername = document.getElementById("input_name").value;
        var enteredDescription = document.getElementById("input_desc").value;
        // Print user name and description
        console.log(enteredage);
        console.log(enteredgender);
        console.log(enteredfrom);
        console.log(enteredUsername);
        console.log(enteredDescription);
        // Get and print GeoJSON for each drawn layer
        drawnItems.eachLayer(function(layer) {
            var drawing = JSON.stringify(layer.toGeoJSON().geometry);
            console.log(drawing);
        });
        // Clear drawn items layer
        drawnItems.closePopup();
        drawnItems.clearLayers();
    }
}

// Run set data function
document.addEventListener("click", setData);

// fine tune the popup behavior based on drawing events
map.addEventListener("draw:editstart", function(e) {
    drawnItems.closePopup();
});
map.addEventListener("draw:deletestart", function(e) {
    drawnItems.closePopup();
});
map.addEventListener("draw:editstop", function(e) {
    drawnItems.openPopup();
});
map.addEventListener("draw:deletestop", function(e) {
    if(drawnItems.getLayers().length > 0) {
        drawnItems.openPopup();
    }
});


// Text box overlay
L.Control.textbox = L.Control.extend({
    onAdd: function(map) {
        
    var text = L.DomUtil.create('div', "textBoxStyle");
    text.id = "info_text";
    text.innerHTML = "<h3>Instructions</h3> Draw a polygon, polyline, or marker. Then, click on the drawing to enter information about the ski resort you're at."
    return text;
    },

    onRemove: function(map) {
        // Nothing to do here
    }
});
L.control.textbox = function(opts) { return new L.Control.textbox(opts);}
L.control.textbox({ position: 'bottomleft'}).addTo(map);