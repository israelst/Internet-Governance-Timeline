var d3 = require('d3'),
    FamlineChart = require('./famline').FamlineChart,
    timelineChart = require('./timeline').timelineChart,
    eventsChart = require('./timeline').eventsChart,
    calendarChart = require('./calendar').calendarChart;

function preprocessing(data){
    function byStartDate(d1, d2){
        return d1.date[0] - d2.date[0];
    }

    function normalizeDate(d){
        try{
            d.date = d.date.map(d3.time.format('%Y-%m-%d').parse);
        }catch(e){
            d.date = undefined;
        }finally{
            return d;
        }
    }

    data = data.map(normalizeDate)
            .filter(function(d){return d.date;})
            .sort(byStartDate);
    return data;
}

function domainOfDates(data){
    var startDates = data.map(function(d){return d.date[0];}),
        endDates = data.map(function(d){return d.date[1];});

    var dateExtent = d3.extent(startDates.concat(endDates))
                     .map(function(d){ return new Date(d);});
    dateExtent[0].setDate(1);
    dateExtent[1].setMonth(dateExtent[1].getMonth() + 1);
    dateExtent[1].setDate(0);
    return dateExtent;
}

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
        calendar = calendarChart(d3.range(2013, 2015));

    slide.onchange = function (){
        chosen.textContent = this.value;
    };
    slide.onchange();

    d3.select('#calendar-view').call(calendar);

    d3.json('data/data.json', function(data){
        data = preprocessing(data);

        d3.select('#timeline')
            .append('svg')
            .attr('id', 'famline-chart')
            .attr('width', '800')
            .attr('height', '200')
            .selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .call(FamlineChart());


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
            .attr('class', function(d){
                return kind(d.institutions) + ' event';
            })
            .call(events);

        function updateDayHeight(){
            events.timeline(timeline.dayHeight(this.value));
        }
        slide.addEventListener('change', updateDayHeight);
        updateDayHeight.call(slide);

        calendar.fillDays();
    });

}, false);

