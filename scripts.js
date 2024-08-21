var watchId;
var startLat,startLon,endLat,endLon;
document.getElementById('formBox').onsubmit = function(event) {
    event.preventDefault();
    StartTracking();
};
document.getElementById('stop').addEventListener('click', StopTracking);
    function StartTracking() {
        var address=document.getElementById('destination').value;
        getCoordinates(address);
        watchId = navigator.geolocation.watchPosition(UsersLocationUpdated);
    }

    function UsersLocationUpdated(position) {
        startLat=position.coords.latitude;
        startLon=position.coords.longitude;
        calculateDistance();
    }

    function StopTracking() {
        console.log("Stopping tracking");
    if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
        watchId = undefined; // Clear the watchId to prevent accidental reuse
        console.log("Tracking stopped");
    } else {
        console.log("No tracking to stop");
    }
    }

function getCoordinates(address){
    var apiKey = 'AkZmA6inQ8X33Y7xyC7h937_FX52x5PCi6w0GZ_NS4o-S79PasmZnsXphgYbo5Hv';
    var encodedAddress = encodeURIComponent(address);
    var url = `https://dev.virtualearth.net/REST/v1/Locations?q=${encodedAddress}&key=${apiKey}`;
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function (data) {
            console.log(data);
            if (data && data.resourceSets && data.resourceSets.length > 0 && data.resourceSets[0].resources.length > 0) {
                var location = data.resourceSets[0].resources[0].point.coordinates;
                endLat= location[0];
                endLon = location[1];
            } else {
                console.log('No results found');
            }
        },
        error: function (error) {
            console.log(`Error ${error}`);
        }
    });
}
function calculateDistance() {
    var apiKey = 'AkZmA6inQ8X33Y7xyC7h937_FX52x5PCi6w0GZ_NS4o-S79PasmZnsXphgYbo5Hv';
    var url = `https://dev.virtualearth.net/REST/V1/Routes/Driving?wp.0=${startLat},${startLon}&wp.1=${endLat},${endLon}&key=${apiKey}`;
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function (data) {
            console.log(data);
            if (data && data.resourceSets && data.resourceSets.length > 0 && data.resourceSets[0].resources.length > 0) {
            var route = data.resourceSets[0].resources[0];
            var distance = route.travelDistance; // Distance in kilometers
            var duration = route.travelDuration; // Duration in seconds
            console.log(`Distance: ${distance} km`);
            console.log(`Travel Time: ${duration / 60} minutes`);
            if (distance < 0.5) {
                alert('The destination is less than 500 meters away!');
            }
            alert(`Distance: ${distance} km Travel Time: ${duration / 60} minutes`)
        } else {
                console.log('No results found');
            }
        },
        error: function (error) {
            console.log(`Error ${error}`);
        }
    });
}

