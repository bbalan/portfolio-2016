import $ from 'jquery';

// scripts for the B monogram
class Logo {
    constructor() {
        this.$logo          = $('#logo');
        this.$header        = $('#header');
        this.showcaseDelay  = 30000;
        this.logoAnimated   = false;
        this.logoInterval   = undefined;

        if(this.$logo.length == 0) console.log('%cLogo not found!', 'color:red')

        this.$header.on('mouseenter', (e) => { this.logoShowcase() });
    }

    // initial animation
    logoReveal() {
        //console.log('logoReveal()');

        this.logoAnimated = true;
        resetShowcase();

        this.$logo
            .removeClass('stage-1 stage-3')
            .addClass('stage-2');

        window.setTimeout(function() {
            logoAnimated = false;
        }, 400);
    }

    // hide logo (for page transitions)
    logoHide() {
        //console.log('logoHide()');

        this.logoAnimated = true;
        resetShowcase();

        this.$logo
            .removeClass('stage-2')
            .addClass('stage-3');

        window.setTimeout(function() {
            logoAnimated = false;
        }, 400);
    }

    // display all stages of logo animation
    logoShowcase() {
        console.log('logoShowcase()');

        var self = this;

        if(!self.logoAnimated) {
            self.logoAnimated = true;

            self.$logo
                .removeClass('stage-1')
                .removeClass('stage-2')
                .addClass('stage-3');

            window.setTimeout(function() {
                self.$logo
                    .removeClass('stage-3')
                    .addClass('stage-1');

                window.setTimeout(function() {
                    self.$logo
                        .removeClass('stage-1')
                        .addClass('stage-2');

                    window.setTimeout(function() {
                        self.logoAnimated = false;
                        self.resetShowcase();
                    }, 550);
                }, 50);
            }, 450);
        } else {
            console.log('Logo already animated');
        }
    }

    resetShowcase() {
        //console.log('resetShowcase()');

        this.logoInterval = window.clearInterval(this.logoInterval);
        this.logoInterval = window.setInterval(this.logoShowcase, this.showcaseDelay);
    }
}

export default Logo;