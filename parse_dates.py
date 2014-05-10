import unittest
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


class TestOneMonth(unittest.TestCase):
    def test_with_two_days_with_one_digit(self):
        dateRange = (date(2013, 10, 7), date(2013, 10, 8))
        self.assertEqual(parse('Oct 7-8', 2013), dateRange)

    def test_with_two_days_with_two_digits(self):
        dateRange = (date(2013, 2, 17), date(2013, 2, 19))
        self.assertEqual(parse('Feb 17-19', 2013), dateRange)

    def test_with_spaces_between_values(self):
        dateRange = (date(2013, 12, 16), date(2013, 12, 18))
        self.assertEqual(parse('Dec 16 -18', 2013), dateRange)
        self.assertEqual(parse('Dec 16- 18', 2013), dateRange)
        self.assertEqual(parse('Dec  16 - 18 ', 2013), dateRange)

class TestAcrossMonths(unittest.TestCase):
    def test_well_formed(self):
        dateRange = (date(2013, 4, 3), date(2013, 5, 2))
        self.assertEqual(parse('Apr 3-May 2', 2013), dateRange)

    def test_without_spaces_between_month_and_day(self):
        dateRange = (date(2013, 10, 19), date(2013, 11, 15))
        self.assertEqual(parse('Oct 19-Nov15', 2013), dateRange)

if __name__ == '__main__':
    unittest.main()
