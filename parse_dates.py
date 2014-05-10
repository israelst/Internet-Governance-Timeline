import unittest
import re
from datetime import date, datetime

def parse_date(dates, year):
    results = re.search(r'([^\d]+)(\d+)-([^\d]+)(\d+)', dates)
    if results is None:
        results = re.search(r'([^\d]+)(\d+)[^\d]+(\d+)', dates)
    results = filter(lambda x: x != ' ', results.groups())
    from_month = datetime.strptime(results[0].strip(), '%b').month
    from_day = int(results[1])
    try:
        to_day = int(results[2])
        to_month = from_month
    except:
        to_day = int(results[3])
        to_month = datetime.strptime(results[2].strip(), '%b').month

    from_date = date(year, from_month, from_day)
    to_date = date(year, to_month, to_day)
    return (from_date, to_date)

class Test(unittest.TestCase):
    def test_one_month_with_two_days_with_one_digit(self):
        dateRange = (date(2013, 10, 7), date(2013, 10, 8))
        self.assertEqual(parse_date('Oct 7-8', 2013), dateRange)

    def test_one_month_with_two_days_with_two_digits(self):
        dateRange = (date(2013, 2, 17), date(2013, 2, 19))
        self.assertEqual(parse_date('Feb 17-19', 2013), dateRange)

    def test_one_month_with_spaces_between_values(self):
        dateRange = (date(2013, 12, 16), date(2013, 12, 18))
        self.assertEqual(parse_date('Dec 16 -18', 2013), dateRange)
        self.assertEqual(parse_date('Dec 16- 18', 2013), dateRange)
        self.assertEqual(parse_date('Dec  16 - 18 ', 2013), dateRange)

    def test_dates_across_two_months(self):
        dateRange = (date(2013, 4, 3), date(2013, 5, 2))
        self.assertEqual(parse_date('Apr 3-May 2', 2013), dateRange)

if __name__ == '__main__':
    unittest.main()
