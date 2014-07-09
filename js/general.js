window.addEventListener('load', function(){
    var slide = document.getElementById('slide'),
        chosen = document.getElementById('chosen');

    slide.onchange = function (){
        chosen.textContent = this.value;
    };

    slide.onchange();

    var width = 960,
        height = 136,
        cellSize = 12;

    var day = d3.time.format("%w"),
        week = d3.time.format("%U"),
        format = d3.time.format("%Y-%m-%d");

    var svg = d3.select("#calendar-view").selectAll("svg")
        .data(d3.range(2013, 2015))
        .enter().append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "RdYlGn")
        .append("g")
        .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

    svg.append("text")
        .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
        .style("text-anchor", "middle")
        .text(function(d) { return d; });

    var rect = svg.selectAll(".day")
        .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("rect")
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function(d) { return week(d) * cellSize; })
        .attr("y", function(d) { return day(d) * cellSize; })
        .datum(format);

    rect.append("title")
        .text(function(d) { return d; });

    svg.selectAll(".month")
        .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("path")
        .attr("class", "month")
        .attr("d", monthPath);

    function monthPath(t0) {
      var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
          d0 = +day(t0), w0 = +week(t0),
          d1 = +day(t1), w1 = +week(t1);
      return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
          + "H" + w0 * cellSize + "V" + 7 * cellSize
          + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
          + "H" + (w1 + 1) * cellSize + "V" + 0
          + "H" + (w0 + 1) * cellSize + "Z";
    }


    d3.json("data/data.json", function(data){
        data = preprocessing(data);

        var timeline = timelineChart();
        d3.select('ol.months')
            .selectAll('li')
            .data(d3.time.months.apply(this, domainOfDates(data)))
            .enter()
            .append('li')
            .call(timeline);

        var institutions = d3.set(data.map(function(d){return d.institutions;})).values();
        var institutionsSelection = d3.select("#institution-filter")
            .selectAll("div")
            .data(institutions)
            .enter()
            .append('div');
        institutionsSelection.append('input')
            .attr("type", "checkbox")
            .attr("checked", "checked")
            .attr("id", kind)
            .on('change', function(value){
                var checked = this.checked;
                d3.selectAll('ul.events li').style('opacity', function(d){
                    if(kind(d.institutions) == kind(value)){
                        return +checked;
                    }
                    return this.style.opacity;
                });
            });
        institutionsSelection.append('label')
            .attr('class', kind)
            .attr("for", kind)
            .text(function(d){ return d;});

        var events = eventsChart(timeline);
        d3.select('ul.events')
            .selectAll('li')
            .data(data)
            .enter()
            .append('li')
            .call(events);

        slide.addEventListener('change', function (){
            events.timeline(timeline.dayHeight(this.value));
        });

        function kind(d){
            var event_classes = {
                'WSIS process': 'wsis',
                'ITU process': 'itu',
                'UN process (GA/ECOSOC/CSTD)': 'un',
                'IGF Processes': 'igf',
                'ICANN': 'icann',
                'IETF': 'ietf'
            };
            var event_class = event_classes[d];
            event_class = event_class || 'other';
            return event_class;
        }

    var count = {};
    data.map(function(d){
        var dateRange = [
            d.date[0],
            new Date(d.date[1].getFullYear(), d.date[1].getMonth(), d.date[1].getDate() + 1)
        ];
        return d3.time.days.apply(this, dateRange);
    }).reduce(function(a, b){
        return a.concat(b);
    }).forEach(function(d){
        d = format(d)
        count[d] |= 0;
        count[d]++;
    });

    rect.filter(function(d) { return d in count; })
        .style("fill", function(d) {
            var color = d3.rgb(count[d] * 100, 20, 20);
            return color.toString();
        })
        .select("title");

    });

}, false);

