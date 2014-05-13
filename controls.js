define(['bower_components/mousetrap/mousetrap'],
    function(mousetrap) {
        'use strict';


        return {
            on_left: function(callback) {
                mousetrap.bind('left', callback);
            },
            on_right: function(callback) {
                mousetrap.bind('right', callback);
            },
            on_up: function(callback) {
                mousetrap.bind('up', callback);
            },
            on_down: function(callback) {
                mousetrap.bind('down', callback);
            },
        }
});