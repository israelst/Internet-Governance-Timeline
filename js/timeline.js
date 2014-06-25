function preprocessing(data){
    var dateFormat = d3.time.format("%Y-%m-%d");

    function byStartDate(d1, d2){
        return d1.date[0] - d2.date[0];
    }

    function normalizeDate(d){
        try{
            d.date = d.date.map(dateFormat.parse);
        }catch(e){
            d.date = undefined;
        }finally{
            return d;
        }
    }

    data = data.map(normalizeDate)
            .filter(function(d){return d.date;})
            .sort(byStartDate);
    return data;
}

function leftCalculator(width){
    var indent = 0, prevEndDate, maxSoFar;
    return function(d, i){
        var startDate = d.date[0];
        if(prevEndDate >= startDate){
            indent++;
            maxSoFar = prevEndDate;
        }
        if(startDate > maxSoFar && indent > 0){
            indent--;
            maxSoFar = d.date[1];
        }
        prevEndDate = d.date[1];
        return indent * width + 'px';
    };
}

function timelineChart(){
    var dayHeight, _selection;

    function chart(selection){
        _selection = selection;
        selection.append('span')
            .attr('class', 'month')
            .text(d3.time.format('%B'));
        selection.append('span')
            .attr('class', 'year')
            .text(d3.time.format('%Y'));

        chart.dayHeight(8);

        return chart;
    }

    chart.top = function() {
        return _selection.node().parentNode.offsetTop;
    };

    chart.dayHeight = function(value) {
        if (!arguments.length) return dayHeight;
        dayHeight = value;
        _selection.style('height', function(d){
            var qtyOfDays = 32 - new Date(d.getFullYear(), d.getMonth(), 32).getDate();
            return qtyOfDays * dayHeight + 'px';
        });

        var totalHeight = _selection.node().parentNode.clientHeight,
            dates = _selection.data(),
            extent = [new Date(dates[0]), new Date(dates[dates.length - 1])];
        extent[1].setMonth(extent[1].getMonth() + 1);
        extent[1].setDate(0);

        chart.scale = d3.time.scale().domain(extent).range([0, totalHeight]);
        return chart;
    };

    return chart;
}

function eventsChart(timeline){
    function height(d){
        return (timeline.scale(d.date[1]) - timeline.scale(d.date[0])) + 'px';
    }

    function chart(li){
        d3.select(li.node().parentNode)
            .style('position', 'absolute')
            .style('top', timeline.top() + 'px');
        li.attr('class', function(d){
            var event_classes = {
                'WSIS process': 'wsis',
                'ITU process': 'itu',
                'UN process (GA/ECOSOC/CSTD)': 'un',
                'IGF Processes': 'igf',
                'ICANN': 'icann',
            };
            var event_class = event_classes[d.institutions];
            event_class = event_class || 'other';
            return event_class + ' event';
        })
        .style('padding', '0 2em')
        .style('position', 'absolute')
        .style('line-height', height)
        .style('height', height)
        .style('top', function(d){
            return timeline.scale(d.date[0]) + 'px';
        })
        .style('left', leftCalculator(240));
        li.append('div')
            .attr('class', 'name')
            .text(function(d){return d.event;});
    }
    return chart;
}

function domainOfDates(data){
    var startDates = data.map(function(d){return d.date[0];}),
        endDates = data.map(function(d){return d.date[1];});

    var dateExtent = d3.extent(startDates.concat(endDates))
                     .map(function(d){ return new Date(d);});
    dateExtent[0].setDate(1);
    dateExtent[1].setMonth(dateExtent[1].getMonth() + 1);
    dateExtent[1].setDate(0);
    return dateExtent;
}

window.addEventListener('load', function(){
    d3.json("data/data.json", function(data){
        data = preprocessing(data);

        var timeline = timelineChart();
        var scale = d3.select('ol.months')
            .selectAll('li')
            .data(d3.time.months.apply(this, domainOfDates(data)))
            .enter()
            .append('li')
            .call(timeline);

        d3.select('ul.events')
            .selectAll('li')
            .data(data)
            .enter()
            .append('li')
            .call(eventsChart(timeline));
    });
}, false);

