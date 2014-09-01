window.addEventListener('load', function(){
    var primary = document.getElementById('tool-bar'),
        offset = primary.offsetTop;

    function sticky(){
        var isVisible = primary.className === 'sticky';
        if(window.pageYOffset >= offset){
            if(!isVisible){
                primary.className = 'sticky';
                primary.nextElementSibling.style.marginTop = primary.clientHeight + 'px';
            }
        }else if(isVisible){
            primary.className = '';
            primary.nextElementSibling.style.marginTop = '0px';
        }
    }
    sticky();
    window.onscroll = sticky;
}, false);

