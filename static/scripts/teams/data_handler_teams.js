
var app = app || {};

app.dataHandler = {

    deleteTeamLogo: function (teamId) {
        $.ajax({
            url: `/team/${teamId}/delete_logo`,
            data: {
                team_id: teamId
            },
            method: 'POST',
            dataType: "json",
            success: function(deleted) {
                if (deleted) {
                    app.teams.switchToPlaceholderImage();
                    app.teams.flashDeletedLogo();
                } else {
                    app.teams.flashNothingDeleted();
                }
            },
            error: function() {
                window.location.replace('/login?error=timedout');
            }
        });
    },

    deleteTeam: function (teamId, teamName) {
        $.ajax({
            url: `/team/${teamId}/delete_team`,
            data: {
                team_id: teamId
            },
            method: 'POST',
            dataType: "json",
            success: function(response) {
                window.location.replace(`/teams?success=team-deleted&id=${teamId}&name=${teamName}`);
            },
            error: function() {
                window.location.replace('/login?error=timedout');
            }
        });
    },

    leaveTeam: function (teamId, teamName) {
        $.ajax({
            url: `/team/${teamId}/leave_team`,
            data: {
                team_id: teamId
            },
            method: 'POST',
            dataType: "json",
            success: function(response) {
                window.location.replace(`/teams?success=team-left&name=${teamName}`);
            },
            error: function() {
                window.location.replace('/login?error=timedout');
            }
        });
    },

    sendInvite: function (invitedAccId, invitedAccName) {
        $.ajax({
            url: `/team/${teamId}/send_invite`,
            data: {
                team_id: teamId,
                invited_id: invitedAccId
            },
            method: 'POST',
            dataType: "json",
            success: function(response) {
                if (response === 'empty_input') {
                    window.location.replace(`/team/${teamId}/members?error=empty-input`);
                } else {
                    window.location.replace(`/team/${teamId}/members?success=inv-sent&invited-name=${invitedAccName}`);
                }
            },
            error: function() {
                window.location.replace('/login?error=timedout');
            }
        });
    },

    cancelInvite: function (invitedId, teamId) {
        $.ajax({
            url: `/team/${teamId}/cancel_invite`,
            data: {
                team_id: teamId,
                invited_id: invitedId
            },
            method: 'POST',
            dataType: "json",
            success: function(response) {
                window.location.replace(`/team/${teamId}/members?success=inv-cancelled`);
            },
            error: function() {
                window.location.replace('/login?error=timedout');
            }
        });
    },

    respondRequest: function (action, teamId, accountId) {
        $.ajax({
            url: `/team/${teamId}/${action}_request`,
            data: {
                team_id: teamId,
                request_acc_id: accountId
            },
            method: 'POST',
            dataType: "json",
            success: function(response) {
                if (action === 'accept') {
                    window.location.replace(`/team/${teamId}/members?success=request-accepted`);
                } else if (action === 'decline') {
                    window.location.replace(`/team/${teamId}/members?success=request-declined`);
                }
            },
            error: function() {
                window.location.replace('/login?error=timedout');
            }
        });
    },

    removeMember: function (memberId, teamId) {
        $.ajax({
            url: `/team/${teamId}/remove_member`,
            data: {
                team_id: teamId,
                member_id: memberId
            },
            method: 'POST',
            dataType: "json",
            success: function(deleted) {
                if (deleted) {
                    window.location.replace(`/team/${teamId}/members?success=member-removed`);
                } else {
                    window.location.replace(`/team/${teamId}/members?error=member-removed`);
                }
            },
            error: function() {
                window.location.replace('/login?error=timedout');
            }
        });
    },

    changeRole: function (teamId, memberId, newRole) {
        $.ajax({
            url: `/team/${teamId}/change_role`,
            data: {
                team_id: teamId,
                member_id: memberId,
                new_role: newRole
            },
            method: 'POST',
            dataType: "json",
            success: function(response) {
                app.teams.flashChangedRoleMessage(memberId, newRole);
            },
            error: function() {
                window.location.replace('/login?error=timedout');
            }
        });
    },

    getBoardsAccess: function (accTeamId, teamId, teamRole) {
        $.ajax({
            url: `/team/${teamId}/get_boards_access`,
            data: {
                acc_team_id: accTeamId,
                team_id: teamId
            },
            method: 'POST',
            dataType: "json",
            success: function(response) {
                app.teams.showBoardsAccess(response.boards_access, response.not_accessed_boards, accTeamId, teamId, teamRole)
            },
            error: function() {
                window.location.replace('/login?error=timedout');
            }
        });
    },

    saveBoardsAccessChanges: function (accBoardsData, accTeamId, teamRole) {
        $.ajax({
            url: `/team/${teamId}/save_boards_access_changes`,
            data: {
                acc_boards_data: JSON.stringify(accBoardsData),
                acc_team_id: accTeamId,
                team_role: teamRole
            },
            method: 'POST',
            dataType: "json",
            success: function(response) {
                console.log('saved');
            },
            error: function() {
                window.location.replace('/login?error=timedout');
            }
        });

    }
};
