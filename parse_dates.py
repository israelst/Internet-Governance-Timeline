import unittest
import re
from datetime import date, datetime

def parse_date(dates, year):
    results = re.search(r'([^\d]+)(\d+)[^\d]+(\d+)', dates)
    month, from_day, to_day = results.groups()
    month = datetime.strptime(month.strip(), '%b').month
    from_date = date(year, month, int(from_day))
    to_date = date(year, month, int(to_day))
    return (from_date, to_date)

class Test(unittest.TestCase):
    def test_one_month_with_two_days_with_one_digit(self):
        dateRange = (date(2013, 10, 7), date(2013, 10, 8))
        self.assertEqual(parse_date('Oct 7-8', 2013), dateRange)

    def test_one_month_with_two_days_with_two_digits(self):
        dateRange = (date(2013, 2, 17), date(2013, 2, 19))
        self.assertEqual(parse_date('Feb 17-19', 2013), dateRange)

if __name__ == '__main__':
    unittest.main()
