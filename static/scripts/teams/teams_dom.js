
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
    },

    removeMemberListener: function () {
        $('#team-members').on('click', '.remove-member-img', function () {
            var memberId = $(this).data('member-id');
            var teamId = $(this).data('team-id');
            app.dataHandler.removeMember(memberId, teamId);
        });
    },

    editRoleImageListener: function () {
        $('#team-members').on('click', '.edit-role-img', function () {
            $(this).addClass('submit-role-img');
            $(this).removeClass('edit-role-img');
            $(this).attr('src', '/static/images/submit.svg');

            $(this).prev().prop('disabled', false);
            $(this).prev().removeClass('disabled-role-select');
            $(this).prev().focus();
        });
    },

    submitRoleImageListener: function () {
        $('#team-members').on('click', '.submit-role-img', function () {
            var newRole = $(this).prev().val();
            var memberId = $(this).data('member-id');
            var teamId = $(this).data('team-id');

            $(this).parent().next().find('img').toggleClass('inactive');

            $(this).addClass('edit-role-img');
            $(this).removeClass('submit-role-img');
            $(this).attr('src', '/static/images/edit.svg');

            $(this).prev().prop('disabled', true);
            $(this).prev().addClass('disabled-role-select');

            app.dataHandler.changeRole(teamId, memberId, newRole);
        });
    },

    flashChangedRoleMessage: function (memberId, newRole) {
        $('.success').remove();
        $('.error').remove();
        $('#team-members h4:first').after(`<p class="success">Member #${memberId} has its role changed to '${newRole}'.</p>`);
    },

    boardsAccessButtonListener: function () {
        $('#team-members-outer').on('click', '.boards-access-img', function() {

            // toggle back any others, if toggled:
            app.teams.closeBoardsAccess();

            $(this).parent().addClass('pushed-in-boards-access');
            $(this).attr('src', '/static/images/up-arrow.svg');
            $(this).addClass('close-boards-access');
            $(this).removeClass('boards-access-img');

            var accTeamId = $(this).data('acc-team-id');
            var teamId = $(this).data('team-id');
            var teamRole = $(this).data('team-role');
            app.dataHandler.getBoardsAccess(accTeamId, teamId, teamRole);
        });
    },

    closeBoardsAccessListener: function () {
        $('#team-members-outer').on('click', '.close-boards-access', function() {
            app.teams.closeBoardsAccess();
        });
    },

    closeBoardsAccess: function () {
        $('.board-access-tr').remove();
        $('.boards-access-open-close').parent().removeClass('pushed-in-boards-access');
        $('.boards-access-open-close').attr('src', '/static/images/boards.svg');
        $('.boards-access-open-close').removeClass('close-boards-access');
        $('.boards-access-open-close').addClass('boards-access-img');
    },

    showBoardsAccess: function (boardsAccess, notAccessedBoards, accTeamId, teamId, teamRole) {
        $(`#at-id-${accTeamId}`).after(`
            <tr id="submit-cancel-row" class="board-access-tr">
                <td class="board-access-td board-access-title" colspan="5">
                    <button id="submit-boards-access-changes" data-team-role="${teamRole}">Save</button>
                    <button id="cancel-boards-access-changes">Cancel</button>
                </td>
            </tr>
        `);

        if (notAccessedBoards) {
            var options = '';
            for (let i = 0; i < notAccessedBoards.length; i++) {
                options += `<option id="option-${notAccessedBoards[i].board_id}" class="boards-access-option">#${notAccessedBoards[i].board_id} - ${notAccessedBoards[i].title}</option>`;
            }

            $(`#at-id-${accTeamId}`).after(`
                <tr id="add-board-access-row" class="board-access-tr">
                    <td class="board-access-td dark-blue-td" colspan="4">
                        <select id="boards-access-select">
                            <option class="boards-access-option-default" selected disabled>Select board to add access to this account...</option>
                            ${options}
                        </select>
                    </td>
                    <td class="board-access-td add-board-access-td">
                        <img src="/static/images/plus.svg" alt="" class="add-board-access-img" data-acc-team-id="${accTeamId}" data-team-id="${teamId}">
                    </td>
                </tr>
            `);
        } else {
            $(`#at-id-${accTeamId}`).after(`
                <tr id="accessed-all-boards" class="board-access-tr">
                    <td class="board-access-td dark-blue-td" colspan="5">Account has access to all team boards.</td>
                </tr>
            `);
        }

        if (boardsAccess) {
            for (let i = 0; i < boardsAccess.length; i++) {
                $(`#at-id-${accTeamId}`).after(`
                    <tr class="board-access-tr actual-board-access" data-board-id="${boardsAccess[i].board_id}" data-acc-team-id="${accTeamId}">
                        <td class="board-access-td">${boardsAccess[i].board_id}</td>
                        <td class="board-access-td" colspan="2">${boardsAccess[i].title}</td>
                        <td class="board-access-td">
                            <select class="board-role-select">
                                <option ${boardsAccess[i].role === 'viewer' ? 'selected' : ''}>viewer</option>
                                <option ${boardsAccess[i].role === 'editor' ? 'selected' : ''}>editor</option>
                            </select>
                        </td>
                        <td class="board-access-td remove-board-access-td">
                            <img class="remove-board-access-img" src="/static/images/trash_2.svg" alt="Del" data-remove-access="${boardsAccess[i].acc_board_id}">
                        </td>
                    </tr>
                `);
            }

            $(`#at-id-${accTeamId}`).after(`
                <tr id="board-access-ths" class="board-access-tr">
                    <td class="board-access-td dark-blue-td">Board ID</td>
                    <td class="board-access-td dark-blue-td" colspan="2">Board Title</td>
                    <td class="board-access-td dark-blue-td">Access Level</td>
                    <td class="board-access-td dark-blue-td">Remove</td>
                </tr>
            `);

        } else {
            $(`#at-id-${accTeamId}`).after(`
                <tr class="board-access-tr">
                    <td id="no-board-access-yet" class="board-access-td" colspan="5">Account has no access to any team related boards.</td>
                </tr>
            `);
        }

        $(`#at-id-${accTeamId}`).after(`
            <tr id="board-access-title-row" class="board-access-tr" data-acc-team-id="${accTeamId}">
                <td class="board-access-td board-access-title" colspan="5">Board access rights manager</td>
            </tr>
        `);

        $('.board-access-td').slideDown(250);
    },

    addBoardAccessButtonListener: function () {
        $('#team-members-outer').on('click', '.add-board-access-img', function() {
            var selectVal = $('#boards-access-select').val();

            if (!selectVal) {
                return;
            }

            var selectValues = selectVal.replace('#', '').split(' - ');
            var boardId = selectValues[0];
            var boardTitle = selectValues[1];
            var accTeamId = $(this).data('acc-team-id');
            var teamId = $(this).data('team-id');

            $(this).parent().parent().before(`
                <tr class="board-access-tr actual-board-access" data-board-id="${boardId}" data-acc-team-id="${accTeamId}">
                    <td class="board-access-td visible-td">${boardId}</td>
                    <td class="board-access-td visible-td" colspan="2">${boardTitle}</td>
                    <td class="board-access-td visible-td">
                        <select class="board-role-select">
                            <option selected>viewer</option>
                            <option>editor</option>
                        </select>
                    </td>
                    <td class="board-access-td visible-td remove-board-access-td">
                        <img class="remove-board-access-img" src="/static/images/trash_2.svg" alt="Del" data-remove-access="${null}">
                    </td>
                </tr>
            `);

            $('#no-board-access-yet').remove();
            $(`#option-${boardId}`).remove();
            if ($('#boards-access-select').children().length <= 1) {
                // no more boards so remove select+add and append paragraph with message
                $('#add-board-access-row').after(`
                    <tr id="accessed-all-boards" class="board-access-tr">
                        <td class="board-access-td dark-blue-td visible-td" colspan="5">Account has access to all team boards.</td>
                    </tr>
                `);
                $('#add-board-access-row').remove();
                
            } else {
                // there is at least 1 unaccessed board yet so I just select the default option
                $('#boards-access-select option:first-child').prop('selected', 'selected');
            }
        });
    },

    removeBoardAccessButtonListener: function () {
        $('#team-members-outer').on('click', '.remove-board-access-img', function() {
            var accTeamId = $(this).data('acc-team-id');

            // remove row
            var boardTitle = $(this).parent().prev().prev().text();
            var boardId = $(this).parent().prev().prev().prev().text();
            $(this).parent().parent().remove();
            // if select+add is not present, add that row first
            if (!$('#add-board-access-row').length) {
                $('#accessed-all-boards').after(`
                    <tr id="add-board-access-row" class="board-access-tr">
                        <td class="board-access-td dark-blue-td visible-td" colspan="4">
                            <select id="boards-access-select">
                                <option class="boards-access-option-default" selected disabled>Select board to add access to this account...</option>
                            </select>
                        </td>
                        <td class="board-access-td add-board-access-td visible-td">
                            <img src="/static/images/plus.svg" alt="" class="add-board-access-img" data-acc-team-id="${accTeamId}" data-team-id="${teamId}">
                        </td>
                    </tr>
                `);
            }

            $('#accessed-all-boards').remove();

            // add back to options select
            $('#boards-access-select').append(`
                <option id="option-${boardId}" class="boards-access-option">#${boardId} - ${boardTitle}</option>
            `);

            if ($('.actual-board-access').length < 1) {
                $('#board-access-title-row').after(`
                    <tr class="board-access-tr">
                        <td id="no-board-access-yet" class="board-access-td visible-td" colspan="5">Account has no access to any team related boards.</td>
                    </tr>
                `);
                $('#board-access-ths').remove();
            }
        });
    },

    cancelBoardsAccessListener: function () {
        $('#team-members-outer').on('click', '#cancel-boards-access-changes', function() {
            app.teams.closeBoardsAccess();
        });
    },

    saveBoardsAccessListener: function () {
        $('#team-members-outer').on('click', '#submit-boards-access-changes', function() {
            var teamRole = $(this).data('team-role');

            // get all data for dataHandler function
            var boardAccessCount = $('.actual-board-access').length;
            var accBoardsData = new Array();
            var accTeamId = $('#board-access-title-row').data('acc-team-id');

            for (let i = 0; i < boardAccessCount; i++) {
                let boardId = $($('.actual-board-access')[i]).data('board-id');
                let role = $($('.board-role-select')[i]).val();

                accBoardsData.push({
                    board_id: boardId,
                    role: role
                });
            }
            
            app.teams.closeBoardsAccess();
            app.dataHandler.saveBoardsAccessChanges(accBoardsData, accTeamId, teamRole);
        });
    }
};
