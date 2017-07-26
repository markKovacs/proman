
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
        console.log(teamId);
        console.log(accountId);
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
    }
};
