const fetch = require('node-fetch');
const express = require('express');
const Datastore = require('nedb');
const app = express();
require('dotenv').config();

app.listen(3001, () => console.log('Listening at port 3001'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore("database.db");
database.loadDatabase();

app.get('/api', (request, response) => {
    database.find({}, (err, data) => {
        if (err) console.error(err)
        else {
            response.json(data);
        }
    });

});

app.post('/api', (request, response) => {
    console.log('I got a request')
    const data = request.body;
    const timeStamp = Date.now();
    data.timeStamp = timeStamp;

    database.insert(data);
    response.json({
        status: 'Success',
        timestamp: data.timeStamp,
        latitude: data.lat,
        longitude: data.long
    });
});

app.get('/clear', (request, response) => {
    database.remove({}, { multi: true }, (err, numRemoved) => {});
    response.json({status: 'Success'});
});


app.get('/weather/:latlong', async (request, response) => {
    const latlong = request.params.latlong.split(',');
    const lat = latlong[0];
    const long = latlong[1];
    const api_key = process.env.API_KEY;
    const weather_url = `https://api.darksky.net/forecast/${api_key}/${lat},${long}/?units=si`;
    const weather_response = await fetch(weather_url);
    let weather_data = await weather_response.json();
    weather_data = weather_data.currently

    const aq_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${long}`;
    const aq_response = await fetch(aq_url);
    const aq_data = await aq_response.json();
    console.log(aq_data);

    const data = { weather: weather_data, aq: aq_data };
    response.json(data);
});

