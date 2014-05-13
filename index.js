require.config({
    paths: {
        jquery : "bower_components/jquery/dist/jquery",
        jqueryui : "bower_components/jquery-ui/ui/jquery-ui.custom",
        colorpicker : "bower_components/jquery.colorpicker/jquery.colorpicker"
    },
    shim: {
        'jqueryui' : ['jquery'],
        'colorpicker' : ['jquery', 'jqueryui']
    }
});

require(['colour_snake'],
    function(snake) {
        snake('#main');
});
