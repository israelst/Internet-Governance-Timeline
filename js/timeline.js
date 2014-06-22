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

function monthChart(){
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

    chart.dayHeight = function(value) {
        if (!arguments.length) return dayHeight;
        dayHeight = value;
        _selection.style('height', function(d){
            var qtyOfDays = 32 - new Date(d.getFullYear(), d.getMonth(), 32).getDate();
            return qtyOfDays * dayHeight + 'px';
        });
        return chart;
    };

    return chart;
}

function timelineChart(monthSelection){
    var months = monthSelection.data(),
        dateExtent = [months[0], months[months.length - 1]],
        totalHeight = monthSelection.node().parentNode.clientHeight,
        timeScale = d3.time.scale().domain(dateExtent).range([0, totalHeight]);

    function height(d){
        return (timeScale(d.date[1]) - timeScale(d.date[0])) + 'px';
    }

    function chart(li){
        d3.select(li.node().parentNode)
            .style('position', 'absolute')
            .style('top', monthSelection.node().offsetTop + 'px');
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
            return timeScale(d.date[0]) + 'px';
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

        var scale = d3.select('ol.months')
            .selectAll('li')
            .data(d3.time.months.apply(this, domainOfDates(data)))
            .enter()
            .append('li')
            .call(monthChart(8));

        d3.select('ul.events')
            .selectAll('li')
            .data(data)
            .enter()
            .append('li')
            .call(timelineChart(scale));
    });
}, false);

