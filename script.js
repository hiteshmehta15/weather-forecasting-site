function getWeather() {
    const city = document.getElementById('city-input').value;
    const weatherInfo = document.getElementById('weather-info');

    if (city === '') {
        weatherInfo.innerHTML = '<p>Please enter a city name.</p>';
        return;
    }

    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                const { latitude, longitude, name } = data.results[0];
                return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode&daily=temperature_2m_max,temperature_2m_min&current_weather=true`);
            } else {
                throw new Error('City not found');
            }
        })
        .then(response => response.json())
        .then(data => {
            const currentWeather = data.current_weather;
            const daily = data.daily;

            const weatherHTML = `
                <div class="weather-detail">
                    <h2>Current Weather in ${city}</h2>
                    <p>Temperature: ${currentWeather.temperature}°C</p>
                    <p>Weather Code: ${currentWeather.weathercode}</p>
                </div>
                <div class="weather-detail">
                    <h2>Daily Forecast</h2>
                    <p>Max Temperature: ${daily.temperature_2m_max[0]}°C</p>
                    <p>Min Temperature: ${daily.temperature_2m_min[0]}°C</p>
                </div>
            `;

            weatherInfo.innerHTML = weatherHTML;
        })
        .catch(error => {
            weatherInfo.innerHTML = `<p>${error.message}</p>`;
        });
}
