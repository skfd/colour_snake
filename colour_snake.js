define(['grid', 'menu', 'controls', 'color_converter'],
    function(grid, menu, controls, color_converter) {
        'use strict';

        var settings = {
            canvas_width: 600,
            canvas_height: 600,
            grid_size: 500,
            pixel_size: 20,
            bgcolor: '#111111',
            pixel_color: '#333333',
            selection_size: 1,
            padding_size: 2
        };

        var state = {
            pixels: [],
            current_color: 'ff33ee',
            grid: {},
            selected_pixel: {
                x: 0,
                y: 0
            }
        };

        var grid_config = {
            canvas_width: 600,
            canvas_height: 600,
            bgcolor : '#111111',
            pixel_color : '#333333',
            pixel_size : 20,

            padding_size : 2,
            grid_size : 500,
        };

        var html = '<canvas id="canvas"></canvas><div id="menu"><h2>Main colour</h2><div id="main_colour"></div><div class="helper"><h2>Shadow colour</h2><div id="shadow_colour"></div></div><div class="helper"><h2>Highlight colour</h2><div id="highlight_colour"></div></div><div id="buttons"><button id="clear">CLEAR</button><button id="left">left</button><button id="right">right</button><button id="up">up</button><button id="down">down</button></div></div>';

        var init = function(element_name) {
            $(element_name).html(html);

            // init grid
            state.grid = grid( '#canvas', grid_config);

            var menu_config = {
                on_main: function(event, color) {
                    state.current_color = color.formatted;

                    state.grid.set_main_color(state.current_color);
                },

                on_highlight: function(event, color) {
                    var hsl = color_converter.formatted_to_hsl(color.formatted);
                    state.current_highlight = hsl;
                    state.grid.set_highlight_color(hsl);

                },

                on_shadow:  function(event, color) {
                    var hsl = color_converter.formatted_to_hsl(color.formatted);
                    state.current_shadow = hsl;
                    state.grid.set_shadow_color(hsl);
                }
            };

            state.current_color = '00db31';
            state.current_shadow = {h: 0.66015625, s: 1, l: 1};
            state.current_highlight = {h: 0.16796875, s: 1, l: 1};

            state.grid.set_main_color(state.current_color);
            state.grid.set_shadow_color(state.current_shadow);
            state.grid.set_highlight_color(state.current_highlight);

            // init menu
            state.menu = menu(menu_config);

            state.grid.set_on_select(function(color) {
                state.menu.set_main_color(color);
            });




            // init controls
            controls.on_left(function() {
                state.grid.build_left();
            });

            controls.on_right(function() {
                state.grid.build_right();
            });

            controls.on_up(function() {
                state.grid.build_up();
            });

            controls.on_down(function() {
                state.grid.build_down();
            });


            // $('#left').click(function() {
            //     state.grid.build_left();
            // });

            // $('#right').click(function() {
            //     state.grid.build_right();
            // });
        };

        return function(element_name){
            init(element_name);
        };
});