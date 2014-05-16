# coding: utf-8
import json

from parse_dates import parse


if __name__ == '__main__':
    events = json.load(open('data/data.json'))
    for event in events:
        try:
            event['date'] = map(lambda date: date.isoformat(), parse(event['date'], int(event['year'])))
        except:
            pass
    print json.dumps(events)
