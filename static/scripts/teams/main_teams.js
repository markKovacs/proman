
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
    app.teams.leaveTeamButtonListener();
    app.teams.leaveTeamConfirmListener();
    app.teams.okButtonListener();
    app.teams.newTeamButtonListener();
    app.teams.sendInviteButtonListener();
    app.teams.cancelInviteListener();
    app.teams.acceptRequestListener();
    app.teams.declineRequestListener();
};

$(document).ready(app.init());
