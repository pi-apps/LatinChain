// Get DOM elements
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const statusMessage = document.getElementById('status-message');
const mapElement = document.getElementById('map');

let map;
let userMarker;
let userLat;
let userLon;
const searchMarkers = [];

// Define the custom green icon for the user's location.
// Using an image from an open-source CDN.
const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Function to initialize the map
function initMap(lat, lon) {
    // Check if map is already initialized
    if (map) {
        map.remove(); // Remove the existing map instance
    }
    
    map = L.map('map').setView([lat, lon], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add a marker for the user's location
    // Using the new green icon here
    userMarker = L.marker([lat, lon], {icon: greenIcon}).addTo(map)
        .bindPopup('You are here!')
        .openPopup();
}

// Function to get the user's geolocation
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLat = position.coords.latitude;
                userLon = position.coords.longitude;
                statusMessage.textContent = 'Location found!';
                initMap(userLat, userLon);
            },
            (error) => {
                console.error('Error getting location:', error);
                statusMessage.textContent = 'Could not get location. Please enable location services.';
            }
        );
    } else {
        statusMessage.textContent = 'Geolocation is not supported by this browser.';
    }
}

// Asynchronous function to get the country code from user's coordinates
async function getCountryCode(lat, lon) {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.address && data.address.country_code) {
            return data.address.country_code;
        }
        return null;
    } catch (error) {
        console.error('Error getting country code:', error);
        return null;
    }
}

// Function to perform the search with a three-step approach
async function searchPlaces(query) {
    if (!userLat || !userLon) {
        statusMessage.textContent = 'Please wait while we find your location...';
        return;
    }

    // Clear previous search markers
    searchMarkers.forEach(marker => map.removeLayer(marker));
    searchMarkers.length = 0;

    let data = [];
    let searchType = 'local';

    // --- STEP 1: Local Search (5 km radius) ---
    statusMessage.textContent = `Searching for "${query}" within 5km of your location...`;
    
    // Approximation of latitude/longitude degrees for 5 km
    const kmInLatDegree = 111.0; 
    const offset = 5 / kmInLatDegree; 
    const localSearchUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&viewbox=${userLon - offset},${userLat - offset},${userLon + offset},${userLat + offset}&bounded=1`;
    
    try {
        const response = await fetch(localSearchUrl);
        data = await response.json();
    } catch (error) {
        console.error('Error in local search:', error);
    }

    // --- STEP 2: If no results, expand search to the country ---
    if (data.length === 0) {
        statusMessage.textContent = `No nearby results found. Searching nationwide...`;
        searchType = 'national';
        const countryCode = await getCountryCode(userLat, userLon);
        
        if (countryCode) {
            const countrySearchUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&countrycodes=${countryCode}`;
            try {
                const response = await fetch(countrySearchUrl);
                data = await response.json();
            } catch (error) {
                console.error('Error in country-wide search:', error);
            }
        }
    }
    
    // --- STEP 3: If still no results, search worldwide ---
    if (data.length === 0) {
        statusMessage.textContent = `No national results found. Searching worldwide...`;
        searchType = 'global';
        const globalSearchUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10`;
        
        try {
            const response = await fetch(globalSearchUrl);
            data = await response.json();
        } catch (error) {
            console.error('Error in global search:', error);
            statusMessage.textContent = 'An error occurred while searching for places. Please try again.';
            return;
        }
    }

    // If still no data after all attempts
    if (data.length === 0) {
        statusMessage.textContent = `No results found for "${query}".`;
        return;
    }

    // Display results on the map
    const bounds = L.latLngBounds([]);
    data.forEach(place => {
        const lat = parseFloat(place.lat);
        const lon = parseFloat(place.lon);
        const name = place.display_name;
        const marker = L.marker([lat, lon]).addTo(map).bindPopup(`<b>${name}</b>`);
        searchMarkers.push(marker);
        bounds.extend([lat, lon]);
    });

    // Fit the map to show all results
    bounds.extend([userLat, userLon]);
    map.fitBounds(bounds, { padding: [50, 50] });

    // Display final message based on the search type
    statusMessage.textContent = `Showing ${data.length} results (${searchType}).`;
}

// Event listener for the form submission
searchForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the form from reloading the page
    const query = searchInput.value;
    if (query) {
        searchPlaces(query);
    }
});

// Initial call to get location when the page loads
document.addEventListener('DOMContentLoaded', getLocation);
