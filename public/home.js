async function displayWeatherData(weather, aq) {
    const root = document.getElementById('root');
    const temp = document.createElement('div');
    const cloudCover = document.createElement('div');
    const humidity = document.createElement('div');
    const rainInt = document.createElement('div');
    const summary = document.createElement('div');
    const windGust = document.createElement('div');
    const windSpeed = document.createElement('div');
    const airQuality = document.createElement('div');

    summary.textContent = weather.summary;
    temp.textContent = `Temperature: ${weather.temperature.toFixed(1)} °C`  
    humidity.textContent = `Humidity: ${parseInt(weather.humidity * 100)}%`;
    cloudCover.textContent = `Cloud Cover: ${parseInt(weather.cloudCover * 100)}%`
    rainInt.textContent = "Rain Intensity: " + weather.precipIntensity.toFixed(1);
    windGust.textContent = "Wind (Gust): " + weather.windGust.toFixed(1);
    windSpeed.textContent = "Wind: " + weather.windSpeed.toFixed(1);

    if (aq) {
        airQuality.textContent = 'Particulate Concentration: ' + aq;
    } else {
        airQuality.textContent = "Particulate Concentration: not available";
    }

    root.append(summary);
    root.append(temp);
    root.append(humidity);
    root.append(cloudCover);
    root.append(rainInt);
    root.append(windSpeed);
    root.append(windGust);
    root.append(airQuality);

}

async function postData(weather, aq) {
    const data = { lat, long, weather, aq};
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    const response = await fetch('/api', options);
    const json = await response.json();
    document.getElementById('isLogged').textContent = 'Logged!';
}

async function getData() {
    console.log('Loading Location...');
    document.getElementById('root').textContent='';
    document.getElementById('isLogged').textContent = '';

    navigator.geolocation.getCurrentPosition(async position => {
        lat = position.coords.latitude;
        long = position.coords.longitude;

        document.getElementById('long').textContent = long.toFixed(4) + '°';
        document.getElementById('lat').textContent = lat.toFixed(4) + '°'; 
        const response = await fetch(`/weather/${lat},${long}`);
        const json = await response.json();
        const weather = json.weather;
        let aq = null;
        if (json.aq.results[0]) {
            aq = json.aq.results[0].measurements[0].value + " " + json.aq.results[0].measurements[0].unit;
        }
        displayWeatherData(weather, aq);

        document.getElementById('checkin').addEventListener('click', () => postData(weather, aq));
    });
}

document.getElementById('refresh').addEventListener('click', () => getData());

if ('geolocation' in navigator) {
    getData();
} else {
    console.log('Geolocation is not available.');
}


