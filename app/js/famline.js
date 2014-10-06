var d3 = require('d3'),
    dates = require('./date.js').domainOfDates;

function Circles(selection){
    var biggerRadius, _cy, circlesSelection;
    function circles(){
        var data = selection.datum(),
            width = selection.node().ownerSVGElement.width.baseVal.value,
            x = d3.time.scale().range([0, width]).domain(dates(data));

        biggerRadius = d3.max(data, radius);

        function cx(d){
            return d3.mean(d.date.map(x));
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
    function parseTraslate(transformations){
        var values = /translate\(([\d\.]+)[\D]+([\d\.]+)+\)/.exec(transformations);
        return values === null? [0, 0] : values.slice(1, 3);
    }

    return function (){
        var svg = d3.select(this.node().ownerSVGElement),
            yAxis = d3.svg.axis().scale(scale).orient('left')
                .tickValues(scale.domain())
                .tickFormat(scale.invert)
                .tickPadding(-5);

        svg.selectAll('.focus, .context').attr('transform', function(){
            var values = parseTraslate(d3.select(this).attr('transform'));
            values[0] += 100;
            return ' translate(' + values.join(',') + ') scale(.875)';
        });

        this.append('g')
            .attr('class', 'axis')
            .call(yAxis)
            .selectAll('text')
            .attr('y', -5)
            .attr('dy', '.25em')
            .style('fill', '#fff')
            .style('font-size', '.7em');

        this.selectAll('.domain').style('display', 'none');
    };
}

function Focus(){
    function chart(svg){
        var data = svg.datum(),
            kinds = d3.set(data.map(kind)).values(),
            groupedByKind = svg.append('g').attr('class', 'focus'),
            circles = Circles(groupedByKind),
            height = (circles.height() * 1.5) * kinds.length;

        chart.y = d3.scale.ordinal().rangePoints([0, height], 1).domain(kinds);

        function kind(d){
            return d.institutions;
        }

        circles.cy(function (d){
            return chart.y(kind(d));
        });

        svg.attr('viewBox', ['0', '0', svg.attr('width'), height].join(' '));

        return groupedByKind;
    }

    return chart;
}

function Context(){
    return function(){
        var svg = d3.select(this.node().ownerSVGElement),
            context = svg.append('g').attr('class', 'context'),
            circles = Circles(context),
            contextHeight = circles.height() * 2; // one height as margin

        this.attr('transform', 'translate(0,' + contextHeight  + ')');
        svg.node().viewBox.baseVal.height += contextHeight;
    };
}

exports.FamlineChart = function(){
    function chart(svg){
        svg.style('background-color', '#101010')
            .style('width', '100%')
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .attr('width', 800);

        var focus = Focus();
        focus(svg)
            .call(Context())
            .call(YAxis(focus.y));
    }

    return chart;
};
