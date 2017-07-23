
function navListener () {
    $('#menu-container').on('click', function() {
        $(this).toggleClass('menu-change');
        $('#drop-down').children().slideToggle();
    });
}

$(document).ready(navListener());
