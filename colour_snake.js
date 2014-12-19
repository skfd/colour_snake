define(['grid', 'menu', 'controls', 'color_converter'],
    function(grid, menu, controls, color_converter) {
        'use strict';

// remove
        // var settings = {
        //     bgcolor: '#111111',
        //     canvas_height: 600,
        //     canvas_width: 600,
        //     grid_size: 500,
        //     padding_size: 2,
        //     pixel_color: '#333333',
        //     pixel_size: 20,
        //     selection_size: 1,
        // };

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
            bgcolor : '#111111',
            canvas_height: 600,
            canvas_width: 600,
            grid_size : 500,
            padding_size : 2,
            pixel_color : '#333333',
            pixel_size : 20,

            on_select : function(colour) {
                console.log(color_converter.hsl_to_formatted(colour));
                state.menu.set_main_color(colour);
            }
        };

        var init = function(element_name) {
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

            state.grid.set_on_select(function(colour) {
                state.menu.set_main_color(colour);
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