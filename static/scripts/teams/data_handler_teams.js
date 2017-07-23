
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
    }
};
