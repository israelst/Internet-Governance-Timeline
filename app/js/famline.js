var d3 = require('d3'),
    dates = require('./date.js').domainOfDates;

function Circles(){
    var biggerRadius;
    function circles(selection){
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

        return selection
            .selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .style('fill-opacity', 0.3)
            .attr('cx', cx)
            .attr('cy', biggerRadius)
            .attr('r', radius);

    }

    circles.height = function(){
        return biggerRadius * 2;
    };

    return circles;
}

exports.FamlineChart = function(){
    var minWidth = 800;

    function chart(svg){
        var width = Math.max(svg.attr('width'), minWidth),
            data = svg.datum(),
            kinds = d3.set(data.map(kind)).values(),
            groupedByKind = svg.append('g').attr('class', 'events-by-kind'),
            circlesChart = Circles(),
            circles = circlesChart(groupedByKind),
            height = (circlesChart.height() * 1.5) * kinds.length,
            y = d3.scale.ordinal().rangePoints([0, height]).domain(kinds);

        function kind(d){
            return d.institutions;
        }

        function cy(d){
            return y(d.institutions);
        }

        circles.attr('cy', cy);
        groupedByKind.attr('transform', 'translate(0,' + circlesChart.height() * 2 + ')');

        svg.append('g')
            .attr('class', 'all-events')
            .call(Circles());

        svg.attr('height', height * 2)
            .attr('width', width);


        var yAxis = d3.svg.axis().scale(y).orient('right')
             .tickValues(y.domain())
             .tickFormat(y.invert)
             .tickSize(width)
             .tickPadding(-5);

        groupedByKind
            .append('g')
            .attr('class', 'axis')
            .call(yAxis)
            .selectAll('text')
            .attr('y', -5)
            .attr('dy', '.35em')
            .style('text-transform', 'uppercase')
            .style('text-anchor', 'end');

        groupedByKind.selectAll('.domain')
             .style('display', 'none' );

        groupedByKind.selectAll('.tick line')
             .style('shape-rendering', 'crispEdges' )
             .style('stroke-dasharray', 1)
             .style('stroke', '#bbb' );

    }

    return chart;
};
