const path = require('path');
const express = require('express');
const hbs = require('hbs');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000;

// define paths for Express config
const publicDirPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// setup static directory to serve
app.use(express.static(publicDirPath));

app.get('', (req, res) =>
{
	res.render('index', {
		'title': 'Weather app',
		'name': 'Simon'
	});
});

app.get('/about', (req, res) =>
{
	res.render('about', {
		'title': 'About me',
		'name': 'Simon'
	})
})

app.get('/help', (req, res) =>
{
	res.render('help', {
		'title': 'Do you need help?',
		'message': 'Fuck off!',
		'name': 'Simon'
	})
})

app.get('/weather', (req, res) =>
{
	const address = req.query.address;
	if (!address)
	{
		return res.send({
			error: 'You must provide address!'
		});
	}

	geocode(address, (error, {latitude, longitude, location} = {}) =>
	{
		if (error)
		{
			return res.send({
				error: error
			});
		}

		forecast(latitude, longitude, (error, forecast_data) =>
		{
			if (error)
			{
				return res.send({
					error: error
				});
			}

			const temp = forecast_data.temperature;
			const degreePlural = Math.abs(temp) === 1 ? '' : 's';
			const day_night = forecast_data.is_day === 'no' ? 'night' : 'day';
			const descriptions = forecast_data.weather_descriptions.join(', ');

			let forecast = 'It is currently ' + descriptions.toLowerCase() + ' ' + day_night + '.'
			forecast += ' Temperature is ' + temp + ' degree' + degreePlural + ' out.'
			forecast += ' There is a ' + forecast_data.precip + '% chance of rain.'

			return res.send({
				forecast: forecast,
				location: location,
				address: req.query.address
			});
		})
	})
});

app.get('/products', (req, res) =>
{
	if (!req.query.search)
	{
		return res.send({
			error: 'You must provide a search term!'
		});
	}

	res.send({products: []});
})

app.get('/help/*', (req, res) =>
{
	res.render('404', {
		'title': 'This is 404 page. You just got lost.',
		'message': 'There are no help articles sucker.',
		'name': 'Simon'
	})
});

app.get('*', (req, res) =>
{
	res.render('404', {
		'title': 'This is 404 page. You just got lost.',
		'message': 'Sucks, doesn\'t it?',
		'name': 'Simon'
	})
});

app.listen(port, () =>
{
	console.log('Server is up on port ' + port);
});

