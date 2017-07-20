
var app = app || {};

app.dataHandler = {

    deleteTeamLogo: function (teamId) {
        $.ajax({
            url: "/api/delete_logo",
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
    }
};
