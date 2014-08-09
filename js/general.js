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

window.addEventListener('load', function(){
    var slide = document.getElementById('slide'),
        chosen = document.getElementById('chosen');

    slide.onchange = function (){
        chosen.textContent = this.value;
    };

    slide.onchange();

    var calendar = calendarChart();
    d3.select('#calendar-view').call(calendar);

    d3.json("data/data.json", function(data){
        data = preprocessing(data);

        var timeline = timelineChart();

        d3.select('ol.months')
            .selectAll('li')
            .data(d3.time.months.apply(this, domainOfDates(data)))
            .enter()
            .append('li')
            .call(timeline);

        var checkeds = {};

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
                var klass = kind(value);
                checkeds[klass] = +this.checked;
                calendar.fillDays(data, function(event){
                    return checkeds[kind(event.institution)] !== 0;
                });
                d3.selectAll('ul.events li.event.' + klass).style('opacity', checkeds[klass]);
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

        calendar.fillDays(data);
    });

}, false);
