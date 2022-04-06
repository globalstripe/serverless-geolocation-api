"use strict"

const bluebird = require("bluebird")
const maxmind = require("maxmind")
const openDb = bluebird.promisify(maxmind.open)

let countryLookup = null

module.exports.fetchLocationData = async event => {

	if (event.source === 'serverless-plugin-warmup') {
		console.log('WarmUP - Lambda is warm!')
		let fakecountryLookup = null
		let fakeip = '8.8.8.8'
		let countryData 
		fakecountryLookup = await openDb("./GeoLite2-Country.mmdb")

		try {
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
	
	if (!countryLookup) {
		countryLookup = await openDb("./GeoLite2-Country.mmdb")
	}

	let ip, countryData
	ip = event.requestContext.identity.sourceIp

	console.log("Source IP: " + ip)

	if (event.headers && event.headers['X-Forwarded-For']) {
		ip = event.headers['X-Forwarded-For'].split(',')[0]
	}

	try {
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
		headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,GET",
			"Content-Type": "application/json"
        },
		body: JSON.stringify({
			success: true,
			ip: ip,
			country: countryData
		})
	}

	return Promise.resolve(response)
}
