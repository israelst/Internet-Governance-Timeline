var d3 = require('d3'),
    dates = require('./date.js').domainOfDates;

function Circles(selection){
    var biggerRadius, _cy, circlesSelection;
    function circles(){
        var data = selection.datum(),
            width = selection.node().ownerSVGElement.width.baseVal.value,
            x = d3.time.scale().range([0, width]).domain(dates(data));

        circles.x = x;

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
    function rebase(newParent, nodes){
        var filterParent = function(node){ return newParent !== node;},
            childs = [].filter.call(nodes, filterParent),
            append = document.appendChild.bind(newParent);
        childs.forEach(append);
    }

    return function (){
        var svg = this.node().ownerSVGElement,
            newParent = d3.select(svg).append('g')
                .attr('transform', 'translate(100, 0) scale(.875)')
                .node(),
            yAxis = d3.svg.axis().scale(scale).orient('left')
                .tickValues(scale.domain())
                .tickFormat(scale.invert)
                .tickPadding(-5);

        rebase(newParent, svg.childNodes);

        this.append('g')
            .attr('class', 'axis')
            .call(yAxis)
            .selectAll('text')
            .attr('x', -5)
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

        svg.call(Tooltip(circles.x));
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

function Tooltip(scale){
    scale = scale.copy().clamp(true);
    return function (){
        var format = d3.time.format('%Y-%m-%d'),
            info = this.append('g')
                .attr('class', 'info')
                .style('display', 'none'),
            textBox = info.append('text')
                .style('fill', '#eee')
                .style('font-size', '.7em')
                .attr('dx', '.5em')
                .attr('dy', '1.3em');

        info.append('line')
            .attr('y1', '100%')
            .style('stroke', 'rgba(255, 255, 255 , .2)');

        this.append('rect')
            .attr('width', scale.range()[1])
            .attr('height', '100%')
            .style('fill', 'none')
            .style('pointer-events', 'all')
            .on('mousemove', function (){
                var mouse = d3.mouse(this),
                    date = format(scale.invert(mouse[0])),
                    nearTheRightBorder = mouse[0] > scale.range()[1] * 0.75;

                if(nearTheRightBorder){
                    textBox.style('text-anchor', 'end')
                        .attr('dx', '-.5em');
                }else{
                    textBox.style('text-anchor', 'start')
                        .attr('dx', '.5em');
                }

                info.attr('transform', 'translate(' + mouse[0] + ',0)');
                textBox.text(date);
            })
            .on('mouseover', function() {
                info.style('display', null);
            })
            .on('mouseout', function() {
                info.style('display', 'none');
            });

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
