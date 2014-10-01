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

        circlesSelection = selection.append('g')
            .attr('class', 'circles')
            .selectAll('circle')
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
        var svg = d3.select(this.node().parentNode),
            context = svg.append('g').attr('class', 'all-events'),
            circles = Circles(context),
            contextHeight = circles.height() * 2; // one height as margin

        this.attr('transform', 'translate(0,' + contextHeight  + ')');
        svg.node().viewBox.baseVal.height += contextHeight;
    };
}

exports.FamlineChart = function(){
    var width = 800;

    function chart(svg){
        svg.style('background-color', '#101010')
            .style('width', '100%')
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .attr('width', width);

        var data = svg.datum(),
            kinds = d3.set(data.map(kind)).values(),
            groupedByKind = svg.append('g').attr('class', 'events-by-kind'),
            circles = Circles(groupedByKind),
            height = (circles.height() * 1.5) * kinds.length,
            y = d3.scale.ordinal().rangePoints([0, height], 1).domain(kinds);

        function kind(d){
            return d.institutions;
        }

        circles.cy(function (d){
            return y(kind(d));
        });

        svg.attr('viewBox', ['0', '0', width, height].join(' '));

        groupedByKind.call(YAxis(y));
        groupedByKind.call(Context());
    }

    return chart;
};
