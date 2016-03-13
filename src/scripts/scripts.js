// misc site scripts

$(function() {
    var $b = $('body'),
        $w = $(window),
        timer;

    window.addEventListener('scroll', function() {
        clearTimeout(timer);

        $b.addClass('disable-hover');

        timer = setTimeout(function(){
            $b.removeClass('disable-hover');
        }, 200);

        // check whether to animate the header
        if($w.scrollTop() == 0) {
            $b.addClass('scroll-top');
        } else {
            $b.removeClass('scroll-top');
        }
    }, false);

    $(document).on('click', '.info', function(e) {
        e.preventDefault();
        e.returnValue = false;

        $b.removeClass('hide-copy');

        return false;
    });

    if(!Modernizr.csstransitions) {
        $b.addClass('no-css-transitions');
    }

    if(Modernizr.webgl) {
        $('body').addClass('webgl'); // webgl css
    } else {
        $('body').addClass('no-webgl'); // webgl css
    }
});