//(Stockholm, Sweden)
const targetLocation = { lat: 59.3293, lng: 18.0686 };
const locationTolerance = 0.10; 
let startTime;
let currentLocation = { lat: 0, lng: 0 };

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('checkLocationButton').addEventListener('click', function() {
        checkLocation();
    });
});

function checkLocation() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            document.getElementById('statusMessage').textContent = `Current location: Lat ${currentLocation.lat}, Lng ${currentLocation.lng}`;

            if (isInTargetLocation(currentLocation)) {
                document.getElementById('startButton').disabled = false;
            } else {
                document.getElementById('startButton').disabled = true;
                alert("You must be in the target location to start tracking.");
                document.getElementById('statusMessage').textContent += ' - Not in the target location.';
            }
        }, function(error) {
            document.getElementById('statusMessage').textContent = 'Error obtaining location: ' + error.message;
        });
    } else {
        document.getElementById('statusMessage').textContent = 'Geolocation is not supported by your browser.';
    }
}

function isInTargetLocation(currentLocation) {
    return (
        Math.abs(currentLocation.lat - targetLocation.lat) < locationTolerance &&
        Math.abs(currentLocation.lng - targetLocation.lng) < locationTolerance
    );
}

function startTiming() {
    if (isInTargetLocation(currentLocation)) {
        startTime = new Date();
        document.getElementById('stopButton').disabled = false;
        document.getElementById('startButton').disabled = true;
        document.getElementById('statusMessage').textContent = 'Timing started!';
    } else {
        alert("You must be in the target location to start tracking.");
    }
}

function stopTiming() {
    if (isInTargetLocation(currentLocation)) {
        const stopTime = new Date();
        const duration = (stopTime - startTime) / 1000; 
        document.getElementById('statusMessage').textContent = `Timing stopped. You worked for ${duration} seconds.`;
        document.getElementById('startButton').disabled = false;
        document.getElementById('stopButton').disabled = true;
    } else {
        alert("You must be in the target location to stop tracking.");
    }
}