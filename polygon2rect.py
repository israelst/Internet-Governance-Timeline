import re

def process_line(line):
    values = rect_points(extract_points(line))
    rect_pattern = 'x="{}" y="{}" width="{}" height="{}"'
    rect_attr = rect_pattern.format(*values)
    line = re.sub(r'points[^\d]+[^\'"]*.', rect_attr, line)
    return line.replace('polygon', 'rect')

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

