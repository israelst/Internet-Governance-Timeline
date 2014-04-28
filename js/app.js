window.onscroll = stickElement;

var timeline = document.querySelector('#timeline'),
    clone = document.querySelector('.clone'),
    primary = document.querySelector('.primary');

function stickElement(){
    if(window.pageYOffset >= 460) {
        primary.style.opacity = 0;
        clone.style.display = 'block';
        clone.classList.add('stick');
    } else {
        primary.style.opacity = 1;
        clone.style.display = 'none';
        clone.classList.remove('stick');
    }
};

