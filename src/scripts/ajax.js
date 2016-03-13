// ajax scripts
$(function() {

    var $body = $('body'),
        $document = $(document),
        $content = $('#content'),
        inTransition = false,

        transitionInDelay = 750,
        transitionOutDelay = 800,

        spinOpts = {
          lines: 8, 
          length: 4,
          width: 2, 
          radius: 8,
          corners: 1,
          rotate: 0, 
          direction: 1, 
          color: '#FFF', 
          speed: 1.8,
          trail: 60, 
          shadow: false, 
          hwaccel: true, 
          className: 'spinner', 
          zIndex: 2e9, 
          top: '50%', 
          left: '50%'
        };

    // save ajax-able content from first page visit into history state
    var initialHTML = $('#content').html();

    if(Modernizr.history) {
        window.history.replaceState(
            { html: initialHTML, pageTitle: document.title }, 
            document.title, 
            window.location.href
        );   
    }

    // let the page settle down before executing intro transition
    $(function() {
        window.setTimeout(function() {
            $body.removeClass('transition-hidden transition-first').addClass('transition-in');
            $document.trigger('transition-complete');
        }, 500);

        window.setTimeout(function() {
            $body.removeClass('transition-in');
        }, transitionInDelay);
    });

    // update page with arbitrary html
    function doTransition(html, pageTitle) {

        console.log('doTransition()');

        document.title = pageTitle;

        // hide content
        $body
            .removeClass('transition-hidden')
            .removeClass('transition-in')
            .addClass('transition-out');

        var delay = 0;

        // hide page and update #content
        window.setTimeout(function() {
            $body
                .removeClass('transition-out')
                .addClass('transition-hidden hide-copy');

            $content.children().remove();
            $content.html(html);

            $('.loader').spin(spinOpts);

            carousel();
            revealImages();

            $(window).scrollTop(0);
        }, delay += transitionOutDelay);

        // reveal page
        window.setTimeout(function() {
            $('.transition-now').removeClass('transition-now');
            
            $body
                .removeClass('transition-hidden')
                .addClass('transition-in');
            $document.trigger('transition-complete');
        }, delay += 50);

        // update flag
        window.setTimeout(function() {
            $body.removeClass('transition-in');
            inTransition = false;
        }, delay += transitionInDelay);
    }

    function updateHistory(e) {
        //console.log('updateHistory');
        //console.log(e.state);

        e.preventDefault();
        e.returnValue = false;

        if(e.state != null) {
            doTransition(e.state.html, e.state.pageTitle);
        } else {
            console.log('null');
        }

        return false;
    }

    function doAjax(e) {
        var $t = $(this);

        $t.addClass('transition-now');

        // if window.history is a thing, use ajax
        if(Modernizr.history) {
            e.preventDefault();
            e.returnValue = false;

            if(!inTransition) { // a transition has already been called

                var url = $t.attr('href');
                inTransition = true;

                try {
                    ga( 'send', 
                        { 
                            'hitType': 'pageview', 
                            'page': url
                        }
                    );
                } catch(e) {
                    console.log('Google Analytics is unavailable.');
                }

                $.ajax(url, {
                    complete: function(response) {
                        console.log('ajax.complete');
                        //console.log(response);

                        var $responseText = $(response.responseText),
                            html = $responseText.find('#content').html()
                            title = response.responseText.match(/<title>(.*?)<\/title>/)[1];

                        window.history.pushState({html:html, pageTitle: title}, '', url);
                        doTransition(html, title);
                    },
                    error: function() {
                        console.log('ajax.error @ ' + url);
                        inTransition = false;
                    }
                });
            } else {
                console.log('Already in a page transition.');
            }

            return false;
        } // otherwise, just follow the link
    }

    function revealImages() {
        $('.screenshot img').each(function() {
            var $self = $(this),
                $parent = $self.parents('.loader');
            $self.on('load', function() {
                $self.addClass('visible');
                $parent.removeClass('loader').spin(false);
            });

            $self.attr('src', $self.attr('data-src'));
        });
    }

    function carousel() {

        $('.carousel').each(function() {
            var $self = $(this),
                desktopFrames = $self.attr('data-desktop-frames') || 3;

            $self.owlCarousel({
                autoplay: true,
                autoplayHoverPause: true,
                autoplayTimeout: 4000,
                smartSpeed: getRandomInt(1700, 2300), // keep carousels out of sync
                loop:true,
                margin:10,
                responsiveClass:true,
                mouseDrag: true,
                touchDrag: true,
                responsive:{
                    0:{
                        items:1,
                        mouseDrag: true,
                        touchDrag: true
                    },
                    883:{
                        items:2,
                        loop: true,
                        mouseDrag: true,
                        touchDrag: true,
                        autoplay: false
                    },
                    1280:{
                        items:desktopFrames,
                        loop: false,
                        mouseDrag: false,
                        touchDrag: false,
                        autoplay: false
                    }
                }
            });
        });
    }

    $(document).on('click', '.ajax-link', doAjax);
    $('.loader').spin(spinOpts);

    carousel();
    revealImages();

    if(Modernizr.history) {
        window.onpopstate = updateHistory;
    }
});

// resize kia container using 3d transforms
function kiaFit() {
    var $kia = $('#kia-wrapper');

    if($kia.length) {
        fit($kia[0], $('#screenshots')[0], { watch: true });
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}