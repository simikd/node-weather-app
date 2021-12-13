const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const errorMessage = document.querySelector('#error');
const locationMessage = document.querySelector('#location');
const forecastMessage = document.querySelector('#forecast');

weatherForm.addEventListener('submit', (e) => {
	e.preventDefault();

	forecastMessage.textContent = 'Loading...';

	fetch('http://localhost:3000/weather?address=' + encodeURIComponent(search.value)).then((response) =>
	{
		response.json().then((data) =>
		{
			if (data.error)
			{
				errorMessage.textContent = data.error;
			}

			locationMessage.textContent = data.location;
			forecastMessage.textContent = data.forecast;
		});
	});
});