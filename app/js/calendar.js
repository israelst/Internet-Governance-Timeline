function calendarChart(){
    var cellSize = 10,
        day = d3.time.format('%w'),
        week = d3.time.format('%U'),
        format = d3.time.format('%Y-%m-%d'),
        dayRects;

    function monthPath(t0) {
        var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
            d0 = +day(t0), w0 = +week(t0),
            d1 = +day(t1), w1 = +week(t1);
      return 'M' + (w0 + 1) * cellSize + ',' + d0 * cellSize +
             'H' + w0 * cellSize + 'V' + 7 * cellSize +
             'H' + w1 * cellSize + 'V' + (d1 + 1) * cellSize +
             'H' + (w1 + 1) * cellSize + 'V' + 0 +
             'H' + (w0 + 1) * cellSize + 'Z';
    }

    function eventsByDay(data){
        var dates = data.map(function(d){
            var days = d3.time.days(
                d.date[0],
                new Date(d.date[1].getFullYear(), d.date[1].getMonth(), d.date[1].getDate() + 1)
            );
            return days.map(function(day){
                return {date: day, institution: d.institutions};
            });
        }).reduce(function(a, b){
            return a.concat(b);
        });
        return d3.nest()
                .key(function(d){return format(d.date);})
                .map(dates, d3.map);
    }

    function chart(selection){
        var svg = selection.selectAll('svg')
            .data(d3.range(2013, 2015))
            .enter().append('svg')
            .attr('viewBox', '0 0 640 90')
            .attr('class', 'year')
            .append('g')
            .attr('transform', 'translate(15, 5)');

        svg.append('text')
            .attr('transform', 'translate(-6,' + cellSize * 3.5 + ')rotate(-90)')
            .style('text-anchor', 'middle')
            .text(function(d) { return d; });

        dayRects = svg.selectAll('.day')
            .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
            .enter().append('rect')
            .attr('class', 'day')
            .attr('width', cellSize)
            .attr('height', cellSize)
            .attr('x', function(d) { return week(d) * cellSize; })
            .attr('y', function(d) { return day(d) * cellSize; })
            .datum(format);

        dayRects.append('title')
            .text(function(d) { return d; });

        svg.selectAll('.month')
            .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
            .enter().append('path')
            .attr('class', 'month')
            .attr('d', monthPath);

        return chart;
    }

    chart.fillDays = function (data, filter){
        if( typeof filter !== 'function'){
            filter = function(){ return true;};
        }
        var datesCount = eventsByDay(data);
        dayRects.filter(function(d) { return datesCount.has(d); })
            .attr('class', function(d){
                var classes = datesCount.get(d).map(function(event){
                    return kind(event.institution);
                });
                this.classList.add.apply(this.classList, classes);
                return this.classList.toString();
            })
            .style('fill', function(d) {
                var maxQtyOfEventsPerDay = 6,
                    lightness = 1 - (datesCount.get(d).filter(filter).length) / maxQtyOfEventsPerDay;
                if(lightness === 1){
                    return '#eee';
                }else{
                    return d3.hsl(70, 0.66, lightness - 0.05).toString();
                }
            });
    };


    return chart;
}

