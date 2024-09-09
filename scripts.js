var watchId;
var startLat,startLon,endLat,endLon,alarm;



function GetMap()
    {
        document.getElementById('MapBox').style.display="block";
        var map = new Microsoft.Maps.Map('#MapBox');
        document.getElementById('closeMap').style.display="block";
        Microsoft.Maps.Events.addHandler(map, 'click', function(e) {
            if (e.location) {
                selectedLat = e.location.latitude;
                selectedLon = e.location.longitude;
                document.getElementById('destination').value = `${selectedLat},${selectedLon}`;
                CloseMap();
            }
        });
        
    }

function CloseMap()
{
    document.getElementById('MapBox').style.display="none";
    document.getElementById('closeMap').style.display="none";
}


    function StartTracking() {
        var address = document.getElementById('destination').value.trim().split(",");
    
    // Check if address has exactly two elements (latitude and longitude)
    if (address.length !== 2 || isNaN(address[0]) || isNaN(address[1])) {
        alert('Please enter a valid latitude and longitude separated by a comma.');
        return; // Exit the function to prevent starting tracking
    }
    
    endLat = parseFloat(address[0].trim());
    endLon = parseFloat(address[1].trim());
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
        watchId = undefined; 
        console.log("Tracking stopped");
        document.getElementById('destination').value = '';
        stopAlertSound();
    } else {
        console.log("No tracking to stop");
    }
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
            var distance = route.travelDistance;
            var duration = route.travelDuration; 
            console.log(`Distance: ${distance} km`);
            console.log(`Travel Time: ${duration / 60} minutes`);
            if (distance < 0.5) {
                playSound();
                alert('The destination is less than 500 meters away!');
                setTimeout(stopAlertSound,600);
                StopTracking;
            }
        } else {
                console.log('No results found');
            }
        },
        error: function (error) {
            console.log(`Error ${error}`);
        }
    });
}
function playSound(){
    alarm=document.getElementById('alarmSound');
    alarm.play();
}
function stopAlertSound() {
    alarm.pause();
    alarm.currentTime = 0; // Reset playback position to start
}

document.getElementById('formBox').onsubmit = function(event) {
    event.preventDefault();
    StartTracking();
};

document.getElementById('map').addEventListener('click',GetMap);
document.getElementById('closeMap').addEventListener('click',CloseMap);
document.getElementById('stop').addEventListener('click', StopTracking);

