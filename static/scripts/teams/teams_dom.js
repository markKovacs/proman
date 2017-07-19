
// DOM manipulation related to teams

var app = app || {};

app.teams = {
    
    selectButtonListener: function () {
        $('#select-button').on('click', function() {
            $('#category-input').hide();
            $('#category-input').prop('disabled', true);
            $('#category-select').show();
            $('#category-select').prop('disabled', false);
            $(this).addClass('pressed');
            $('#add-button').removeClass('pressed');
        });
    },

    addNewButtonListener: function () {
        $('#add-button').on('click', function() {
            $('#category-select').hide();
            $('#category-select').prop('disabled', true);
            $('#category-input').show();
            $('#category-input').prop('disabled', false);
            $(this).addClass('pressed');
            $('#select-button').removeClass('pressed');
        });
    }
};
