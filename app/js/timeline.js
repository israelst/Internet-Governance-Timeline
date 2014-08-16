var d3 = require('d3');

function leftCalculator(width){
    var indent = 0, prevEndDate, maxSoFar;
    return function(d){
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

exports.timelineChart = function(){
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
        if (!arguments.length){
            return dayHeight;
        }
        dayHeight = +value;
        _selection.style('height', function(d){
            var qtyOfDays = 32 - new Date(d.getFullYear(), d.getMonth(), 32).getDate();
            return qtyOfDays * dayHeight + 'px';
        });

        var dates = _selection.data(),
            extent = [new Date(dates[0]), new Date(dates[0])];
        extent[1].setDate(extent[1].getDate() + 1);

        chart.scale = d3.time.scale().domain(extent).range([0, dayHeight]);
        return chart;
    };

    return chart;
};

exports.eventsChart = function(timeline){
    var _selection,
        detailBox = document.createElement('div'),
        nameBox = document.createElement('h1'),
        moreBox = document.createElement('p');
    detailBox.id = 'detail-box';
    detailBox.appendChild(nameBox);
    detailBox.appendChild(moreBox);

    function chart(selection){
        _selection = selection;
        chart.timeline(timeline);
        selection.style('padding', '0 2em')
        .style('position', 'absolute')
        .style('left', leftCalculator(240))
        .attr('title', function(d){return d.date.map(d3.time.format('%Y-%m-%d'));})
        .on('click', function(d){
            var formatedDates = d.date.map(d3.time.format('%B %d, %Y'));
            nameBox.textContent = d.event;
            moreBox.innerHTML = ('From ' + formatedDates[0].bold() +
                                 ' to ' + formatedDates[1].bold());
            if(detailBox.parentNode === null){
                document.body.appendChild(detailBox);
            }
        });
        selection.append('div')
            .attr('class', 'name')
    }

    chart.timeline = function(value){
        if (!arguments.length){
            return value;
        }
        timeline = value;
        function height(d){
            var endDate = new Date(d.date[1].getFullYear(),
                              d.date[1].getMonth(),
                              d.date[1].getDate() + 1);
            return Math.round(timeline.scale(endDate) - timeline.scale(d.date[0])) + 'px';
        }

        d3.select(_selection.node().parentNode)
            .style('position', 'absolute')
            .style('top', timeline.top() + 'px');

        _selection.style('line-height', height)
            .style('height', height)
            .style('width', function(d){
                return '10%';
            })
            .style('top', function(d){
                return Math.round(timeline.scale(d.date[0])) + 'px';
            });
        return chart;
    };

    return chart;
};

