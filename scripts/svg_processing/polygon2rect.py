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
    x, y = min(points)
    round3 = lambda n: round(n, 3)
    opposite = filter(lambda p: p[0] != x and p[1] != y, points)[0]
    width = opposite[0] - x
    height = opposite[1] - y
    return tuple(map(round3, (x, y, width, height)))

if __name__ == '__main__':
    import fileinput

    for line in fileinput.input():
        if '<polygon' in line:
            print process_line(line),
        else:
            print line,
