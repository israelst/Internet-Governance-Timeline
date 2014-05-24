window.onload = function(){
    var timeline = document.getElementById('timeline'),
        primary = document.querySelector('h2');

    var clone = primary.cloneNode(true);
    clone.className = 'sticky';

    function sticky(){
        var isVisible = primary.style.visibility == 'hidden';
        if(window.pageYOffset >= timeline.offsetTop){
            if(!isVisible){
                primary.style.visibility = 'hidden';
                timeline.appendChild(clone);
            }
        }else if(isVisible){
            primary.style.visibility = 'visible';
            timeline.removeChild(clone);
        }
    }
    sticky();
    window.onscroll = sticky;

    d3.json("data/data.json", function(data){
        var eventsBox = d3.select('ul.events');
        eventsBox.selectAll('li').data(data)
        .enter().append('li').attr('class', function(d){
            var event_classes = {
                'WSIS process': 'wsis',
                'ITU process': 'itu',
                'UN process (GA/ECOSOC/CSTD)': 'un',
                'IGF Processes': 'igf',
                'ICANN': 'icann',
            };
            var event_class = event_classes[d.institutions];
            event_class = event_class === undefined? 'other': event_class;
            return event_class + ' event';
        })
        .attr('style', function(d){
            if(d.duration){
                var style = 'padding: 0 2em;';
                style += 'height: ' + d.duration * 20 + 'px';
                return style;
            }
        })
        .text(function (d) { return d.event; });
    });
};
