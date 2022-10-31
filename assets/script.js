var searchInput = document.querySelector('#city-input');
var searchBtn = document.querySelector('#search-btn');

var cityWeatherDiv = document.querySelector('#cityweather');
var cityForecastDiv = document.querySelector('#forecast');
var previousSearches = document.querySelector('#previouscities');

var index = document.querySelector('#uvI');

var cityList = [];

var apiKey = 'b1af4a50fe995581f017fac3e4432205';

function cityWeather(searchInput) {
    var weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + searchInput + '&appid=' + apiKey + '&units=metric';
    console.log(weatherUrl);

    fetch(weatherUrl)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            console.log(data.main.temp);
            console.log(data.main.humidity);
            console.log(data.wind.speed);
            console.log(data.coord.lon);
            console.log(data.coord.lat);

            fivedayForecast(data.coord.lon, data.coord.lat);

            var weatherIcon = "http://openweathermap.org/img/wn/"+ data.weather[0].icon + "@2x.png";

            var weatherHtml = `
                    <div>
                        <h2>${data.name} ${dayjs.unix(data.dt).format('D/M/YYYY')}</h2>
                        <img src='${weatherIcon}'>
                    </div>

                    <p>Temperature: ${data.main.temp}°C</p>
                    <p>Humidity: ${data.main.humidity}%</p>
                    <p>Wind Speed: ${data.wind.speed} mph</p>
            `;

            cityWeatherDiv.innerHTML = weatherHtml;
            uvIndex(data.coord.lon, data.coord.lat);

        })
}

function uvIndex(lon, lat){

    var secondWeatherUrl = "https://api.openweathermap.org/data/2.5/uvi?lat="+ lat + "&lon=" + lon + "&appid=" + apiKey;
    console.log(secondWeatherUrl);

    fetch(secondWeatherUrl)
        .then((response) => response.json())
        .then((data2) => { 
            console.log(data2);
            console.log(data2.value);

            var uvRate = data2.value;

            var uvHtml = `
                <p>UV Index:
                    <button class="btn uvIndexRate">${uvRate}</button>
                </p>
            `;

            index.innerHTML = uvHtml;

            if(uvRate > 8){
                console.log('over 8');
                document.querySelector('.uvIndexRate').id = 'over';
            } else if (uvRate > 4 && uvRate < 8){
                console.log('between 4 n 8');
                document.querySelector('.uvIndexRate').id = 'between';
            }else {
                console.log('else');
                document.querySelector('.uvIndexRate').id = 'else';
            }
            
    })
}

function fivedayForecast(lon, lat) {

    var thirdWeatherUrl = "https://api.openweathermap.org/data/2.5/forecast?lat="+ lat + "&lon=" + lon + "&appid=" + apiKey + '&units=metric';
    console.log(thirdWeatherUrl);

    fetch(thirdWeatherUrl)
        .then((response) => response.json())
        .then((data3) => { 
            console.log(data3);
            
            displayCard(data3.list);
        })

}

function createCard(data){

    var iconUrl = 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png';

    var display = `
                <div class='card col cardDivs'>
                    <h5 id='weatherDate'>${dayjs.unix(data.dt).format('D/M/YYYY')}<img id='weatherIcon' src='${iconUrl}'/></h5>
                    <p id='weatherTemp'>Temperature: ${data.main.temp}°C</p>
                    <p id='weatherHum'>Humidity: ${data.main.humidity}%</p>
                    <p id='weatherWind'>Wind Speed: ${data.wind.speed} mph</p>
                </div>
            `;

    return display;
}

function displayCard(weatherData){

    var forecast = '';

    for (var i = 6; i < weatherData.length; i+=8) {

        forecast += createCard(weatherData[i]);

    }

    cityForecastDiv.innerHTML = forecast;
}



searchBtn.addEventListener('click', function(){

    var cityName = searchInput.value;

    // if (!cityList.includes(cityName)) {
    //     cityList.push(cityName);

    //     var searchedCity = `
    //         <li class="btn">${cityName}</li>
    //     `;

    //     previousSearches.innerHTML = searchedCity;
    // }

    // localStorage.setItem("city", JSON.stringify(cityList));
    // console.log(cityList);

    cityWeather(cityName);
})

// To do:
// 1. 5 Day Forecast using the Open Weather API
// 2. Display the current date on the main weather info & the upcoming dates on the 5 day forecast
// 3. Create a function that stores the city inputs into localstorage then displays them as buttons
// 4. Update the CSS and make the webpage more resposive & good looking