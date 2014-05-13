define(function() {
        'use strict';

        return {
            formatted_to_hsl: function(formatted_color) {
                var splat = formatted_color.replace('hsl(', '').replace(')', '').replace(/%/g,'').split(',');

                var hsl = {
                    h: splat[0] / 100,
                    s: splat[1] / 100/2,
                    l: splat[2] / 100/2
                };

                return hsl;
            },

            hsl_to_formatted : function(hsl) {
                return 'hsl(' + Math.floor(hsl.h*360) + ',' + hsl.s*100 + '%,' + hsl.l*100 + '%)';
            },

            // credit : https://gist.github.com/mnbayazit/6513318
            hue_to_rgb : function(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            },

            hsl_to_rgb : function(h, s, l){
                var r, g, b;
             
                if(s == 0){
                    r = g = b = l; // achromatic
                }else{
                    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                    var p = 2 * l - q;
                    r = this.hue2rgb(p, q, h + 1/3);
                    g = this.hue2rgb(p, q, h);
                    b = this.hue2rgb(p, q, h - 1/3);
                }
             
                return {
                    r: r * 255,
                    g: g * 255,
                    b: b * 255
                };
            },

            rgb_to_hsl : function(r, g, b){
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
        };
});