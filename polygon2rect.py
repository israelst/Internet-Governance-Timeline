import re

def extract_points(line):
    results = re.search(r'points[^\d]+([^\'"]*)', line)
    return results.group(1)

def rect_points(polygon_points):
    points = [map(float, point.split(','))
              for point in polygon_points.split()]
    x, y = points[0]
    round3 = lambda n: round(n, 3)
    width = abs(points[2][0] - x)
    height = abs(points[2][1] - y)
    return tuple(map(round3, (x, y, width, height)))

