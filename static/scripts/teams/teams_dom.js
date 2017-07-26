
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

    confirmDeleteEntityListener: function () {
        $('#modal-content').on('click', '#confirm', function (ev) {
            ev.stopPropagation();
            $('.success').remove();
            $('.error').remove();
            var teamId = $(this).data('team-id');
            app.dataHandler.deleteTeamLogo(teamId);
        });
    },

    cancelConfirmationListener: function () {
        $('#modal-content').on('click', '#cancel', function (ev) {
            ev.stopPropagation();
            $('#modal-background').hide();
            $('#modal-content').empty();

            $('#ownership-manager').hide();
        });
    },

    switchToPlaceholderImage: function () {
        $('#profile-pic').attr('src', '/static/images/placeholder-logo.png');
        $('#delete-image').remove();
    },

    flashDeletedLogo: function () {
        $('#team-profile h4').after(`<p class="success">Team logo has been deleted.</p>`);
        $('#modal-background').hide();
        $('#modal-content').empty();
    },

    flashNothingDeleted: function () {
        $('#team-profile h1').after(`<p class="error">Deletion could not be processed Please try again.</p>`);
        $('#modal-background').hide();
        $('#modal-content').empty();
    },

    closeButtonListener: function () {
        $('#modal-content').on('click', '.close', function() {
            $('#modal-content').empty();
            $('#modal-background').hide();

            $('#ownership-manager').hide();
        });
    },

    modalBackgroundListener: function () {
        $(window).on('click', function(event) {
            if ($(event.target).attr('id') === 'modal-background') {
                $('#modal-content').empty();
                $('#modal-background').hide();

                $('#ownership-manager').hide();
            }
        });
    },

    editTeamButtonListener: function () {
        $('#edit-team').on('click', function() {

            if (!$(this).hasClass('cancel-button')) {
                teamProfile.category = $('#category-select').val();
                teamProfile.description = $('#team-description').val();
            } else if ($(this).hasClass('cancel-button')) {
                $('#category-select').val(teamProfile.category);
                $('#team-description').val(teamProfile.description);
                $('#category-input').val('');
            }

            if ($('#team-description').prop('disabled')) {
                $('#team-description').prop('disabled', false);
                $('#category-select').prop('disabled', false);
            } else {
                $('#team-description').prop('disabled', true);
                $('#category-select').prop('disabled', true);
            }

            $('#team-description').toggleClass('not-editable');
            $('#category-select').toggleClass('not-editable');
            $('#category-buttons').slideToggle(300);

            $('#submit-edit-team').slideToggle(300);

            if (this.innerText === 'Edit Team') {
                $(this).text('Cancel');
                $(this).addClass('cancel-button');
            } else {
                $(this).text('Edit Team');
                $(this).removeClass('cancel-button');
            }

            $('#category-input').hide();
            $('#category-input').prop('disabled', true);
            $('#category-select').show();
            $('#select-button').addClass('pressed');
            $('#add-button').removeClass('pressed');
        });
    },

    backToTeamsButtonListener: function () {
        $('#back-to-teams').on('click', function() {
            window.location.href = '/teams'
        });
    },

    ownershipButtonListener: function () {
        $('#hand-over-ownership').on('click', function() {
            $('#ownership-manager').slideToggle(300);
        });

    },

    newOwnerFakeSubmitListener: function () {
        $('#new-owner-fake-submit').on('click', function() {
            var newOwnerToBeInfo = $('#new-owner-select').val();

            if (!newOwnerToBeInfo) {
                $('.success').remove();
                $('.error').remove();
                $('#ownership-manager').slideToggle(300);
                $('#team-profile h1').after(`<p class="error">Please select a team member if you would like to hand over ownership.</p>`);
                return;
            }

            var newOwnerToBe = newOwnerToBeInfo.split(', ')[0].substring(1);

            $('#modal-content').append(`
                <span class="close">&times;</span>
                <p id="confirm-question">You are about to hand over ownership to ${newOwnerToBe}. It is an irreversible process, if you want to proceed please type in new owner's name to confirm.</p>
                <div class="confirm-buttons">
                    <input id="confirm-value" placeholder="Enter new owner's name...">
                    <div id="confirm-new-owner">Confirm</div>
                    <div id="cancel">Cancel</div>
                </div>
            `);

            $('#modal-background').show();
        });
    },

    newOwnerConfirmListener: function () {
        $('#modal-content').on('click', '#confirm-new-owner', function(ev) {
            ev.stopPropagation();
            $('.success').remove();
            $('.error').remove();

            var newOwnerToBeInfo = $('#new-owner-select').val();
            var newOwnerToBe = newOwnerToBeInfo.split(', ')[0].substring(1).replace(/'/g, '');
            var confirmValue = $('#confirm-value').val();

            // 'Whether input was correct or not:
            if (newOwnerToBe === confirmValue) {
                $('#ownership-form').submit();
            } else {
                $('.success').remove();
                $('.error').remove();
                $('#ownership-manager').slideToggle(300);
                $('#team-profile h1').after(`<p class="error">Incorrect input, failed to confirm ownership hand-over.</p>`);
                $('#modal-background').hide();
                $('#modal-content').empty();
            }
        });
    },

    deleteTeamButtonListener: function () {
        $('#delete-team').on('click', function () {
            var teamId = $(this).data('team-id');
            var teamName = $(this).data('team-name');

            $('#modal-content').append(`
                <span class="close">&times;</span>
                <p id="confirm-question">Are you sure you want to delete team '${teamName}'? Process cannot be reversed, furthermore all boards and cards will be lost forever. Please type in team name to confirm your intention.</p>
                <div class="confirm-buttons">
                    <input id="confirm-value" placeholder="Enter team name...">
                    <div id="confirm-delete-team" data-team-id="${teamId}" data-team-name="${teamName}">Confirm</div>
                    <div id="cancel">Cancel</div>
                </div>
            `);

            $('#modal-background').show();
        });
    },

    deleteTeamConfirmListener: function () {
        $('#modal-content').on('click', '#confirm-delete-team', function () {
            var teamId = $(this).data('team-id');
            var teamName = $(this).data('team-name');

            var confirmValue = $('#confirm-value').val();
            if (teamName === confirmValue) {
                app.dataHandler.deleteTeam(teamId, teamName);
            } else {
                $('.success').remove();
                $('.error').remove();
                $('#team-profile h1').after(`<p class="error">Incorrect input, failed to confirm team deletion.</p>`);
                $('#modal-background').hide();
                $('#modal-content').empty();
            }
        });
    },

    leaveTeamButtonListener: function () {
        $('#teams').on('click', '.leave-team-img', function () {
            var teamId = $(this).data('team-id');
            var teamName = $(this).data('team-name');
            
            if ($(this).hasClass('inactive')) {
                $('#modal-content').append(`
                    <span class="close">&times;</span>
                    <p id="confirm-question">You cannot leave the team named as '${teamName}' because you are the owner of it. Please hand over ownership first.</p>
                    <div class="confirm-buttons">
                        <div id="okay">OK</div>
                    </div>
                `);
            } else {
                $('#modal-content').append(`
                    <span class="close">&times;</span>
                    <p id="confirm-question">Are you sure you want to leave the team named as '${teamName}'?</p>
                    <div class="confirm-buttons">
                        <div id="confirm-leave-team" data-team-id="${teamId}" data-team-name="${teamName}">Confirm</div>
                        <div id="cancel">Cancel</div>
                    </div>
                `);
            }

            $('#modal-background').show();
        });
    },

    leaveTeamConfirmListener: function () {
        $('#modal-content').on('click', '#confirm-leave-team', function () {
            var teamId = $(this).data('team-id');
            var teamName = $(this).data('team-name');
            app.dataHandler.leaveTeam(teamId, teamName);
        });
    },

    okButtonListener: function () {
        $('#modal-content').on('click', '#okay', function() {
            $('#modal-content').empty();
            $('#modal-background').hide();

            $('#ownership-manager').hide();
        });
    },

    newTeamButtonListener: function () {
        $('#new-team-button').on('click', function() {
            $('#new-team-form').slideToggle(300);
            $('#new-team-name').focus();
        });
    },

    sendInviteButtonListener: function () {
        $('#send-invite').on('click', function() {
            var sendInvTo = $('#send-invite-input').val().split(' - ');
            var sendInvToId = Number(sendInvTo[0]);
            var sendInvToName = sendInvTo[1];
            app.dataHandler.sendInvite(sendInvToId, sendInvToName);
        });
    },

    cancelInviteListener: function () {
        $('#team-members').on('click', '.cancel-invite', function() {
            var invitedId = $(this).data('invited-id');
            app.dataHandler.cancelInvite(invitedId, teamId);
        });
    },

    acceptRequestListener: function () {
        $('#team-members').on('click', '.accept-request', function () {
            var teamId = $(this).data('team-id');
            var accountId = $(this).data('account-id');
            app.dataHandler.respondRequest('accept', teamId, accountId);
        });
    },

    declineRequestListener: function () {
        $('#team-members').on('click', '.decline-request', function () {
            var teamId = $(this).data('team-id');
            var accountId = $(this).data('account-id');
            app.dataHandler.respondRequest('decline', teamId, accountId);
        });
    }
};
