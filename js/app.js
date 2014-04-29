window.onscroll = stickElement;
var timeline = document.getElementById('timeline');

window.onload = function(){
    var it = document.querySelector('h2').cloneNode(true);
        it.className = 'clone';

    timeline.appendChild(it);
};

function stickElement(){
    var clone = document.querySelector('.clone'),
        primary = document.querySelector('.primary');

    if(window.pageYOffset >= timeline.offsetTop) {
        primary.style.visibility = 'hidden';
        clone.style.display = 'block';
        clone.classList.add('stick');
    } else {
        primary.style.visibility = 'visible';
        clone.style.display = 'none';
        clone.classList.remove('stick');
    }
};

