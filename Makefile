lib:
	mkdir -p app/js/lib

d3: lib
	curl -L "http://d3js.org/d3.v3.min.js" -o app/js/lib/d3.v3.min.js

app/data:
	mkdir -p app/data

app/data/data.csv: app/data
	curl -L "https://docs.google.com/spreadsheet/ccc?key=0An3-9y7wLi-ldExhTzZqMjFiOHd4RTlMUnF1bWU4Y3c&output=csv" -o app/data/data.csv

app/data/data.json: app/data/data.csv
	python scripts/csv2json.py > app/data/data.json
