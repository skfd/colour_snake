define(function() {
    'use strict';
    


    return function(element_name, settings){

        var canvas_element,
            ctx;

        var build_grid = function(ctx, current_config) {
            var ps = current_config.padding_size;
            var pixel_size = current_config.pixel_size;

            ctx.fillStyle = current_config.pixel_color;

            var number_of_rects = Math.floor(current_config.grid_size / (pixel_size + ps));

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

        };
    };
});