import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import "./SearchBox.css";
import { useState } from 'react';

export default function SearchBox(updateInfo) {
    const [city, setCity] = useState("");
    const API_KEY = "6ef0f2f0d4705214fee64f6cf6db368a";
    const GEO_API_URL = "http://api.openweathermap.org/geo/1.0/direct";
    const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";
    const limit = 1;

    const getWeatherInfo = async () => {
        try {
            const geoResponse = await fetch(`${GEO_API_URL}?q=${city}&limit=${limit}&appid=${API_KEY}`);
            const geoData = await geoResponse.json();

            if (geoData.length > 0) {
                const { lat, lon } = geoData[0];

                const weatherResponse = await fetch(`${WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
                const weatherData = await weatherResponse.json();

                return {
                    city,
                    temp: weatherData.main.temp,
                    tempMin: weatherData.main.temp_min,
                    tempMax: weatherData.main.temp_max,
                    humidity: weatherData.main.humidity,
                    feelsLike: weatherData.main.feels_like,
                    weather: weatherData.weather[0].description,
                };
            } else {
                console.log("City not found");
                return null;
            }
        } catch (error) {
            console.error("Error fetching weather data:", error);
            return null;
        }
    };

    const handleChange = (evt) => {
        setCity(evt.target.value);
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        const newInfo = await getWeatherInfo();
        if (newInfo) {
            updateInfo(newInfo);
        }
        setCity("");
    };

    return (
        <div className='SearchBox'>
            <form onSubmit={handleSubmit}>
                <TextField id="city" label="City Name" variant="outlined" required value={city} onChange={handleChange} />
                <br /><br />
                <Button variant="contained" type='submit'>Search</Button>
            </form>
        </div>
    );
}