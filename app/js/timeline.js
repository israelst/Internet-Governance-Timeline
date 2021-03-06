var d3 = require('d3');

function leftCalculator(){
    var prevEndDate, maxSoFar, margin = 10,
        prevWidth = 0, prevLeft = 0, left = 0;
    return function(d){
        var startDate = d.date[0];
        if(prevEndDate >= startDate){
            left = (prevWidth + margin) + 'px';
            maxSoFar = prevEndDate;
        }
        if(startDate > maxSoFar){
            left = prevLeft + 'px';
            maxSoFar = d.date[1];
        }
        prevEndDate = d.date[1];
        prevWidth = this.clientWidth;
        prevLeft = this.clientLeft;
        return left;
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
        chart.updateLeft();
        selection.style('padding', '0 2em')
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
    }

    chart.updateLeft = function(){
        _selection
            .style('position', 'absolute')
            .style('left', leftCalculator());
    };

    chart.showEventName = function(showing){
        _selection.select('div').remove();
        if(showing === true){
            _selection.append('div')
                .attr('class', 'name')
                .style('white-space', 'nowrap')
                .style('visibility', 'visible')
                .text(function(d){ return d.event;});

            _selection.filter(function(){
                return this.clientHeight < 11;
            }).select('div').style('visibility', 'hidden');
        }
    };

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
            .style('top', function(d){
                return Math.round(timeline.scale(d.date[0])) + 'px';
            });
        chart.showEventName(true);
        return chart;
    };

    return chart;
};

