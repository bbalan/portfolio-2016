// scripts for the B monogram

$(function() {
    var $logo = $('#logo'),
        $header = $('#header'),
        showcaseDelay = 30000,
        logoAnimated = false,
        logoInterval = undefined;

    // initial animation
    function logoReveal() {
        //console.log('logoReveal()');

        logoAnimated = true;
        resetShowcase();

        $logo
            .removeClass('stage-1 stage-3')
            .addClass('stage-2');

        window.setTimeout(function() {
            logoAnimated = false;
        }, 400);

    }

    // hide logo (for page transitions)
    function logoHide() {
        //console.log('logoHide()');

        logoAnimated = true;
        resetShowcase();

        $logo
            .removeClass('stage-2')
            .addClass('stage-3');

        window.setTimeout(function() {
            logoAnimated = false;
        }, 400);
    }

    // display all stages of logo animation
    function logoShowcase() {
        console.log('logoShowcase()');

        if(!logoAnimated) {
            logoAnimated = true;

            $logo
                .removeClass('stage-1')
                .removeClass('stage-2')
                .addClass('stage-3');

            window.setTimeout(function() {
                $logo
                    .removeClass('stage-3')
                    .addClass('stage-1');

                window.setTimeout(function() {
                    $logo
                        .removeClass('stage-1')
                        .addClass('stage-2');

                    window.setTimeout(function() {
                        logoAnimated = false;
                        resetShowcase();
                    }, 550);
                }, 50);
            }, 450);
        } else {
            console.log('Logo already animated');
        }
    }

    function resetShowcase() {
        //console.log('resetShowcase()');

        logoInterval = window.clearInterval(logoInterval);
        logoInterval = window.setInterval(logoShowcase, showcaseDelay);
    }

    //$(window).load(logoReveal);
    $header.on('mouseenter', logoShowcase);
    //$(document).on('page-transition-complete', logoHide);
    //$(document).on('page-transition-full', logoHide);
});