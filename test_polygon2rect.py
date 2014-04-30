import unittest

from polygon2rect import rect_points

class TestPolygonToRect(unittest.TestCase):
    def test_real_points(self):
        x = 546.378
        y = 108.622
        width = 108.378
        height = 43.949
        polygon_points = "546.378,108.622 546.378,152.571 654.756,152.571 654.756,108.622 546.378,108.622 	"
        self.assertEqual(rect_points(polygon_points), (x, y, width, height))


if __name__ == '__main__':
    unittest.main()
