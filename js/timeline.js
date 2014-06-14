window.addEventListener('load', function(){
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

        var dateExtent = d3.extent(dates(0).concat(dates(1)));
        dateExtent[0] = new Date(dateExtent[0]);
        dateExtent[0].setDate(1);
        dateExtent[1] = new Date(dateExtent[1]);
        dateExtent[1].setMonth(dateExtent[1].getMonth() + 1);
        dateExtent[1].setDate(0);

        var monthsList = document.querySelector('ol.months');
        var monthsListItem = d3.select(monthsList)
            .selectAll('li')
            .data(d3.time.months.apply(this, dateExtent))
            .enter()
            .append('li')
            .style('height', function(d){
                var dayHeight = 10;
                return (32 - new Date(d.getFullYear(), d.getMonth(), 32).getDate()) * dayHeight + 'px';
            });
        monthsListItem.append('span')
            .attr('class', 'month')
            .text(d3.time.format('%B'));
        monthsListItem.append('span')
            .attr('class', 'year')
            .text(d3.time.format('%Y'));

        var timeScale = d3.time.scale().domain(dateExtent).range([0, monthsList.clientHeight]);
        function height(d){
            return (timeScale(d.date[1]) - timeScale(d.date[0])) + 'px';
        }

        var li = d3.select('ul.events')
        .style('position', 'absolute')
        .style('top', monthsList.offsetTop + 'px')
        .selectAll('li')
        .data(data)
        .enter()
        .append('li');

        var indent = 0;
        var maxSoFar;

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
        .style('line-height', height)
        .style('height', height)
        .style('top', function(d, i){
            return timeScale(d.date[0]) + 'px';
        })
        .style('left', function(d, i){
            var width = 240,
                eventStartDate = d.date[0];
            if(prevEvent = data[i - 1]){
                var prevEventEndDate = prevEvent.date[1];
                if(prevEventEndDate >= eventStartDate){
                    indent++;
                    maxSoFar = prevEventEndDate;
                }
                if(eventStartDate > maxSoFar && indent > 0){
                    indent--;
                    maxSoFar = d.date[1];
                }
                return indent * width + 'px';
            }
        });
        li.append('div')
          .attr('class', 'name')
          .text(function(d){return d.event;});
    });
}, false);

