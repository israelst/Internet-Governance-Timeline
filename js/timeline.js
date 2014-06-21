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

function monthChart(dayHeight){
    function chart(selection){
        selection.style('height', function(d){
            var qtyOfDays = 32 - new Date(d.getFullYear(), d.getMonth(), 32).getDate();
            return qtyOfDays * dayHeight + 'px';
        });
        selection.append('span')
            .attr('class', 'month')
            .text(d3.time.format('%B'));
        selection.append('span')
            .attr('class', 'year')
            .text(d3.time.format('%Y'));
    }
    return chart;
}

function timelineChart(monthSelection){
    var months = monthSelection.data(),
        dateExtent = [months[0], months[months.length - 1]],
        totalHeight = monthSelection[0][0].parentNode.clientHeight,
        timeScale = d3.time.scale().domain(dateExtent).range([0, totalHeight]);

    function height(d){
        return (timeScale(d.date[1]) - timeScale(d.date[0])) + 'px';
    }

    function chart(li, data){
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

window.addEventListener('load', function(){
    d3.json("data/data.json", function(data){
        data = preprocessing(data);

        function dates(index){
            return data.map(function(d){return d.date[index];});
        }

        var dateExtent = d3.extent(dates(0).concat(dates(1)))
                         .map(function(d){ return new Date(d);});
        dateExtent[0].setDate(1);
        dateExtent[1].setMonth(dateExtent[1].getMonth() + 1);
        dateExtent[1].setDate(0);

        var monthsList = document.querySelector('ol.months');
        d3.select(monthsList)
            .selectAll('li')
            .data(d3.time.months.apply(this, dateExtent))
            .enter()
            .append('li')
            .call(monthChart(8));


        var li = d3.select('ul.events')
        .style('position', 'absolute')
        .style('top', monthsList.offsetTop + 'px')
        .selectAll('li')
        .data(data)
        .enter()
        .append('li')
        .call(timelineChart(d3.selectAll('ol.months > li')));

    });
}, false);

