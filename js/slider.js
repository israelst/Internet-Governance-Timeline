window.addEventListener('load', function(){
    var slide = document.getElementById('slide'),
        chosen = document.getElementById('chosen');

    function sticky(){
        chosen.textContent = this.value;
    }
    sticky();
    slide.onchange = sticky;
}, false);

