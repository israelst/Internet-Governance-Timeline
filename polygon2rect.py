import re

def extract_points(line):
    groups = re.search(r'points[^\d]+([^"]*)', line).groups()
    return groups[0]

def rect_points(polygon_points):
    points = [map(float, point.split(','))
              for point in polygon_points.split()]
    x, y = points[0]
    round3 = lambda n: round(n, 3)
    width = points[2][0] - x
    height = points[2][1] - y
    return tuple(map(round3, (x, y, width, height)))

