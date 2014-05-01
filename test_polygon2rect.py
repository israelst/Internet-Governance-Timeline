import unittest

from polygon2rect import rect_points, extract_points

class TestPolygonToRect(unittest.TestCase):
    def test_real_points(self):
        x = 546.378
        y = 108.622
        width = 108.378
        height = 43.949
        polygon_points = "546.378,108.622 546.378,152.571 654.756,152.571 654.756,108.622 546.378,108.622 	"
        self.assertEqual(rect_points(polygon_points), (x, y, width, height))

class TestExtractPoints(unittest.TestCase):
    def test_with_no_spaces_in_attr_name(self):
        points = '18,1156.852 38.315,1156.852 38.315,610.764 18,610.764 18,1156.852 	'
        line = '<polygon fill="#B5454D" points="{}"/>'.format(points)
        self.assertEqual(extract_points(line), points)

    def test_with_spaces_between_attr_and_value(self):
        points = '18,1156.852 38.315,1156.852 38.315,610.764 18,610.764 18,1156.852 	'
        line = '<polygon fill="#B5454D" points= "{}"/>'.format(points)
        self.assertEqual(extract_points(line), points)

    def test_with_single_quote(self):
        points = '18,1156.852 38.315,1156.852 38.315,610.764 18,610.764 18,1156.852 	'
        line = '<polygon fill="#B5454D" points=\'{}\'/>'.format(points)
        self.assertEqual(extract_points(line), points)

if __name__ == '__main__':
    unittest.main()
