const request = require('request');

const forecast = (latitude, longitude, callback) =>
{
	const url = 'http://api.weatherstack.com/current?access_key=3e5fc9002ca25bf9f1d7abbc0a232c64&query='
		+ encodeURIComponent(latitude) + ',' + encodeURIComponent(longitude);

	request({
		url: url,
		json: true
	}, (error, {body} = {}) =>
	{
		if (error)
		{
			callback('Unable to connect to weather service!');
			return;
		}
		else if (body.error)
		{
			callback(body.error.info);
			return;
		}

		callback(undefined, body.current);
	})
}

module.exports = forecast;

