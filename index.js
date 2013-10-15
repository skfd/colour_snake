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

var clickHandler = function(event) {
    var x = event.x,
        y = event.y,
        is_right_click = event.button == 2;
    ps = settings.padding_size;

    event.preventDefault();


    pixel = getPixelByCoords(x, y);

    console.log(pixel.x + ' ' + pixel.y + ' clicked!');

    if (is_right_click) {
        state.clicked = 'right';
        blackenPixel(pixel);
        return false;
    } else {
        state.clicked = 'left';
    }

    selectPixel(pixel);

    colorisePixel(pixel);
}

var getPixelByCoords = function(x, y) {
    var canvas = document.getElementById('canvas');
    var ps = settings.padding_size;

    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    var raw = (x - ps) / (settings.pixel_size + ps),
        column = (y - ps) / (settings.pixel_size + ps);

    pixel = {
        x: Math.floor(raw),
        y: Math.floor(column)
    };

    return pixel;
}

var blackenPixel = function(pixel) {
    colorisePixel(pixel, settings.pixel_color.replace('#', ''));
}
var colorisePixel = function(pixel, colour) {
    colour = colour || state.current_color;

    var coords = getCoordsByPixel(pixel.x, pixel.y);

    if (colour.h) {
        state.ctx.fillStyle = hslToString(colour);

    } else {
        state.ctx.fillStyle = '#' + colour;
    }

    state.ctx.fillRect(coords.x, coords.y, settings.pixel_size, settings.pixel_size);
}

var hslToString = function(colour) {
    return 'hsl(' + Math.floor(colour.h*360) + ',' + colour.s*100 + '%,' + colour.l*100 + '%)';
}

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
}

var decimal = function(n) {
    return n - Math.floor(n);
}

var selectPixel = function(pixel) {
    var ss = settings.selection_size;

    unselectCurrentPixel();

    //TODO: get color from selected
    //var current_color_hsl = getPixelColour(pixel);
    //$('#main_colour').colorpicker('setColor', hslToString(current_color_hsl));

    state.ctx.fillStyle = '#FFFFFF';
    var coords = getCoordsByPixel(pixel.x, pixel.y);
    
    state.ctx.fillRect(coords.x - ss, coords.y - ss, settings.pixel_size + ss * 2, ss);
    state.ctx.fillRect(coords.x - ss, coords.y - ss, ss, settings.pixel_size + ss * 2);
    state.ctx.fillRect(coords.x - ss, coords.y + settings.pixel_size, settings.pixel_size + ss * 2, ss);
    state.ctx.fillRect(coords.x + settings.pixel_size, coords.y - ss, ss, settings.pixel_size + ss * 2);

    state.selected_pixel = pixel;
}

var unselectCurrentPixel = function() {
    var coords = getCoordsByPixel(state.selected_pixel),
        ss = settings.selection_size;

    state.ctx.fillStyle = settings.bgcolor;

    console.log('Unselecting' + coords.x + ' ' + coords.y + '...');

    state.ctx.fillRect(coords.x - ss, coords.y - ss, settings.pixel_size + ss * 2, ss);
    state.ctx.fillRect(coords.x - ss, coords.y - ss, ss, settings.pixel_size + ss * 2);
    state.ctx.fillRect(coords.x - ss, coords.y + settings.pixel_size, settings.pixel_size + ss * 2, ss);
    state.ctx.fillRect(coords.x + settings.pixel_size, coords.y - ss, ss, settings.pixel_size + ss * 2);

    //TODO: unselect state.selected_pixel;
}

var mouseMoveHandler = function(event) {
    var pixel = getPixelByCoords(event.x, event.y);

    if (!state.clicked) {
        return;
    }

    if (state.clicked == 'left') {
        colorisePixel(pixel);
    }

    if (state.clicked == 'right') {
        blackenPixel(pixel);
    }
}

var unclickHandler = function() {
    state.clicked = null;
}

var getPixelColour = function(pixel) {
    var coords = getCoordsByPixel(pixel);
    var data = state.ctx.getImageData(coords.x+1, coords.y+1, 1, 1).data;
    return rgbToHsl(data[0], data[1], data[2]);
}

var buildShadowLeft = function(pixel) {
    // var shadowBlock:PaletteBlock = mBlocks[mSelectedBlock.mColumn-1][mSelectedBlock.mRow];
    // shadowBlock.mColor.Hue = mSelectedBlock.mColor.Hue + FP.sign(mShadowSlider.mShadowColor - mSelectedBlock.mColor.Hue) * 14;
    // shadowBlock.mColor.Luminance = mSelectedBlock.mColor.Luminance - .14;
    // shadowBlock.mColor.Saturation = mSelectedBlock.mColor.Saturation;

    // mSelectedBlock = shadowBlock;

    var target_pixel = {
        x: pixel.x - 1,
        y: pixel.y
    },
        source_colour = getPixelColour(state.selected_pixel);

    if (target_pixel.x < 0) {
        return;
    }

    var sign = (state.current_shadow.h - source_colour.h >= 0) ? 1 : -1;

    var colour = {
        h: source_colour.h + sign * 14/360,
        s: source_colour.s,
        l: source_colour.l - 0.14
    };

    //var rgb = hslToRgb(colour.h, colour.s, colour.l);

    colorisePixel(target_pixel, colour);

    selectPixel(target_pixel);
}

$(function() {
    var main = $('#main_colour').colorpicker({
        parts: ['map', 'bar', 'hsv', 'rgb', 'footer', 'hex'],
        color: '00db31',
        select: function(event, color) {
            state.current_color = color.formatted;
            colorisePixel(state.selected_pixel);
            console.log('Selected ' + state.current_color);
        },
    });

    state.current_color = '00db31';

    $('#shadow_colour').colorpicker({
        parts: ['bar', 'hsv', 'rgb', 'footer'],
        color: 'blue',
        colorFormat: 'HSL%',
        select: function(event, color) {
            var splat = color.formatted.replace('hsl(', '').replace(')', '').replace(/%/g,'').split(',');

            state.current_shadow = {
                h: splat[0] / 100,
                s: splat[1] / 100 /2,
                l: splat[2] / 100 /2
            };
            var format = 'background:'+ hslToString(state.current_shadow);
            console.log('%c Oh my heavens! ', format);
        }
    });
    state.current_shadow = {h: 0.66015625, s: 1, l: 1};

    $('#highlight_colour').colorpicker({
        parts: ['bar', 'hsv', 'rgb'],
        color: 'yellow',
        colorFormat: 'HSL%',
        select: function(event, color) {
            var splat = color.formatted.replace('hsl(', '').replace(')', '').replace(/%/g,'').split(',');

            state.current_highlight = {
                h: splat[0] / 100,
                s: splat[1] / 100/2,
                l: splat[2] / 100/2
            };
            console.log('%c Oh my hells! ', 'background:'+ hslToString(state.current_highlight));

        }
    });
    state.current_highlight = {h: 0.16796875, s: 1, l: 1};

    var canvas = document.getElementById('canvas');

    init(canvas);

    canvas.addEventListener('mousedown', clickHandler, false);
    canvas.addEventListener('mouseup', unclickHandler, false);

    canvas.addEventListener('mousemove', mouseMoveHandler, false);

    canvas.oncontextmenu = function() {
        return false;
    }

    $('#left').click(function() {
        buildShadowLeft(state.selected_pixel);
    });

    $('#right').click(function() {
        
    });
})

// credit : http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion

hslToRgb = function(h, s, l){
    var r, g, b;
 
    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }
 
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
 
    return {
        r: r * 255,
        g: g * 255,
        b: b * 255
    };
}

rgbToHsl = function(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
 
    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
 
    return {
        h: h,
        s: s,
        l: l
    };
}