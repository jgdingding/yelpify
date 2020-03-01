var lat = 0;
var long = 0;
var locInput = document.getElementById("locInput");
var removepad = document.getElementById("removepad");
var term = document.getElementById("term");
var loc = document.getElementsByName("loc");
var openness = document.getElementsByName("open");
var body = document.getElementById("mainBody");

function updatePosition(position) {
    lat = position.coords.latitude;
    long = position.coords.longitude;
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(updatePosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}
$(document).ready(function () {
    getLocation();
});

$("input[type=radio][name=loc]").change(function () {
    if (this.value == "other") {
        locInput.style.display = "inline";
        removepad.style.paddingRight = "0";
    } else if (this.value == "this") {
        locInput.style.display = "none";
        removepad.style.paddingRight = "20%";
    }
});

$("#options").submit(function (e) {
    e.preventDefault();
});

term.addEventListener("keydown", function (event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        getShops();
    }
});

locInput.addEventListener("keydown", function (event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        getShops();
    }
});

function getShops() {
    var getstr = "/businessInfo?";
    getstr += "term=" + term.value + "&";
    for (i = 0; i < loc.length; i++) {
        if (loc[i].checked) {
            if (loc[i].value == "this") {
                getstr +=
                    "longitude=" + long.toString() + "&latitude=" + lat.toString() + "&";
            } else if (loc[i].value == "other") {
                getstr += "location=" + locInput.value + "&";
            }
        }
    }
    var checkCosts = Array.prototype.slice
        .call(document.querySelectorAll(".cost:checked"))
        .map(function (el) {
            return el.value;
        })
        .join(", ");
    getstr += "price=" + checkCosts + "&";
    for (i = 0; i < openness.length; i++) {
        if (openness[i].checked) {
            if (openness[i].value == "open") {
                getstr += "open_now=true";
            }
        }
    }
    $.get(getstr, function (data) {
        body.innerHTML = data;
    });
}

function favoriter(el) {
    if (el.innerHTML == "star_border") {
        el.innerHTML = "star";
    } else {
        el.innerHTML = "star_border";
    }
}

function showMap() {
    var theMap = document.getElementById("map_div");
    theMap.style.display = "block";
    var mapbtn = document.getElementById("mapbtn");
    mapbtn.style.display = "none";
    var getstr = "/mapInfo?";
    getstr += "term=" + term.value + "&";
    for (i = 0; i < loc.length; i++) {
        if (loc[i].checked) {
            if (loc[i].value == "this") {
                getstr +=
                    "longitude=" + long.toString() + "&latitude=" + lat.toString() + "&";
            } else if (loc[i].value == "other") {
                getstr += "location=" + locInput.value + "&";
            }
        }
    }
    var checkCosts = Array.prototype.slice
        .call(document.querySelectorAll(".cost:checked"))
        .map(function (el) {
            return el.value;
        })
        .join(", ");
    getstr += "price=" + checkCosts + "&";
    for (i = 0; i < openness.length; i++) {
        if (openness[i].checked) {
            if (openness[i].value == "open") {
                getstr += "open_now=true";
            }
        }
    }
    $.get(getstr, function (data) {
        var temp = JSON.parse(data);
        var coords = [];
        var links = [];
        var name = [];
        for (i = 0; i < temp.businesses.length; i++) {
            coords.push({
                lat: temp.businesses[i].coordinates.latitude,
                lng: temp.businesses[i].coordinates.longitude
            });
            links.push(temp.businesses[i].url);
            name.push(temp.businesses[i].name);
        }
        var curLoc = {
            lat: lat,
            lng: long
        };
        var map = new google.maps.Map(
            document.getElementById('map_div'), {
                zoom: 12,
                center: curLoc
            }
        );
        var infowindow = new google.maps.InfoWindow();
        for (i = 0; i < coords.length; i++) {
            var marker = new google.maps.Marker({
                position: coords[i],
                map: map,
                title: name[i]
            });
            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    infowindow.setContent(name[i]);
                    infowindow.open(map, marker);
                }
            })(marker, i));
        }
    });
}