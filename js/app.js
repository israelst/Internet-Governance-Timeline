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
        var dateFormat = d3.time.format("%Y-%m-%d");

        data = data.map(function(d){
            try{
                d.date = d.date.map(dateFormat.parse);
            }catch(e){
                d.date = undefined;
            }finally{
                return d;
            }
        });

        data = data.filter(function(d){return d.date;});

        data.sort(function(d1, d2){
            return d1.date[0] - d2.date[0];
        });

        function dates(index){
            return data.map(function(d){return d.date[index];});
        }

        function expandDateRange(dateExtent){
            var min = new Date(dateExtent[0]).setDate(1),
                max = new Date(dateExtent[1]).setDate(1),
                dates = [];
            for(var curr = new Date(min);
                    curr <= max;
                    curr.setMonth(curr.getMonth() + 1)){
                dates.push(new Date(curr));
            }
            return dates;
        }

        var dateExtent = d3.extent(dates(0).concat(dates(1)));

        var monthsList = document.querySelector('ol.months');
        var monthsListItem = d3.select(monthsList)
            .selectAll('li')
            .data(expandDateRange(dateExtent))
            .enter()
            .append('li');
        monthsListItem.append('span')
            .attr('class', 'month')
            .text(d3.time.format('%B'));
        monthsListItem.append('span')
            .attr('class', 'year')
            .text(d3.time.format('%Y'));

        var timeScale = d3.time.scale().domain(dateExtent).range([0, monthsList.clientHeight]);

        var li = d3.select('ul.events')
        .style('position', 'absolute')
        .style('top', monthsList.offsetTop + 'px')
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
            return (timeScale(d.date[1]) - timeScale(d.date[0])) + 'px';
        })
        .style('top', function(d, i){
            return timeScale(d.date[0]) + 'px';
        })
        .style('left', function(d, i){
            var atTheSameTime = data.filter(function(e){
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
          .text(function(d){return d.date.map(dateFormat);});
    });
};
