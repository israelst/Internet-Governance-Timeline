function calendarChart(){
    var cellSize = 10,
        day = d3.time.format("%w"),
        week = d3.time.format("%U"),
        format = d3.time.format("%Y-%m-%d"),
        dayRects;

    function monthPath(t0) {
      var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
          d0 = +day(t0), w0 = +week(t0),
          d1 = +day(t1), w1 = +week(t1);
      return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
          + "H" + w0 * cellSize + "V" + 7 * cellSize
          + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
          + "H" + (w1 + 1) * cellSize + "V" + 0
          + "H" + (w0 + 1) * cellSize + "Z";
    }

    function eventsByDay(data){
        var count = {};
        data.map(function(d){
            var dateRange = [
                d.date[0],
                new Date(d.date[1].getFullYear(), d.date[1].getMonth(), d.date[1].getDate() + 1)
            ];
            return d3.time.days.apply(this, dateRange);
        }).reduce(function(a, b){
            return a.concat(b);
        }).forEach(function(d){
            d = format(d)
            count[d] |= 0;
            count[d]++;
        });
        return count;
    }

    function chart(selection){
        var svg = selection.selectAll("svg")
            .data(d3.range(2013, 2015))
            .enter().append("svg")
            .attr("viewBox", '0 0 545 70')
            .attr("class", "year")
            .append("g")
            .attr("transform", "translate(15, 0)");

        svg.append("text")
            .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
            .style("text-anchor", "middle")
            .text(function(d) { return d; });

        daysRects = svg.selectAll(".day")
            .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
            .enter().append("rect")
            .attr("class", "day")
            .attr("width", cellSize)
            .attr("height", cellSize)
            .attr("x", function(d) { return week(d) * cellSize; })
            .attr("y", function(d) { return day(d) * cellSize; })
            .datum(format);

        daysRects.append("title")
            .text(function(d) { return d; });

        svg.selectAll(".month")
            .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
            .enter().append("path")
            .attr("class", "month")
            .attr("d", monthPath);

        return chart;
    }

    chart.fillDays = function (data){
        var count = eventsByDay(data);
        daysRects.filter(function(d) { return d in count; })
            .style("fill", function(d) {
                var saturation  = 255 - (count[d] + 1) * 50,
                    color = d3.rgb(saturation, saturation, saturation);
                return color.toString();
            });
    };


    return chart;
}

