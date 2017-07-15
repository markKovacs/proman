
// DOM manipulation - Common Functions:

var app = app || {};

app.common = {
    
    showLoadingModal: function () {
        $('#modal-content').append(`
            <span class="close">&times;</span>
            <h2 class="loading">Loading content...</h2>
            <img class="loading" src="/static/images/loading.gif" alt="Loading">
        `);
        $('#modal-background').show();
    },

    closeButtonListener: function () {
        $('#modal-content').on('click', '.close', function() {
            $('#modal-content').empty();
            $('#modal-background').hide();
            originalBoardTitle = undefined;
            originalBoardDesc = undefined;
        });
    },

    modalBackgroundListener: function () {
        $(window).on('click', function(event) {
            if ($(event.target).attr('id') === 'modal-background') {
                $('#modal-content').empty();
                $('#modal-background').hide();
                originalBoardTitle = undefined;
                originalBoardDesc = undefined;
            }
        });
    },

    toastMessage: function (message) {
        $('#toast').text(message);
        $('#toast').addClass('show');
        setTimeout(function(){ $('#toast').removeClass('show'); }, 3000);
    }
};



