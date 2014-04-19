# coding: utf-8

import csv, json

def csv2json(fd):
    header = fd.readline().split(',')
    reader = csv.DictReader(fd, fieldnames=header)
    json_dump = json.dumps(list(reader))
    return json_dump

if __name__ == '__main__':
    print csv2json(open('data.csv'))
