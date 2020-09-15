// ready doc to not load when webpage is loaded
$(document).ready(function () {
    // declare city variable
    var cityArr = [];
    // function to take city names and put them into a list
    function renderPastCity() {
        cityArr = JSON.parse(localStorage.getItem("cities")) || [];
        $("#cityList").empty();
        for (var i = 0; i < cityArr.length; i++) {
            var cityLi = $("<li>").addClass("list-group-item p-3")
            cityLi.text(cityArr[i])
            $("#cityList").prepend(cityLi);
        }
    }
    $("#cityList").on("click", "li", function () {
        console.log($(this));
        var city = $(this).text();
        getWeather(city);
    })

    renderPastCity();

    $("#searchCity").on("click", function (event) {
        event.preventDefault();
        cityArr = JSON.parse(localStorage.getItem("cities")) || [];
        var city = $("#userCity").val();
        cityArr.push(city)
        localStorage.setItem("cities", JSON.stringify(cityArr));
        console.log(cityArr)
        renderPastCity();
        getWeather(city);
    });
    
    function getWeather(city) {

        var apiKey = "6ce841efb6b07e3f98309460d1f79c3c";
        // Get longitude and latitude
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey,
            method: "GET"
        }).then(function (weatherData) {
            var lat = weatherData.coord.lat;
            var lon = weatherData.coord.lon;

            // connect to api with declrared long and lat to pull date for city
            $.ajax({
                url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly&appid=" + apiKey,
                method: "GET"
            }).then(function (response) {

                var currentDate = response.current.dt;
                var todaysDate = "";
                var humidity = response.current.humidity;
                var windSpeed = response.current.wind_speed;
                var uvIndex = response.current.uvi;
                var icon = response.current.weather[0].icon;
                var temp = response.current.temp

                // IMG in main
                var iconLink = "http://openweathermap.org/img/wn/" + icon + ".png"
                var newImg = $("#icon")
                newImg.attr("src", iconLink)
                newImg.append(iconLink)

                // Covert date
                function convert() {

                    // Unixtimestamp https://makitweb.com/convert-unix-timestamp-to-date-time-with-javascript/
                    var unixtimestamp = currentDate
                    // Months array
                    var months_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    // Convert timestamp to milliseconds
                    var date = new Date(unixtimestamp * 1000);
                    // Year
                    var year = date.getFullYear();
                    // Month
                    var month = months_arr[date.getMonth()];
                    // Day
                    var day = date.getDate();
                    // Display date time in MM-dd-yyyy h:m:s format
                    todaysDate = "(" + month + '/' + day + '/' + year + ")";



                }
                convert();
                var tempF = ((temp - 273.15) * 1.80 + 32).toFixed(2);
                // display on screen
                $("#cityChoice").text(city)
                $("#date").text(todaysDate)
                $("#temperature").text("Current Temperature: " + tempF + "°F")
                $("#humidity").text("Humidity: " + humidity + "%")
                $("#windSpeed").text("Wind Speed: " + windSpeed + "MPH")
                $("#colorIndex").text(uvIndex)

                // fill cards with 5 day forcast
                $("#forecast").empty();
                for (var i = 1; i < 6; i++) {
                    var fiveDayDate = response.daily[i].dt;
                        // convert date
                    function convertFiveDayDate() {
                        // Unixtimestamp https://makitweb.com/convert-unix-timestamp-to-date-time-with-javascript/
                        var unixtimestamp = fiveDayDate
                        // Months array
                        var months_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        // Convert timestamp to milliseconds
                        var date = new Date(unixtimestamp * 1000);
                        // Year
                        var year = date.getFullYear();
                        // Month
                        var month = months_arr[date.getMonth()];
                        // Day
                        var day = date.getDate();
                        // Display date time in MM-dd-yyyy h:m:s format
                        var read5DayDate = "(" + month + '/' + day + '/' + year + ")";
                        console.log(read5DayDate);
                        return read5DayDate;
                    }
                        // variables to get data from api for 5 day forcast
                    var read5DayDate = convertFiveDayDate();
                    var fiveDayIcon = response.daily[i].weather[0].icon;
                    var fiveDayTemp = response.daily[i].temp.day;
                    var fiveDayTempF = ((fiveDayTemp - 273.15) * 1.80 + 32).toFixed(2);
                    var fiveDayHumidity = response.daily[i].humidity;

                    // display data dynamically for 5 day
                    var card = $("<div>").addClass("col card text-white bg-dark m-3");
                    // fill it with data[i]
                    var data = $("<h5>").text(read5DayDate);
                    card.append(data)
                    var data = $("<img>");
                    var fiveiconLink = "http://openweathermap.org/img/wn/" + fiveDayIcon + ".png"
                    data.attr("src", fiveiconLink)
                    card.append(data)
                    var data = $("<p>").text("Temp: " + fiveDayTempF + "°F");
                    card.append(data)
                    var data = $("<p>").text("Humidity: " + fiveDayHumidity + "%");
                    card.append(data)

                    // append that card to #5day

                    $("#forecast").append(card)

                }

                // function to change UV Index backround color
                function colorChange() {
                    $("#colorIndex").each(function () {
                        if (uvIndex < 4) {
                            $("#colorIndex").addClass("green");
                            $("#colorIndex").removeClass("red");
                            $("#colorIndex").removeClass("yellow");
                        } else if (uvIndex > 4 && uvIndex < 9) {
                            $("#colorIndex").addClass("yellow");
                            $("#colorIndex").removeClass("red");
                            $("#colorIndex").removeClass("green");

                        } else {
                            $("#colorIndex").addClass("red")
                            $("#colorIndex").removeClass("yellow");
                            $("#colorIndex").removeClass("green");
                        }
                    });
                }
                colorChange();
            });
        });
    };
});

