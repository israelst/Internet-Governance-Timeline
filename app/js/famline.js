var d3 = require('d3'),
    dates = require('./date.js').domainOfDates;

function Circles(selection){
    var biggerRadius, _cy, circlesSelection;
    function circles(){
        var data = selection.datum(),
            width = selection.node().parentNode.width.baseVal.value,
            x = d3.time.scale().range([0, width]).domain(dates(data));

        biggerRadius = d3.max(data, radius);

        function cx(d){
            return (x(d.date[0]) + x(d.date[1]))/2;
        }

        function radius(d){
            return cx(d) - x(d.date[0]);
        }

        circlesSelection = selection.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .style('fill', '#fff')
            .style('fill-opacity', 0.3)
            .attr('cx', cx)
            .attr('cy', biggerRadius * 1.5)
            .attr('r', radius);

        return circles;
    }

    circles.cy = function(cy){
        if (!arguments.length){
            return _cy;
        }
        _cy = cy;
        circlesSelection.attr('cy', cy);
        return circles;
    };

    circles.height = function(){
        return biggerRadius * 2;
    };

    return circles();
}

function YAxis(scale){
    return function (){
        var width = this.node().parentNode.width.baseVal.value,
            yAxis = d3.svg.axis().scale(scale).orient('right')
            .tickValues(scale.domain())
            .tickFormat(scale.invert)
            .tickSize(width)
            .tickPadding(-5);

        this.append('g')
            .attr('class', 'axis')
            .call(yAxis)
            .selectAll('text')
            .attr('y', -5)
            .attr('dy', '.35em')
            .style('text-transform', 'uppercase')
            .style('text-anchor', 'end');

        this.selectAll('.domain')
             .style('display', 'none' );

        this.selectAll('.tick line')
             .style('shape-rendering', 'crispEdges' )
             .style('stroke-dasharray', 1)
             .style('stroke-width', '1px')
             .style('stroke', '#bbb' );
    };
}

function Context(){
    return function(){
        var circles = Circles();
        d3.select(this.node().parentNode).append('g')
            .attr('class', 'all-events')
            .call(circles);
        this.attr('transform', 'translate(0,' + circles.height() * 2 + ')');
    };
}

exports.FamlineChart = function(){

    function chart(svg){
        var data = svg.datum(),
            kinds = d3.set(data.map(kind)).values(),
            groupedByKind = svg.append('g').attr('class', 'events-by-kind'),
            circles = Circles(groupedByKind),
            height = (circles.height() * 1.5) * kinds.length,
            y = d3.scale.ordinal().rangePoints([0, height]).domain(kinds);

        function kind(d){
            return d.institutions;
        }

        circles.cy(function (d){
            return y(kind(d));
        });

        svg.style('width', '100%')
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .attr('viewBox', '0 0 800 ' + height * 2)
            .style('background-color', '#101010');

        groupedByKind.call(YAxis(y));
        groupedByKind.call(Context());
    }

    return chart;
};
