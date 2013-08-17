;(function ($) {
    $.fn.ticker = function (settings) {
        var me = this;

        var defaultSettings = {
            gapWidth: 20,
            speed: 5
        };

        settings = $.extend(defaultSettings, settings);

        me.each(function (i, outerElement) {
            var $outerElement = $(outerElement),
                totalWidth    = 0,
                $wrapper      = $('<div></div>'),
                childCount    = $outerElement.children().length,
                animation;

            // initialise wrapping element
            $wrapper.insertBefore($outerElement);
            $outerElement.appendTo($wrapper);

            // initialise wrapper element styling
            $wrapper.css({
                width: $wrapper.innerWidth(),
                overflow: 'hidden'
            });

            // initialise inner element float styling
            $outerElement.children().css({
                float: 'left',
                marginRight: settings.gapWidth
            });

            // duplicate all child elements
            $outerElement.children().each(function (i, innerElement) {
                var $innerElement = $(innerElement);

                $innerElement.clone().appendTo($outerElement);
            });

            // calculate width of all child elements
            $outerElement.children().each(function (i, innerElement) {
                var $innerElement = $(innerElement);

                totalWidth += $innerElement.outerWidth() + settings.gapWidth;
            });

            // initialise outer element styling
            $outerElement.css({
                width: totalWidth
            });

            // detect CSS animation support
            function detectAnimation()
            {
                // taken from https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Using_CSS_animations/Detecting_CSS_animation_support
                var elm = $outerElement[0],
                    animation = false,
                    animationstring = 'animation',
                    keyframeprefix = '',
                    domPrefixes = ['Webkit', 'Moz', 'O', 'ms', 'Khtml'],
                    pfx  = '';

                if (elm.style.animationName) {
                    animation = true;
                }

                if (animation === false) {
                    for (var prefixIndex = 0; prefixIndex < domPrefixes.length; prefixIndex++) {
                        if (elm.style[domPrefixes[prefixIndex] + 'AnimationName' ] !== undefined) {
                            pfx = domPrefixes[prefixIndex];
                            animationstring = pfx + 'Animation';
                            keyframeprefix = '-' + pfx.toLowerCase() + '-';
                            animation = true;
                            break;
                        }
                    }
                }

                return animation;
            }

            animation = detectAnimation();

            if (!animation) {
                function startAnimation()
                {
                    $outerElement.css({
                        marginLeft: 0
                    }).animate({
                        marginLeft: -(totalWidth / 2)
                    }, settings.speed * childCount * 1000, 'linear', function () {
                        startAnimation();
                    });
                }

                startAnimation();
            } else {
                $('<style>@-webkit-keyframes tickerAnimation { from { margin-left:0; } to { margin-left: -' + (totalWidth / 2) + 'px; } }</style>').appendTo('head');
                $('<style>@-moz-keyframes tickerAnimation { from { margin-left:0; } to { margin-left: -' + (totalWidth / 2) + 'px; } }</style>').appendTo('head');
                $('<style>@-o-keyframes tickerAnimation { from { margin-left:0; } to { margin-left: -' + (totalWidth / 2) + 'px; } }</style>').appendTo('head');
                $('<style>@-msie-keyframes tickerAnimation { from { margin-left:0; } to { margin-left: -' + (totalWidth / 2) + 'px; } }</style>').appendTo('head');
                $('<style>@keyframes tickerAnimation { from { margin-left:0; } to { margin-left: -' + (totalWidth / 2) + 'px; } }</style>').appendTo('head');

                $outerElement.css({
                    '-webkit-animation': 'tickerAnimation ' + (settings.speed * childCount) + 's infinite linear',
                    '-moz-animation': 'tickerAnimation ' + (settings.speed * childCount) + 's infinite linear',
                    '-o-animation': 'tickerAnimation ' + (settings.speed * childCount) + 's infinite linear',
                    '-msie-animation': 'tickerAnimation ' + (settings.speed * childCount) + 's infinite linear',
                    animation: 'tickerAnimation ' + (settings.speed * childCount) + 's infinite linear'
                });
            }

            // set up hover functions to pause animation
            if (animation) {
                // pause css3 animation
                $outerElement.hover(function () {
                    $(this).css({
                        animationPlayState: 'paused'
                    });
                }, function () {
                    $(this).css({
                        animationPlayState: 'running'
                    });
                });
            } else {
                // todo: pause jQuery animation
            }
        });
    };
})(jQuery);
