window.onload = function(){
    var timeline = document.getElementById('timeline'),
        primary = document.querySelector('h2');

    var clone = primary.cloneNode(true);
    clone.className = 'sticky';

    function sticky(){
        if(window.pageYOffset >= timeline.offsetTop){
            if(primary.style.visibility != 'hidden'){
                primary.style.visibility = 'hidden';
                timeline.appendChild(clone);
            }
        }else if(primary.style.visibility == 'hidden'){
            primary.style.visibility = 'visible';
            timeline.removeChild(clone);
        }
    }
    sticky();
    window.onscroll = sticky;
};
