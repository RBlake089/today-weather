// const api = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
const apiKey = "e11409c88cf6b057902a5c509e8da525";

const userInput = document.querySelector("#user-input");
const searchBtn = document.querySelector("#search-btn");
const historyEL = document.querySelector("#history");
const todayWeatherEL = document.querySelector("#today-weather");
const fiveDayForecastEL = document.querySelector("#five-day-forecast");

function search(cityName){
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`
    ).then(function(response){
        return response.json()
    }).then(function(data){
        console.log(data)
        const iconNum = data.weather[0].icon;
        const iconURL = `https://api.openweathermap.org/img/w/${iconNum}.png`
        let todaysWeather = `
        <div id = "today-weather" >
            
            <main>
                <h2>${data.name}</h2>
                <img src = "${iconURL}">
                <p>${data.weather[0].description}
                
                <p> Temp: ${data.main.temp}</p>
                <p> Humidity: ${data.main.humidity}</p>
                <p> Wind Speed: ${data.wind.speed}</p>


            </main>
        </div>
        
        
        `;
        todayWeatherEL.innerHTML = todaysWeather
        const lat = data.coord.lat;
        const lon = data.coord.lon;

        fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
        ).then(function(response){
            return response.json()

        }).then(function(weatherData){
            let fiveDayForecast = "";
            let fiveDayData = weatherData.list;
            for(let i = 0; i < 5; i++){
                console.log(fiveDayData[i])
                let fiveDayNum = fiveDayData[i].weather[0].icon;
                let fiveDayUrl = `https://api.openweathermap.org/img/w/${fiveDayNum}.png`
                fiveDayForecast += `
                
                <div id = "five-day-forecast">
                    <main>
                        <img src = "${fiveDayUrl}">
                        <p>${fiveDayData[i].weather[0].description}
                        <p> Temp: ${fiveDayData[i].main.temp}</p>
                        <p> Humidity: ${fiveDayData[i].main.humidity}</p>
                        <p> Wind Speed: ${fiveDayData[i].wind.speed}</p>
    
    
                    </main>
                </div>
            
                `;
                fiveDayForecastEL.innerHTML = fiveDayForecast;
            }
        })

    })
}

searchBtn.addEventListener("click", function(event){
    event.preventDefault()
    let cityName =userInput.value.trim()
    makeHistory();
    search(cityName)
    userInput.value="";
})

function makeHistory(){
    let historyVal = userInput.value.trim();
    let storage = JSON.parse(localStorage.getItem("storage")) || []
    storage.push(historyVal)
    createHistoryList(storage);
}

function createHistoryList(storage){
    storage.forEach(function(city){
        const historyBtn = document.createElement("li")
        historyBtn.textContent = city;
        historyBtn.className += "past-city";
        historyEL.appendChild(historyBtn)
        historyBtn.addEventListener('click', function(event){
            event.preventDefault()
            let pastCity = historyBtn.textContent
            search(pastCity)
        })
    })
}