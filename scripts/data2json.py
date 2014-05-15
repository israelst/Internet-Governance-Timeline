# coding: utf-8

from StringIO import StringIO

import requests

from csv2json import csv2json

url = 'https://docs.google.com/spreadsheet/ccc?key=0An3-9y7wLi-ldExhTzZqMjFiOHd4RTlMUnF1bWU4Y3c&output=csv'
response = requests.get(url)
csv = StringIO(response.text)
print csv2json(csv)

