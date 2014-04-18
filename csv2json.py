# coding: utf-8

import csv, json

f = open('data.csv')
header = f.readline().split(',')
reader = csv.DictReader(f, fieldnames=header)
json_dump = json.dumps(list(reader))
print json_dump
