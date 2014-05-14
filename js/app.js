window.onload = function(){
    var timeline = document.getElementById('timeline'),
        primary = document.querySelector('h2');

    var clone = primary.cloneNode(true);
    clone.className = 'sticky';

    window.onscroll = function(){
        if(window.pageYOffset >= timeline.offsetTop) {
            primary.style.visibility = 'hidden';
            timeline.appendChild(clone);
        }else if(primary.style.visibility == 'hidden'){
            primary.style.visibility = 'visible';
            timeline.removeChild(clone);
        }
    };

};
