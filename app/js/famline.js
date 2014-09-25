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

exports.FamlineChart = function(){

    function chart(svg){
        var data = svg.datum(),
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
            return y(kind(d));
        }

        circles.attr('cy', cy);
        groupedByKind.attr('transform', 'translate(0,' + circlesChart.height() * 3 + ')');

        svg.append('g')
            .attr('class', 'all-events')
            .call(Circles());

        groupedByKind.call(YAxis(y));

        svg.attr('width', '100%')
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .attr('viewBox', '0 0 800 ' + height * 2);

    }

    return chart;
};
