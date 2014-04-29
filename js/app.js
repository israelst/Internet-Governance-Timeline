window.onscroll = stickElement;
var timeline = document.getElementById('timeline'),
    primary = document.querySelector('h2');

window.onload = function(){
    var it = primary.cloneNode(true);
        it.className = 'clone';

    timeline.appendChild(it);
};

function stickElement(){
    var clone = document.querySelector('.clone');

    if(window.pageYOffset >= timeline.offsetTop) {
        primary.style.visibility = 'hidden';
        clone.style.visibility = 'visible';
        clone.classList.add('stick');
    } else {
        primary.style.visibility = 'visible';
        clone.style.visibility = 'hidden';
        clone.classList.remove('stick');
    }
};

