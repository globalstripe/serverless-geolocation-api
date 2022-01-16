rm response.json

geourl="https://fnha5j12t9.execute-api.eu-west-1.amazonaws.com/dev/location"
echo "API HealthCheck"
curl -w "@curl-format.txt" -o /dev/null -s "https://d3djph4x7pwvze.cloudfront.net/_healthcheck"
echo "GeoIP Lookup"
curl -w "@curl-format.txt" -o ./response.json -s "$geourl"
cat response.json | jq '.city.country.iso_code'
