
// Global variables:
var teamProfile = {};
var app = app || {};

app.init = function() {
    app.teams.selectButtonListener();
    app.teams.addNewButtonListener();
    app.teams.uploadButtonReplacer();
    app.teams.deleteImageListener();
    app.teams.confirmDeleteEntityListener();
    app.teams.cancelConfirmationListener();
    app.teams.closeButtonListener();
    app.teams.modalBackgroundListener();
    app.teams.editTeamButtonListener();
    app.teams.backToTeamsButtonListener();
    app.teams.ownershipButtonListener();
    app.teams.newOwnerFakeSubmitListener();
    app.teams.newOwnerConfirmListener();
    app.teams.deleteTeamButtonListener();
    app.teams.deleteTeamConfirmListener();
};

$(document).ready(app.init());
