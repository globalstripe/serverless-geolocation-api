"use strict"

const bluebird = require("bluebird")
const maxmind = require("maxmind")
const openDb = bluebird.promisify(maxmind.open)

let cityLookup,
	countryLookup = null

module.exports.fetchLocationData = async event => {

	if (event.source === 'serverless-plugin-warmup') {
		console.log('WarmUP - Lambda is warm!')
		let fakecityLookup, fakecountryLookup = null
		let fakeip = '8.8.8.8.'
		let cityData, countryData
		fakecityLookup = await openDb("./GeoLite2-City.mmdb")
		fakecountryLookup = await openDb("./GeoLite2-Country.mmdb")

		try {
			cityData = await fakecityLookup.get(fakeip)
			console.log("WarmUp DB City Data OK: " + cityData )
			countryData = await fakecountryLookup.get(fakeip)
			console.log("WarmUp DB Country Data OK: " + countryData)
		} catch (e) {
			console.log("Maxmind DB Lookup failed!", e)
			const response = {
				statusCode: 500,
				body: JSON.stringify({
					success: false,
					error: e
				})
			}
			return Promise.resolve('Lambda is warm!')
		}
		
	}
	
	if (!cityLookup) {
		cityLookup = await openDb("./GeoLite2-City.mmdb")
	}
	if (!countryLookup) {
		countryLookup = await openDb("./GeoLite2-Country.mmdb")
	}

	let ip, cityData, countryData
	ip = event.requestContext.identity.sourceIp

	console.log("Source IP: " + ip)

	if (event.headers && event.headers['X-Forwarded-For']) {
		ip = event.headers['X-Forwarded-For'].split(',')[0]
	}

	try {
		cityData = await cityLookup.get(ip)
		console.log("DB City Data OK: " + cityData )
		countryData = await countryLookup.get(ip)
		console.log("DB Country Data OK: " + countryData)
	} catch (e) {
		console.log("Maxmind DB Lookup failed!", e)
		const response = {
			statusCode: 500,
			body: JSON.stringify({
				success: false,
				error: e
			})
		}
		return Promise.resolve(response)
	}

	const response = {
		statusCode: 200,
		body: JSON.stringify({
			success: true,
			ip: ip,
			city: cityData,
			country: countryData
		})
	}

	return Promise.resolve(response)
}
