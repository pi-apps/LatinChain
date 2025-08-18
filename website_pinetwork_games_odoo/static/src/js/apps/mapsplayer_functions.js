// Get DOM elements
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const statusMessage = document.getElementById('status-message');
const mapElement = document.getElementById('map');

let map;
let userMarker;
let clickedMarker; // Marker for a single clicked location
let userLat;
let userLon;
const searchMarkers = [];
let isWatching = false; // Flag to track if we're watching the user's location

// --- Routing variables ---
let routingControl;
let routingState = 'idle'; // 'idle', 'selecting-start', 'selecting-end', 'route-ready'
let waypoints = []; // Stores the start and end points for the route

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

/**
 * Clears all search and clicked markers, and any existing route.
 */
function clearAllMarkers() {
    // Clear all markers from search results
    searchMarkers.forEach(marker => map.removeLayer(marker));
    searchMarkers.length = 0;
    
    // Clear the single-click marker
    if (clickedMarker) {
        map.removeLayer(clickedMarker);
        clickedMarker = null;
    }
    
    // Clear the route if it exists
    if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
        waypoints = [];
        routingState = 'idle';
    }
}

/**
 * Dynamically adjusts the max-height of the routing panel to 50% of the map's height.
 * This prevents the panel from overflowing on smaller screens.
 */
function adjustRoutingPanelHeight() {
    const routingPanel = document.querySelector('.leaflet-routing-container.leaflet-control');
    if (routingPanel && mapElement) {
        const mapHeight = mapElement.clientHeight;
        routingPanel.style.maxHeight = `${mapHeight * 0.5}px`;
    }
}

// Function to initialize the map
function initMap(lat, lon) {
    // Check if map is already initialized
    if (map) {
        map.remove(); // Remove the existing map instance
    }
    
    map = L.map('map').setView([lat, lon], 15);
    
    // Define base map layers for the layer control
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // OpenStreetMap HOT layer
    const hotLayer = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a></a>'
    });

    // OpenTopMap layer
    const opentopomapLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
    
    // Add the default layer to the map
    osmLayer.addTo(map);

    // Add a marker for the user's location
    userMarker = L.marker([lat, lon], {icon: greenIcon}).addTo(map)
        .bindPopup('You are here!')
        .openPopup();
    
    // Create layer control and add it to the map
    const baseMaps = {
        "Standard OSM": osmLayer,
        "OSM HOT": hotLayer,
        "OpenTopoMap": opentopomapLayer
    };
    L.control.layers(baseMaps).addTo(map);

    // Create a custom control for re-centering on the user's location
    const locationControl = L.Control.extend({
        options: {
            position: 'topleft'
        },
        onAdd: function (map) {
            const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
            container.style.backgroundColor = 'white';
            container.style.width = '30px';
            container.style.height = '30px';
            container.style.cursor = 'pointer';
            container.style.textAlign = 'center';
            container.style.lineHeight = '30px';
            container.style.borderRadius = '5px';
            container.innerHTML = '📍';

            // Stop click event propagation to prevent map click listener from firing
            L.DomEvent.on(container, 'mousedown click', L.DomEvent.stopPropagation);

            container.onclick = function(){
                if (isWatching) {
                    map.stopLocate();
                    isWatching = false;
                    statusMessage.textContent = 'Location tracking stopped.';
                    container.style.backgroundColor = 'white'; // Reset color
                    container.style.boxShadow = 'none'; // Reset shadow
                } else {
                    map.locate({setView: true, watch: true, maxZoom: 15});
                    isWatching = true;
                    statusMessage.textContent = 'Tracking your location...';
                    container.style.backgroundColor = '#d2e3f6'; // Highlight color
                    container.style.boxShadow = 'inset 0 0 5px rgba(0,0,0,0.2)'; // Add shadow
                }
            }

            return container;
        }
    });
    map.addControl(new locationControl());

    // --- Add a routing control button ---
    const routeControl = L.Control.extend({
        options: {
            position: 'topleft'
        },
        onAdd: function (map) {
            const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
            container.style.backgroundColor = '#3b82f6';
            container.style.color = 'white';
            container.style.width = '30px';
            container.style.height = '30px';
            container.style.cursor = 'pointer';
            container.style.textAlign = 'center';
            container.style.lineHeight = '30px';
            container.style.borderRadius = '5px';
            container.innerHTML = '➡️';
            container.style.marginTop = '5px';

            L.DomEvent.on(container, 'mousedown click', L.DomEvent.stopPropagation);

            container.onclick = function() {
                if (routingState === 'idle' || routingState === 'route-ready') {
                    // Clear previous route if it exists
                    if (routingControl) {
                        map.removeControl(routingControl);
                    }
                    waypoints = [];
                    routingState = 'selecting-start';
                    statusMessage.textContent = 'Click on the map to select your starting point.';
                    container.style.backgroundColor = '#2563eb'; // Darken button to show it's active
                }
            };
            return container;
        }
    });
    map.addControl(new routeControl());

    // Listen for map clicks
    map.on('click', async (e) => {
        const lat = e.latlng.lat;
        const lon = e.latlng.lng;
        
        // --- Handle routing waypoints ---
        if (routingState === 'selecting-start') {
            // Clear existing markers and route when starting a new route selection
            clearAllMarkers();
            waypoints.push(L.latLng(lat, lon));
            statusMessage.textContent = 'Start point selected. Now click to select the destination.';
            routingState = 'selecting-end';
        } else if (routingState === 'selecting-end') {
            waypoints.push(L.latLng(lat, lon));
            statusMessage.textContent = 'Destination selected. Calculating route...';
            routingState = 'route-ready';
            
            // Create the routing control and add it to the map
            routingControl = L.Routing.control({
                waypoints: waypoints,
                // Use a free OSRM service
                router: L.Routing.osrmv1({
                    serviceUrl: 'https://router.project-osrm.org/route/v1'
                }),
                routeWhileDragging: false,
                addWaypoints: true,
                lineOptions: {
                    styles: [{color: '#2563eb', weight: 6}]
                }
            }).addTo(map);
            
            // After the control is added, adjust its height
            adjustRoutingPanelHeight();

            // Listen for route calculation to complete
            routingControl.on('routesfound', (e) => {
                const routes = e.routes;
                const summary = routes[0].summary;
                const totalTime = Math.round(summary.totalTime / 60); // in minutes
                const totalDistance = (summary.totalDistance / 1000).toFixed(1); // in kilometers
                statusMessage.textContent = `Route found: ${totalDistance} km, taking approx. ${totalTime} min.`;
            });

            // Reset the styling of the routing button
            const routeControlDiv = document.querySelector('.leaflet-control-custom:nth-of-type(2)');
            if (routeControlDiv) {
                routeControlDiv.style.backgroundColor = '#3b82f6';
            }

        } else if (routingState === 'idle' || routingState === 'route-ready') {
            // --- SYNCHRONOUS MARKER CLEAR AND CREATION ---
            // Clear all existing markers and routes immediately
            clearAllMarkers();
            
            // Immediately create and show a temporary marker
            clickedMarker = L.marker([lat, lon]).addTo(map).bindPopup('Fetching location details...').openPopup();

            statusMessage.textContent = 'Fetching location details...';
            
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                
                if (data && data.display_name) {
                    const name = data.display_name;
                    const type = data.type;
                    const category = data.category;
                    let popupContent = `<b>${name}</b>`;
                    if (type || category) {
                        popupContent += `<br><i>Type: ${type || 'N/A'}, Category: ${category || 'N/A'}</i>`;
                    }

                    // Update the content of the existing marker
                    clickedMarker.bindPopup(popupContent).openPopup();
                    statusMessage.textContent = `Found details for clicked location.`;
                } else {
                    clickedMarker.bindPopup('No detailed information found for this location.').openPopup();
                    statusMessage.textContent = `No detailed information found for this location.`;
                }
            } catch (error) {
                console.error('Error in reverse geocoding:', error);
                clickedMarker.bindPopup('Error fetching details.').openPopup();
                statusMessage.textContent = 'Error fetching location details. Try again.';
            }
        }
    });

    // Listen for location updates
    map.on('locationfound', (e) => {
        userLat = e.latlng.lat;
        userLon = e.latlng.lng;
        
        // Update the marker position and move the map
        userMarker.setLatLng(e.latlng);
        map.setView(e.latlng, map.getZoom());
        statusMessage.textContent = `Location updated. You are at ${userLat.toFixed(2)}, ${userLon.toFixed(2)}`;
    });

    // Handle location error
    map.on('locationerror', (e) => {
        console.error('Location error:', e.message);
        statusMessage.textContent = 'Error: Could not track your location. ' + e.message;
        map.stopLocate();
        isWatching = false;
        // Reset button style on error
        const locationControlDiv = document.querySelector('.leaflet-control-custom');
        if(locationControlDiv) {
            locationControlDiv.style.backgroundColor = 'white';
            locationControlDiv.style.boxShadow = 'none';
        }
    });
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

    // Clear all existing markers and routes before performing a new search
    clearAllMarkers();

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
        const type = place.type;
        const category = place.category;

        let popupContent = `<b>${name}</b>`;
        if (type || category) {
            popupContent += `<br><i>Type: ${type || 'N/A'}, Category: ${category || 'N/A'}</i>`;
        }

        const marker = L.marker([lat, lon]).addTo(map).bindPopup(popupContent);
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

// Add a resize listener to dynamically adjust the panel height
window.addEventListener('resize', adjustRoutingPanelHeight);

// Initial call to get location when the page loads
document.addEventListener('DOMContentLoaded', getLocation);
