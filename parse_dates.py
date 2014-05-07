import unittest
import re
from datetime import datetime


def parse_date(dates, year):
    results = re.search(r'([^\d]+)(\d+)[^\d]+(\d+)', dates)
    month, from_day, to_day = results.groups()
    from_date = datetime.strptime(str(year) + month + from_day, '%Y%b%d')
    to_date = datetime.strptime(str(year) + month + to_day, '%Y%b%d')
    return (from_date, to_date)

class Test(unittest.TestCase):
    def test_one_month_with_two_days_with_one_digit(self):
        dateRange = (datetime(2013, 10, 7), datetime(2013, 10, 8))
        self.assertEqual(parse_date('Oct 7-8', 2013), dateRange)

if __name__ == '__main__':
    unittest.main()
