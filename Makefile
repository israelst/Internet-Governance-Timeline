app/data:
	mkdir -p app/data

app/data/data.csv: app/data
	curl "https://docs.google.com/spreadsheet/ccc?key=0An3-9y7wLi-ldExhTzZqMjFiOHd4RTlMUnF1bWU4Y3c&output=csv" -Lsc  /tmp/cookie-file -H "Accept: text/csv; charset=utf-8" -o app/data/data.csv

app/data/data.json: app/data/data.csv
	python scripts/csv2json.py > app/data/data.json
