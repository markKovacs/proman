
// DOM manipulation related to teams

var app = app || {};

app.teams = {
    
    selectButtonListener: function () {
        $('#select-button').on('click', function() {
            $('#category-input').hide();
            $('#category-input').prop('disabled', true);
            $('#category-select').show();
            $('#category-select').prop('disabled', false);
            $('#category-select').focus();
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
            $('#category-input').focus();
            $(this).addClass('pressed');
            $('#select-button').removeClass('pressed');
        });
    },

    uploadButtonReplacer: function () {
        $('#upload-logo-input').hide();
        $('#upload-logo-button').on('click', function() {
            $('#upload-logo-input').trigger('click');
        });

        $('#upload-logo-input').on('change', function() {
            $('#upload-logo-form').submit();
        });
    },

    deleteImageListener: function () {
        $('#delete-image').on('click', function() {
            var teamId = $(this).data('team-id');
            app.teams.showConfirmationModal(teamId);
        });
    },

    showConfirmationModal: function (teamId) {
        $('#modal-content').append(`
            <span class="close">&times;</span>
            <p id="confirm-question">Are you sure you want to delete this image?</p>
            <div class="confirm-buttons">
                <div id="confirm" data-team-id="${teamId}">Confirm</div>
                <div id="cancel">Cancel</div>
            </div>
        `);

        $('#modal-background').show();
    },

    confirmDeleteEntityListeners: function () {
        $("#modal-content").on('click', '#confirm', function (ev) {
            ev.stopPropagation();
            $('.success').remove();
            $('.error').remove();
            var teamId = $(this).data("team-id");
            app.dataHandler.deleteTeamLogo(teamId);
        });

        $("#modal-content").on('click', '#cancel', function (ev) {
            ev.stopPropagation();
            $('#modal-background').hide();
            $('#modal-content').empty();
        });
    },

    switchToPlaceholderImage: function () {
        $('#profile-pic').attr('src', '/static/images/placeholder-logo.png');
    },

    flashDeletedLogo: function () {
        $('#team-profile h1').after(`<p class="success">Team logo has been deleted.</p>`);
        $('#modal-background').hide();
        $('#modal-content').empty();
    },

    flashNothingDeleted: function () {
        $('#team-profile h1').after(`<p class="error">There were no images to be deleted.</p>`);
        $('#modal-background').hide();
        $('#modal-content').empty();
    },

    closeButtonListener: function () {
        $('#modal-content').on('click', '.close', function() {
            $('#modal-content').empty();
            $('#modal-background').hide();
        });
    },

    modalBackgroundListener: function () {
        $(window).on('click', function(event) {
            if ($(event.target).attr('id') === 'modal-background') {
                $('#modal-content').empty();
                $('#modal-background').hide();
            }
        });
    }
};
