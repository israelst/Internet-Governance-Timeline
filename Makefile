data.csv:
	wget "https://docs.google.com/spreadsheet/ccc?key=0An3-9y7wLi-ldExhTzZqMjFiOHd4RTlMUnF1bWU4Y3c&output=csv" -O data.csv

data.json: data.csv
	python csv2json.py > data.json
