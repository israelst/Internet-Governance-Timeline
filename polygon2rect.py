import unittest

def rect_points(polygon_points):
    points = [map(float, point.split(','))
              for point in polygon_points.split()]
    x, y = points[0]
    round3 = lambda n: round(n, 3)
    width = points[2][0] - x
    height = points[2][1] - y
    return tuple(map(round3, (x, y, width, height)))

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
