define(['jquery', 'color_converter'],
    function(___, color_converter) {
        'use strict';

        return function(element_name, config) {
            var canvas_element,
                ctx,
                settings;

            var state = {
                main_color : {},
                shadow_color: {},
                highlight_color: {},

                clicked: false,
                canvas: {},
                selected_pixel: {
                    x: 0,
                    y: 0
                },
            };

            var default_config = {
                canvas_width: 600,
                canvas_height: 600,
                bgcolor: '#111111',
                pixel_color: '#333333',
                pixel_size: 20,
                selection_size: 1,

                padding_size: 2,
                grid_size: 500,
            };

            var build_grid = function() {
                var ps = settings.padding_size;
                var pixel_size = settings.pixel_size;

                ctx.fillStyle = settings.pixel_color;

                var number_of_rects = Math.floor(settings.grid_size / (pixel_size + ps));

                for (var i = 0; i < number_of_rects; i++) {
                    for (var j = 0; j < number_of_rects; j++) {
                        ctx.fillRect(
                            ps + j * (pixel_size + ps),
                            ps + i * (pixel_size + ps),
                            pixel_size,
                            pixel_size
                        );
                    }
                }
            };

            var clickHandler = function(event) {
                var x = event.x,
                    y = event.y,
                    is_right_click = event.button == 2;

                event.preventDefault();

                var pixel = getPixelByCoords(x, y);

                console.log(pixel.x + ' ' + pixel.y + ' clicked!');

                if (is_right_click) {
                    state.clicked = 'right';
                    blackenPixel(pixel);
                    return false;
                } else {
                    state.clicked = 'left';
                    config.on_select(getPixelColour(pixel));
                }

                selectPixel(pixel);

            };

            var unclickHandler = function() {
                state.clicked = null;
            };

            var mouseMoveHandler = function(event) {
                var pixel = getPixelByCoords(event.x, event.y);

                if (!state.clicked) {
                    return;
                }

                if (state.clicked == 'right') {
                    blackenPixel(pixel);
                }
            };

            var getPixelByCoords = function(x, y) {
                var ps = settings.padding_size;

                x -= canvas_element.offsetLeft;
                y -= canvas_element.offsetTop;

                var raw = (x - ps) / (settings.pixel_size + ps),
                    column = (y - ps) / (settings.pixel_size + ps);

                var pixel = {
                    x: Math.floor(raw),
                    y: Math.floor(column)
                };

                return pixel;
            };

            var blackenPixel = function(pixel) {
                colorisePixel(pixel, settings.pixel_color.replace('#', ''));
            };

            var selectPixel = function(pixel) {
                var ss = settings.selection_size;

                unselectCurrentPixel();

                //TODO: get color from selected
                //var current_color_hsl = getPixelColour(pixel);
                //$('#main_colour').colorpicker('setColor', hslToString(current_color_hsl));

                ctx.fillStyle = '#FFFFFF';
                var coords = getCoordsByPixel(pixel.x, pixel.y);

                ctx.fillRect(coords.x - ss, coords.y - ss, settings.pixel_size + ss * 2, ss);
                ctx.fillRect(coords.x - ss, coords.y - ss, ss, settings.pixel_size + ss * 2);
                ctx.fillRect(coords.x - ss, coords.y + settings.pixel_size, settings.pixel_size + ss * 2, ss);
                ctx.fillRect(coords.x + settings.pixel_size, coords.y - ss, ss, settings.pixel_size + ss * 2);

                state.selected_pixel = pixel;
            };

            var colorisePixel = function(pixel, colour) {
                colour = colour || state.main_color;

                var coords = getCoordsByPixel(pixel.x, pixel.y);

                if (colour.h) {
                    ctx.fillStyle = color_converter.hsl_to_formatted(colour);

                } else {
                    ctx.fillStyle = '#' + colour;
                }

                ctx.fillRect(coords.x, coords.y, settings.pixel_size, settings.pixel_size);
            };


            var unselectCurrentPixel = function() {
                if (!state.selected_pixel) {
                    return;
                }

                var coords = getCoordsByPixel(state.selected_pixel),
                    ss = settings.selection_size;

                ctx.fillStyle = settings.bgcolor;

                console.log('Unselecting' + coords.x + ' ' + coords.y + '...');

                ctx.fillRect(coords.x - ss, coords.y - ss, settings.pixel_size + ss * 2, ss);
                ctx.fillRect(coords.x - ss, coords.y - ss, ss, settings.pixel_size + ss * 2);
                ctx.fillRect(coords.x - ss, coords.y + settings.pixel_size, settings.pixel_size + ss * 2, ss);
                ctx.fillRect(coords.x + settings.pixel_size, coords.y - ss, ss, settings.pixel_size + ss * 2);

                //TODO: unselect state.selected_pixel;
            };



            var getCoordsByPixel = function(x, y) {
                var ps = settings.padding_size;

                if (typeof y === 'undefined') {
                    y = x.y;
                    x = x.x;
                }
                return {
                    x: ps + x * (settings.pixel_size + ps),
                    y: ps + y * (settings.pixel_size + ps)
                };
            };

            var getPixelColour = function(pixel) {
                var coords = getCoordsByPixel(pixel);
                var data = ctx.getImageData(coords.x + 1, coords.y + 1, 1, 1).data;
                return color_converter.rgb_to_hsl(data[0], data[1], data[2]);
            };

            var set_on_select = function(callback) {
                state.on_select = callback;
            };

            var buildShadowLeft = function(pixel) {
                buildToneInDirection(pixel, 14, - 0.14, -1, 0);
            };

            var buildHighlightRight = function(pixel) {
                buildToneInDirection(pixel, 14, 0.14, 1, 0);
            };

            var buildToneInDirection = function(pixel, hue_inc, luminosity_inc, direction_x, direction_y) {
                // var shadowBlock:PaletteBlock = mBlocks[mSelectedBlock.mColumn-1][mSelectedBlock.mRow];
                // shadowBlock.mColor.Hue = mSelectedBlock.mColor.Hue + FP.sign(mShadowSlider.mShadowColor - mSelectedBlock.mColor.Hue) * 14;
                // shadowBlock.mColor.Luminance = mSelectedBlock.mColor.Luminance - .14;
                // shadowBlock.mColor.Saturation = mSelectedBlock.mColor.Saturation;

                // mSelectedBlock = shadowBlock;

                var target_pixel = {
                    x: pixel.x + direction_x,
                    y: pixel.y + direction_y
                },
                    source_colour = getPixelColour(state.selected_pixel);

                if (target_pixel.x < 0) {
                    return;
                }

                var sign = (state.shadow_color.h - source_colour.h >= 0) ? 1 : -1;

                var colour = {
                    h: source_colour.h + sign * hue_inc/360,
                    s: source_colour.s,
                    l: source_colour.l + luminosity_inc
                };

                //var rgb = hslToRgb(colour.h, colour.s, colour.l);

                colorisePixel(target_pixel, colour);

                selectPixel(target_pixel);
            };

            var build_left = function(){
                buildShadowLeft(state.selected_pixel);
            };

            var build_right = function(){
                buildHighlightRight(state.selected_pixel);
            };

            var build_up = function(){};
            var build_down = function(){};

            var set_main_color = function(color){
                state.main_color = color;
                colorisePixel(state.selected_pixel, color);
            };
            var set_highlight_color = function(){};
            var set_shadow_color = function(){};


            // sdasdasd
            // dfwefwfwe
            // sdfsdfsdfsdfs
            settings = $.extend({}, default_config, config);

            canvas_element = $(element_name).get(0);

            canvas_element.width = settings.canvas_width;
            canvas_element.height = settings.canvas_height;

            ctx = canvas_element.getContext('2d');

            ctx.fillStyle = settings.bgcolor;

            ctx.fillRect(0, 0, settings.canvas_width, settings.canvas_height);

            build_grid(ctx, settings);

            canvas_element.addEventListener('mousedown', clickHandler, false);
            canvas_element.addEventListener('mouseup', unclickHandler, false);
            canvas_element.addEventListener('mousemove', mouseMoveHandler, false);

            canvas_element.oncontextmenu = function() {
                return false;
            };

            return {
                build_left: build_left,
                build_right: build_right,
                build_up : build_up,
                build_down : build_down,

                set_on_select : set_on_select,
                set_main_color : set_main_color,
                set_highlight_color : set_highlight_color,
                set_shadow_color : set_shadow_color
            };
        };
    });