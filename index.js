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
    ctx: {},
    selected_pixel: {
        x: 0,
        y: 0
    }
};

var init = function(canvas) {
    canvas.height = settings.canvas_height;
    canvas.width = settings.canvas_width;

    if (canvas) {
        var ctx = canvas.getContext('2d');

        state.ctx = ctx;

        ctx.fillStyle = settings.bgcolor;

        ctx.fillRect(0, 0, settings.canvas_width, settings.canvas_height);

        fill_canvas(settings.pixel_color, settings.pixel_size, ctx);
    }
}

var fill_canvas = function(pixel_color, pixel_size, ctx) {
    var ps = settings.padding_size;

    ctx.fillStyle = pixel_color;

    number_of_rects = Math.floor(settings.grid_size / (pixel_size + ps));

    state.pixels = new Array(number_of_rects * number_of_rects);

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
}

var pixelClickHandler = function(event) {
    var x = event.x,
        y = event.y,
        ps = settings.padding_size;

    event.preventDefault();

    var canvas = document.getElementById('canvas');

    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    var raw = (x - ps) / (settings.pixel_size + ps),
        column = (y - ps) / (settings.pixel_size + ps);

    console.log(x + ' ' + y + ' ' + raw + ' ' + column);

    pixel = {
        x: Math.floor(raw),
        y: Math.floor(column)
    };

    selectPixel(pixel);

    console.log(pixel.x + ' ' + pixel.y + ' clicked!');

    colorisePixel(pixel);
}

var colorisePixel = function(pixel) {
    var coords = get_pixel_coords(pixel.x, pixel.y);

    state.ctx.fillStyle = '#' + state.current_color;
    state.ctx.fillRect(coords.x, coords.y, settings.pixel_size, settings.pixel_size);
}

var get_pixel_coords = function(x, y) {
    var ps = settings.padding_size;

    if (typeof y === 'undefined') {
        y = x.y;
        x = x.x;
    }
    return {
        x: ps + x * (settings.pixel_size + ps),
        y: ps + y * (settings.pixel_size + ps)
    };
}

var decimal = function(n) {
    return n - Math.floor(n);
}

var selectPixel = function(pixel) {
    var ss = settings.selection_size;

    unselectCurrentPixel();
    state.ctx.fillStyle = '#FFFFFF';
    var coords = get_pixel_coords(pixel.x, pixel.y);
    state.ctx.fillRect(coords.x - ss, coords.y - ss, settings.pixel_size + ss*2, settings.pixel_size + ss*2);
    state.selected_pixel = pixel;
}

var unselectCurrentPixel = function() {
    var coords = get_pixel_coords(state.selected_pixel),
        ss = settings.selection_size;

    state.ctx.fillStyle = settings.bgcolor;

    console.log('Unselecting' + coords.x + ' ' + coords.y + '...');

    state.ctx.fillRect(coords.x - ss, coords.y - ss, settings.pixel_size + ss*2, ss);
    state.ctx.fillRect(coords.x - ss, coords.y - ss, ss, settings.pixel_size + ss*2);
    state.ctx.fillRect(coords.x - ss, coords.y + settings.pixel_size, settings.pixel_size + ss*2, ss);
    state.ctx.fillRect(coords.x + settings.pixel_size, coords.y - ss, ss, settings.pixel_size + ss*2);
}

$(function() {
    $('#menu').colorpicker({
        select: function(event, color) {
            state.current_color = color.formatted;
            colorisePixel(state.selected_pixel);
            console.log('Selected ' + state.current_color);
        },
    });
    var canvas = document.getElementById('canvas');
    init(canvas);
    canvas.addEventListener('mousedown', pixelClickHandler, false);

})