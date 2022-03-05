echo "GeoIP Lookup"
curl -w "@curl-format.txt" -o ./response.json -s "$geourl"
geourl="https://zw2bdu77c4.execute-api.eu-west-1.amazonaws.com/dev/location"
curl "$geourl" | jq
