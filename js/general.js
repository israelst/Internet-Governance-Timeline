window.addEventListener('load', function(){
    var slide = document.getElementById('slide'),
        chosen = document.getElementById('chosen');

    slide.onchange = function (){
        chosen.textContent = this.value;
    };

    slide.onchange();
    d3.json("data/data.json", function(data){
        data = preprocessing(data);

        var timeline = timelineChart();
        d3.select('ol.months')
            .selectAll('li')
            .data(d3.time.months.apply(this, domainOfDates(data)))
            .enter()
            .append('li')
            .call(timeline);

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
    });
}, false);

