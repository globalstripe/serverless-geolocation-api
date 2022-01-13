# Serverless Geolocation API

<a href="https://market.mashape.com/arjunkomath/geo-location"><img src="https://d1g84eaw0qjo7s.cloudfront.net/images/badges/badge-icon-light-9e8eba63.png" width="143" height="38" alt="Mashape"></a>

## Creating new project

With Serverless Framework v1.5 and later, a new project based on the project template is initialized with the command

```
> sls install -u https://github.com/globalstripe/serverless-geolocation-api -n myservicename
> cd myservicename
> npm install
```

You will also need to download the MaxMind mmdb files and place them in the root of the serverless project

GeoLite2-City.mmdb
GeoLite2-Country.mmdb

These are bundled up into the lambda function during deployment.

You need to register for a free account to access the downloads now.
Download the tar.gz files and unpack them.

Cloned from here https://github.com/arjunkomath/serverless-geolocation-api

Updated to nodejs14.x and also serverless-plugin-warmup

Added the following  event schedule to serverless.yml too

custom:
  warmup:
    officeHoursWarmer:
      enabled: true
      events:
        - schedule: cron(0/5 8-17 ? * MON-FRI *)
      concurrency: 10
    outOfOfficeHoursWarmer:
      enabled: true
      events:
        - schedule: cron(0/5 0-7 ? * MON-FRI *)
        - schedule: cron(0/5 18-23 ? * MON-FRI *)
        - schedule: cron(0/5 * ? * SAT-SUN *)
      concurrency: 1
    testWarmer:
      enabled: false

You will find this deployed in EventBridge Rules

https://console.aws.amazon.com/events/home?region=us-east-1#/rules

## Read more about this project:
[https://medium.com/techulus/build-a-geolocation-api-using-aws-lambda-and-maxmind-25dc3cacc324](https://medium.com/techulus/build-a-geolocation-api-using-aws-lambda-and-maxmind-25dc3cacc324).

## License

Copyright (c) 2018 Arjun Komath, licensed for users and contributors under MIT license.
https://github.com/arjunkomath/serverless-geolocation-api/blob/master/LICENSE
# serverless-geolocation-api
