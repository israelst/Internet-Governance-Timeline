var d3 = require('d3');

function kind(d){
    var event_classes = {
        'WSIS process': 'wsis',
        'ITU process': 'itu',
        'UN process (GA/ECOSOC/CSTD)': 'un',
        'IGF Processes': 'igf',
        'ICANN': 'icann',
        'IETF': 'ietf'
    };
    return event_classes[d] || 'other';
}

function eventsByDay(data){
    var dates = data.map(function(d){
        var days = d3.time.days(
            d.date[0],
            new Date(d.date[1].getFullYear(), d.date[1].getMonth(), d.date[1].getDate() + 1)
        );
        return days.map(function(day){
            return {date: day, institution: d.institutions};
        });
    }).reduce(function(a, b){
        return a.concat(b);
    });
    return d3.nest()
            .key(function(d){return d3.time.format('%Y-%m-%d')(d.date);})
            .map(dates, d3.map);
}

window.addEventListener('load', function(){
    var slide = document.getElementById('slide'),
        chosen = document.getElementById('chosen'),
        calendar = calendarChart();

    slide.onchange = function (){
        chosen.textContent = this.value;
    };
    slide.onchange();

    d3.select('#calendar-view').call(calendar);

    d3.json('data/data.json', function(data){
        data = preprocessing(data);
        calendar.data(eventsByDay(data));

        var timeline = timelineChart();

        d3.select('ol.months')
            .selectAll('li')
            .data(d3.time.months.apply(this, domainOfDates(data)))
            .enter()
            .append('li')
            .call(timeline);

        var checkeds = {};

        var institutions = d3.set(data.map(function(d){return d.institutions;})).values();
        var institutionsSelection = d3.select('#institution-filter')
            .selectAll('div')
            .data(institutions)
            .enter()
            .append('div');
        institutionsSelection.append('input')
            .attr('type', 'checkbox')
            .attr('checked', 'checked')
            .attr('id', kind)
            .on('change', function(value){
                var klass = kind(value);
                checkeds[klass] = +this.checked;
                calendar.fillDays(function(event){
                    return checkeds[kind(event.institution)] !== 0;
                });
                d3.selectAll('ul.events li.event.' + klass).style('opacity', checkeds[klass]);
            });
        institutionsSelection.append('label')
            .attr('class', kind)
            .attr('for', kind)
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

        calendar.fillDays();
    });

}, false);

