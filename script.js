const locationTolerance = 0.80; // Tolerans för att avgöra om användaren är inom målområdet (i grader)
let startTime; // Variabel för att lagra starttiden
let currentLocation = { lat: 0, lng: 0 }; // Variabel för att lagra användarens nuvarande plats
let targetLocation = { lat: 0, lng: 0 }; // Variabel för att lagra användarens målplats

// När sidan har laddats
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('setLocationButton').addEventListener('click', function() {
        setTargetLocation();
    });

    document.getElementById('checkLocationButton').addEventListener('click', function() {
        checkLocation();
    });
});

// Funktion för att ställa in målplatsen baserat på användarens inmatning
function setTargetLocation() {
    const lat = parseFloat(document.getElementById('latitude').value); 
    const lng = parseFloat(document.getElementById('longitude').value); 

    if (!isNaN(lat) && !isNaN(lng)) {
        targetLocation = { lat, lng }; 
        document.getElementById('checkLocationButton').disabled = false; // Aktivera knappen för att kontrollera platsen
        document.getElementById('statusMessage').textContent = `Målplats satt till Lat ${lat}, Lng ${lng}`;
    } else {
        alert('Ange giltiga värden för latitud och longitud.');
    }
}

// Funktion för att kontrollera användarens nuvarande plats
function checkLocation() {
    if ('geolocation' in navigator) { // Kontrollera om geolokalisering stöds av webbläsaren
        navigator.geolocation.getCurrentPosition(function (position) {
            currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }; 

            document.getElementById('statusMessage').textContent = `Nuvarande plats: Lat ${currentLocation.lat}, Lng ${currentLocation.lng}`; 

            if (isInTargetLocation(currentLocation)) {
                document.getElementById('startButton').disabled = false; // Aktivera startknappen om användaren är inom målområdet
            } else {
                document.getElementById('startButton').disabled = true; // Inaktivera startknappen om användaren inte är inom målområdet
                alert("Du måste vara på målplatsen för att starta spårning."); // Visa varning
                document.getElementById('statusMessage').textContent += ' - Inte på målplatsen.'; // Lägg till meddelande om att användaren inte är på målplatsen
            }
        }, function(error) {
            document.getElementById('statusMessage').textContent = 'Fel vid hämtning av plats: ' + error.message; // Visa felmeddelande om plats hämtning misslyckas
        });
    } else {
        document.getElementById('statusMessage').textContent = 'Geolokalisering stöds inte av din webbläsare.'; // Visa meddelande om geolokalisering inte stöds
    }
}

// Funktion för att kontrollera om användaren är inom målområdet
function isInTargetLocation(currentLocation) {
    return (
        Math.abs(currentLocation.lat - targetLocation.lat) < locationTolerance &&
        Math.abs(currentLocation.lng - targetLocation.lng) < locationTolerance
    ); 
}

// Funktion för att starta tidtagning
function startTiming() {
    if (isInTargetLocation(currentLocation)) { // Kontrollera om användaren är inom målområdet
        startTime = new Date(); // Sätt starttiden till nuvarande tid
        document.getElementById('stopButton').disabled = false; // Aktivera stoppknappen
        document.getElementById('startButton').disabled = true; // Inaktivera startknappen
        document.getElementById('statusMessage').textContent = 'Tidtagning startad!'; // Visa meddelande om att tidtagning har startat
    } else {
        alert("Du måste vara på målplatsen för att starta spårning."); // Visa varning om användaren inte är inom målområdet
    }
}

// Funktion för att stoppa tidtagning
function stopTiming() {
    if (isInTargetLocation(currentLocation)) { // Kontrollera om användaren är inom målområdet
        const stopTime = new Date(); // Sätt stoptiden till nuvarande tid
        const duration = (stopTime - startTime) / 1000; // Beräkna varaktigheten i sekunder
        document.getElementById('statusMessage').textContent = `Tidtagning stoppad. Du arbetade i ${duration} sekunder.`; // Visa meddelande om varaktigheten
        document.getElementById('startButton').disabled = false; // Aktivera startknappen
        document.getElementById('stopButton').disabled = true; // Inaktivera stoppknappen
    } else {
        alert("Du måste vara på målplatsen för att stoppa spårning."); // Visa varning om användaren inte är inom målområdet
    }
}
