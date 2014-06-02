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
        data = data.map(function(d){
            try{
                var toDate = function(date){return new Date(date);};
                d.date = d.date.map(toDate);
            }catch(e){
                d.date = undefined;
            }finally{
                return d;
            }
        });
        function dates(index){
            return data.map(function(d){return d.date[index];});
        }
        function expandDateRange(min, max){
            var dates = [];
            min = new Date(min).setDate(1);
            max = new Date(max).setDate(1);
            for(var curr = new Date(min);
                    curr <= max;
                    curr.setMonth(curr.getMonth() + 1)){
                dates.push(new Date(curr));
            }
            return dates;
        }

        var minDate = d3.min(dates(0));
        var maxDate = d3.max(dates(1));

        function monthAppender(container){
            return function(date){
                var monthNode = document.createElement('span');
                monthNode.className = 'month';
                monthNode.textContent = date.toLocaleFormat('%B');

                var yearNode = document.createElement('span');
                yearNode.className = 'year';
                yearNode.textContent = date.toLocaleFormat('%Y');

                var parentNode = document.createElement('li');
                parentNode.appendChild(yearNode);
                parentNode.appendChild(monthNode);

                container.appendChild(parentNode);
            };
        }
        var monthList = timeline.getElementsByTagName('ol')[0];
        expandDateRange(minDate, maxDate).forEach(monthAppender(monthList));

        var timeScale = d3.time.scale().domain([minDate, maxDate]).range([0, monthList.clientHeight]);

        var li = d3.select('ul.events')
        .style('position', 'absolute')
        .style('top', monthList.offsetTop + 'px')
        .selectAll('li')
        .data(data)
        .enter()
        .append('li');

        li.attr('class', function(d){
            var event_classes = {
                'WSIS process': 'wsis',
                'ITU process': 'itu',
                'UN process (GA/ECOSOC/CSTD)': 'un',
                'IGF Processes': 'igf',
                'ICANN': 'icann',
            };
            var event_class = event_classes[d.institutions];
            event_class = event_class || 'other';
            return event_class + ' event';
        })
        .style('padding', '0 2em')
        .style('position', 'absolute')
        .style('height', function(d){
            if(d.duration){
                return d.duration + 'em';
            }
        })
        .style('top', function(d, i){
            return timeScale(d.date[0]) + 'px';
        })
        .style('left', function(d, i){
            var atTheSameTime= data.filter(function(e){
                return (e.date[0] >= d.date[0] &&
                        e.date[0] <= d.date[1] &&
                        e.code !== d.code);
            });
            if(atTheSameTime.length > 0)
                return '400px';
        });
        li.append('div')
          .attr('class', 'name')
          .text(function(d){return d.event;});
        li.append('div')
          .attr('class', 'date')
          .text(function(d){return d.date;});
    });
};
