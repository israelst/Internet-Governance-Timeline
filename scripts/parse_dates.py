# coding: utf-8
import re
from datetime import date, datetime


def tokenize(dates):
    number = '0123456789'
    d = ''
    for i, char in enumerate(dates):
        if i > 0 and char in number and dates[i-1] not in number:
            d += ' '
        d += char

    return filter(None, re.split(r'[\s-]', d))

def month_number(month_word):
    return datetime.strptime(month_word, '%b').month

def parse(dates, year):
    tokens = tokenize(dates)
    from_month = month_number(tokens[0])
    from_day = int(tokens[1])
    try:
        to_month = from_month
        to_day = int(tokens[2])
    except:
        to_month = month_number(tokens[2])
        to_day = int(tokens[3])

    from_date = date(year, from_month, from_day)
    to_date = date(year, to_month, to_day)
    return (from_date, to_date)


if __name__ == '__main__':
    import json
    events = json.load(open('data/data.json'))
    for event in events:
        try:
            dates = parse(event['date'], int(event['year']))
            event['date'] = map(lambda date: date.isoformat(), dates)
        except:
            pass
    print json.dumps(events)

