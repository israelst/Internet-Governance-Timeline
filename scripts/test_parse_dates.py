from datetime import date
import unittest

from parse_dates import parse


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

class TestExceptions(unittest.TestCase):
    def test_well_formed(self):
        self.assertRaises(ValueError, parse, *('tbc', 2013))

if __name__ == '__main__':
    unittest.main()
