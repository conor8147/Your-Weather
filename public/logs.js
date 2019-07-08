async function getData() {
    const response = await fetch('/api');
    const data = await response.json();
    return data;
}

async function displayData(mymap, layerGroup) {
    const data = await getData();

    for (item of data) {
        const weather = item.weather;
        const aq = item.aq;
        const coords = `Lat: ${item.lat.toFixed(2)}°, Lon: ${item.long.toFixed(2)}°` + '\n';
        const localDateString = new Date(item.timeStamp).toLocaleString();
        const date = "Date: " + localDateString + '\n';
        const summary = weather.summary + '\n';
        const temp = `Temperature: ${weather.temperature.toFixed(1)} °C`  + '\n'; 
        const humidity = `Humidity: ${parseInt(weather.humidity * 100)}%` + '\n';
        const cloudCover = `Cloud Cover: ${parseInt(weather.cloudCover * 100)}%` + '\n';
        const rainInt = "Rain Intensity: " + weather.precipIntensity.toFixed(1) + '\n';
        const windGust = "Wind (Gust): " + weather.windGust.toFixed(1) + '\n';
        const windSpeed = "Wind: " + weather.windSpeed.toFixed(1) + '\n';
        if (aq) {
            const airQuality = 'Particulate Concentration: ' + aq;
        } else {
            const airQuality = "Particulate Concentration: not available";
        }

        const marker = L.marker([item.lat, item.long]).addTo(layerGroup);
        const text = coords + date + summary + temp + humidity + cloudCover + rainInt + windGust + windSpeed;
        marker.bindPopup(text);


    }
}

const mymap = L.map('Map', {}).setView([0, 0], 1);
const attribution = 
'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap';

const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);
const layerGroup = L.layerGroup().addTo(mymap);

displayData(mymap, layerGroup);



document.getElementById('clear').addEventListener('click', async () => {
    const response = await fetch('/clear');
    const json = await response.json();
    layerGroup.clearLayers();
});
