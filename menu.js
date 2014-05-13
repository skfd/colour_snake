define(['jquery', 'jqueryui', 'colorpicker'],
    function() {
        'use strict';

        var default_config = {
            main_tag : '#main_colour',
            highlight_tag : '#highlight_colour',
            shadow_tag : '#shadow_colour',
            main_color : '00db31',
            highlight_color : {h: 0.16796875, s: 1, l: 1},
            shadow_color: {h: 0.66015625, s: 1, l: 1},
            on_main: function(){},
            on_highlight: function(){},
            on_shadow: function(){},
        };


        var init_main_color = function (config) {
            $(config.main_tag).colorpicker({
                parts: ['map', 'bar', 'hsv', 'rgb', 'footer', 'hex'],
                color: config.main_color,
                select: config.on_main,
            });
        };

        var init_highlight_color = function (config) {
            $(config.highlight_tag).colorpicker({
                parts: ['bar', 'hsv', 'rgb'],
                color: config.highlight_color,
                colorFormat: 'HSL%',
                select: config.on_highlight
            });
        };

        var init_shadow_color = function (config) {
            $(config.shadow_tag).colorpicker({
                parts: ['bar', 'hsv', 'rgb', 'footer'],
                color: config.shadow_color,
                colorFormat: 'HSL%',
                select: config.on_shadow
            });
        };


        return function(config) {
            var current_config = $.extend( {}, default_config, config );

            init_main_color(current_config);

            init_shadow_color(current_config);

            init_highlight_color(current_config);

            return {
                set_main_color : function(color) {
                    $(current_config.main_tag).colorpicker('setColor', color);
                }
            };
        };
});