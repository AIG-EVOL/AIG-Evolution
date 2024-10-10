/*
    Editorial by HTML5 UP
    html5up.net | @ajlkn
    Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

    var $window = $(window),
        $head = $('head'),
        $body = $('body');

    // Breakpoints.
    breakpoints({
        xlarge:   [ '1281px',  '1680px' ],
        large:    [ '981px',   '1280px' ],
        medium:   [ '737px',   '980px'  ],
        small:    [ '481px',   '736px'  ],
        xsmall:   [ '361px',   '480px'  ],
        xxsmall:  [ null,      '360px'  ],
        'xlarge-to-max':    '(min-width: 1681px)',
        'small-to-xlarge':  '(min-width: 481px) and (max-width: 1680px)'
    });

    // Stops animations/transitions until the page has ...

    // ... loaded.
    $window.on('load', function() {
        window.setTimeout(function() {
            $body.removeClass('is-preload');
        }, 100);
    });

    // ... stopped resizing.
    var resizeTimeout;
    $window.on('resize', function() {
        // Mark as resizing.
        $body.addClass('is-resizing');

        // Unmark after delay.
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            $body.removeClass('is-resizing');
        }, 100);
    });

    // Fixes.

    // Object fit images.
    if (!browser.canUse('object-fit') || browser.name == 'safari') {
        $('.image.object').each(function() {
            var $this = $(this),
                $img = $this.children('img');

            // Hide original image.
            $img.css('opacity', '0');

            // Set background.
            $this.css('background-image', 'url("' + $img.attr('src') + '")')
                .css('background-size', $img.css('object-fit') ? $img.css('object-fit') : 'cover')
                .css('background-position', $img.css('object-position') ? $img.css('object-position') : 'center');
        });
    }

    // Sidebar.
    var $sidebar = $('#sidebar'),
        $sidebar_inner = $sidebar.children('.inner');

    // Inactive by default on <= large.
    breakpoints.on('<=large', function() {
        $sidebar.addClass('inactive');
    });

    breakpoints.on('>large', function() {
        $sidebar.removeClass('inactive');
    });

    // Hack: Workaround for Chrome/Android scrollbar position bug.
    if (browser.os == 'android' && browser.name == 'chrome') {
        $('<style>#sidebar .inner::-webkit-scrollbar { display: none; }</style>').appendTo($head);
    }

    // Toggle.
    $('<a href="#sidebar" class="toggle">Toggle</a>')
        .appendTo($sidebar)
        .on('click', function(event) {
            // Prevent default.
            event.preventDefault();
            event.stopPropagation();

            // Toggle.
            $sidebar.toggleClass('inactive');
        });

    // Events.

    // Link clicks.
    $sidebar.on('click', 'a', function(event) {
        // >large? Bail.
        if (breakpoints.active('>large'))
            return;

        // Vars.
        var $a = $(this),
            href = $a.attr('href'),
            target = $a.attr('target');

        // Prevent default.
        event.preventDefault();
        event.stopPropagation();

        // Check URL.
        if (!href || href == '#' || href == '')
            return;

        // Hide sidebar.
        $sidebar.addClass('inactive');

        // Redirect to href.
        setTimeout(function() {
            if (target == '_blank')
                window.open(href);
            else
                window.location.href = href;
        }, 500);
    });

    // Prevent certain events inside the panel from bubbling.
    $sidebar.on('click touchend touchstart touchmove', function(event) {
        // >large? Bail.
        if (breakpoints.active('>large'))
            return;

        // Prevent propagation.
        event.stopPropagation();
    });

    // Hide panel on body click/tap.
    $body.on('click touchend', function(event) {
        // >large? Bail.
        if (breakpoints.active('>large'))
            return;

        // Deactivate.
        $sidebar.addClass('inactive');
    });

    // Scroll lock.
    $window.on('load.sidebar-lock', function() {
        var sh, wh, st;

        // Reset scroll position to 0 if it's 1.
        if ($window.scrollTop() == 1)
            $window.scrollTop(0);

        $window.on('scroll.sidebar-lock', function() {
            var x, y;

            // <=large? Bail.
            if (breakpoints.active('<=large')) {
                $sidebar_inner.data('locked', 0)
                    .css('position', '')
                    .css('top', '');
                return;
            }

            // Calculate positions.
            x = Math.max(sh - wh, 0);
            y = Math.max(0, $window.scrollTop() - x);

            // Lock/unlock.
            if ($sidebar_inner.data('locked') == 1) {
                if (y <= 0)
                    $sidebar_inner.data('locked', 0).css('position', '').css('top', '');
                else
                    $sidebar_inner.css('top', -1 * x);
            } else {
                if (y > 0)
                    $sidebar_inner.data('locked', 1).css('position', 'fixed').css('top', -1 * x);
            }
        })
        .on('resize.sidebar-lock', function() {
            // Calculate heights.
            wh = $window.height();
            sh = $sidebar_inner.outerHeight() + 30;

            // Trigger scroll.
            $window.trigger('scroll.sidebar-lock');
        })
        .trigger('resize.sidebar-lock');
    });

    // Menu.
    var $menu = $('#menu'),
        $menu_openers = $menu.children('ul').find('.opener');

    // Openers click event.
    $menu_openers.each(function() {
        var $this = $(this);

        // Add click event on each "opener"
        $this.on('click', function(event) {
            event.preventDefault();
            
            // Toggle "active" class
            $this.toggleClass('active');

            // Find associated submenu
            var $submenu = $this.next('ul');
            
            // Open/close the corresponding submenu without animation
            $submenu.toggle(); // Change here to toggle without animation

            // Close other open submenus
            $menu_openers.not($this).each(function() {
                var $otherSubmenu = $(this).next('ul');
                $(this).removeClass('active');
                $otherSubmenu.hide(); // Change here to hide without animation
            });

            // Reset sidebar height if necessary
            $window.triggerHandler('resize.sidebar-lock');
        });
    });

    // Handle opening and closing of submenus and sub-submenus
    $('.opener').click(function(event) {
        event.preventDefault(); // Prevent default action
        event.stopPropagation(); // Stop event propagation

        var $this = $(this);
        var submenu = $this.next('ul'); // Select the next submenu

        // Check if it's a submenu or sub-submenu
        if (submenu.length) {
            // If it's a sub-submenu, do not affect other submenus opened
            if ($this.closest('ul').parent().hasClass('opener')) {
                // Only close other sub-submenus (SSmenu) in the same submenu (Smenu)
                $this.closest('li').siblings().find('ul').hide(); // Change here to hide without animation
            } else {
                // Close other submenus (Smenu) at the same level
                $this.closest('ul').find('.opener').not($this).removeClass('active').next('ul').hide(); // Change here to hide without animation
            }

            // Toggle opening of the submenu or sub-submenu without animation
            submenu.toggle();
            $this.toggleClass('active');
        }
    });

})(jQuery);
