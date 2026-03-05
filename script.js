const apiKey = CONFIG.API_KEY; // Using key from env.js
const apiBaseUrl = 'https://api.openweathermap.org/data/2.5/weather';

const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherDisplay = document.getElementById('weather-display');
const errorMessage = document.getElementById('error-message');
const loadingIndicator = document.getElementById('loading');
const body = document.body;

// Elements to update
const cityNameEl = document.getElementById('city-name');
const dateEl = document.getElementById('date');
const tempEl = document.getElementById('temperature');
const descEl = document.getElementById('description');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');
const feelsLikeEl = document.getElementById('feels-like');
const weatherIconEl = document.getElementById('weather-icon');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        fetchWeather(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value;
        if (city) {
            fetchWeather(city);
        }
    }
});

async function fetchWeather(city) {
    if (apiKey === 'YOUR_API_KEY_HERE') {
        alert('Please replace "YOUR_API_KEY_HERE" in script.js with your actual OpenWeather API key.');
        return;
    }

    try {
        showLoading();
        hideError();
        weatherDisplay.classList.add('hidden');

        const response = await fetch(`${apiBaseUrl}?q=${city}&units=metric&appid=${apiKey}`);

        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        updateUI(data);
        hideLoading();
        weatherDisplay.classList.remove('hidden');
    } catch (error) {
        hideLoading();
        showError();
        console.error(error);
    }
}

function updateUI(data) {
    cityNameEl.textContent = `${data.name}, ${data.sys.country}`;

    const now = new Date();
    dateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    tempEl.textContent = Math.round(data.main.temp);
    descEl.textContent = data.weather[0].description;
    humidityEl.textContent = `${data.main.humidity}%`;
    windSpeedEl.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`; // Convert m/s to km/h
    feelsLikeEl.textContent = `${Math.round(data.main.feels_like)}°C`;

    const iconCode = data.weather[0].icon;
    weatherIconEl.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    weatherIconEl.alt = data.weather[0].description;
    weatherIconEl.classList.remove('hidden');

    updateBackground(data.weather[0].main);
}

function updateBackground(weatherMain) {
    body.className = ''; // Reset classes

    switch (weatherMain.toLowerCase()) {
        case 'clear':
            body.classList.add('sunny');
            break;
        case 'clouds':
            body.classList.add('cloudy');
            break;
        case 'rain':
        case 'drizzle':
        case 'thunderstorm':
            body.classList.add('rainy');
            break;
        default:
            body.classList.add('cloudy'); // Default fallback
            break;
    }
}

function showLoading() {
    loadingIndicator.classList.remove('hidden');
}

function hideLoading() {
    loadingIndicator.classList.add('hidden');
}

function showError() {
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}
