data:
	mkdir -p data

data/data.csv: data
	wget "https://docs.google.com/spreadsheet/ccc?key=0An3-9y7wLi-ldExhTzZqMjFiOHd4RTlMUnF1bWU4Y3c&output=csv" -O data/data.csv

data/data.json: data/data.csv
	python scripts/csv2json.py > data/data.json
