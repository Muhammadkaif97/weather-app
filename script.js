const searchForm = document.querySelector('#weather-form');
const cityInput = document.querySelector('#city-input');
const weatherDisplay = document.querySelector('#weather-display');

const apiKey = 'e86940934946a1683e9a8aa70bf46b5e';

searchForm.addEventListener('submit', function(event) {
    event.preventDefault(); 
    const cityName = cityInput.value.trim();
    
    if (cityName) {
        fetchWeather(cityName);
    } else {
        displayError("Please enter a city name.");
    }
    cityInput.value = '';
});

async function fetchWeather(city) {
    weatherDisplay.innerHTML = `<p class="loading-text">Loading...</p>`;
    
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Invalid API key. Please check your key or wait for activation.');
            }
            if (response.status === 404) {
                throw new Error('City not found. Please check your spelling.');
            }
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        displayWeather(data);

    } catch (error) {
        displayError(error.message);
    }
}

function displayWeather(data) {
    const { name, main, weather, wind } = data;
    const temp = Math.round(main.temp);
    const feelsLike = Math.round(main.feels_like);
    const description = weather[0].description;
    const icon = weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    const humidity = main.humidity;
    const windSpeed = wind.speed;

    const weatherHTML = `
        <h2 class="city-name">${name}</h2>
        <div class="weather-main">
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <div class="weather-temp">${temp}°C</div>
        </div>
        <p class="weather-description">${description}</p>
        
        <div class="weather-details">
            <div class="detail-item">
                <p>Feels Like</p>
                <p class="detail-value">${feelsLike}°C</p>
            </div>
            <div class="detail-item">
                <p>Humidity</p>
                <p class="detail-value">${humidity}%</p>
            </div>
            <div class="detail-item">
                <p>Wind</p>
                <p class="detail-value">${windSpeed} m/s</p>
            </div>
        </div>
    `;
    
    weatherDisplay.innerHTML = weatherHTML;
}

function displayError(message) {
    const errorHTML = `<p class="error-message">${message}</p>`;
    weatherDisplay.innerHTML = errorHTML;
}