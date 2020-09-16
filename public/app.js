const button = document.querySelector("button");
button.addEventListener("click", performAction);

const sideSection = document.querySelector('#side-section');
const mainSection = document.querySelector('#main-section');
const zipInput = document.querySelector("#zip");
const commentInput = document.querySelector("#feelings");
const errorDisplay = document.querySelector(".error");
const temperature = document.querySelector("#temp");

const baseUrl = "https://api.openweathermap.org/data/2.5/weather?zip=";
const key = "cdca76b7e2f72f763fde3636bc118699";
const errorMessage = "Sorry, city not found. Please enter correct Zip code and try again."
const country = "us";

//Grabbing current Date

let d = new Date();
let month = d.getMonth() + 1;
let newDate = month + "." + d.getDate() + "." + d.getFullYear();

function performAction(e) {
	e.preventDefault();
	const zip = zipInput.value;
	const content = commentInput.value;


	getWeatherData(baseUrl, zip, key)
		.then((data) => {
			if (data.cod === "404" || data.cod === "400") {
				showErrorMessage()
			} else {

				let sunrise = convertUnixToUtc(data.sys.sunrise)
				let sunset = convertUnixToUtc(data.sys.sunset)

				postData("/addWeatherData", {
					name: data.name,
					date: newDate,
					icon: data.weather[0].icon,
					temperature: data.main.temp,
					cloudLevel: data.weather[0].description,
					humidity: data.main.humidity,
					sunrise: sunrise,
					sunset: sunset,
					content: content,
				});
				updateUI()
			}
		});
}

// Converts unix numbers received from the api to UTC

function convertUnixToUtc(unix) {
	dateObj = new Date(unix * 1000);
	utcString = dateObj.toUTCString();
	time = utcString.slice(-11, -4);
	return time
}

// Fetches weather data using the openweathermap api
const getWeatherData = async(baseUrl, zip, key) => {
	let url = `${baseUrl}${zip},${country}&units=imperial&appid=${key}`;
	const response = await fetch(url);

	try {
		const data = await response.json();
		return data;
	} catch (error) {
		console.log(error);
	}
};

//Post Data to Server

const postData = async(url = "", data = {}) => {
	const response = await fetch(url, {
		method: "POST",
		credentials: "same-origin",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
	try {
		const newData = await response.json();
		console.log(`this is new Data: ${newData}`);
		return newData;
	} catch (error) {
		console.log(error);
	}
};

//update UI

const updateUI = async() => {
	const request = await fetch("/all");
	try {
		const allData = await request.json();

		const {
			name,
			date,
			icon,
			temperature,
			cloudLevel,
			humidity,
			sunrise,
			sunset,
			content
		} = allData[0];

		const iconSrc = `https://openweathermap.org/img/wn/${icon}@2x.png`

		sideSection.classList.remove("hide")
		mainSection.classList.remove("hide")

		document.querySelector("#name").innerHTML = name;
		document.querySelector("#date").innerHTML = date;
		document.querySelector("#main-icon").setAttribute('src', iconSrc)
		document.querySelector("#temp").innerHTML = temperature;
		document.querySelector("#cloud").innerHTML = cloudLevel;
		document.querySelector("#humidity").innerHTML = humidity;
		document.querySelector("#sunrise").innerHTML = sunrise;
		document.querySelector("#sunset").innerHTML = sunset;
		document.querySelector("#content").innerHTML = content;

		let weatherBoxContent = `<div class="weather-box">
						<p class="title">${name}, ${date}</p>
						<div class="side-header">
							<img
								class="side-img"
								src=${iconSrc}
							/>
							<p>
								<span id="side-temp">${temperature}F</span>
							</p>
						</div>
						<p class="side-info">
							Cloud Level: <span> ${cloudLevel}</span>,
						</p>
						<p class="side-info">
							Humidity: <span> ${humidity}%</span>
						</p>
					</div>`
		document.querySelector('.side-entry').innerHTML += weatherBoxContent;
		clearInput()
	} catch (error) {
		console.log("error", error);
	}
};


// Shows error message in case no data received from api for wrong or no zip code

function showErrorMessage() {
	errorDisplay.innerHTML = errorMessage;
	clearInput()
	setTimeout(() => {
		errorDisplay.innerHTML = ""
	}, 2000);
}

// clears input field after every submission of the form

function clearInput() {
	zipInput.value = ""
	commentInput.value = ""
}