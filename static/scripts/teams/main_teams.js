
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
    app.teams.removeMemberListener();
    app.teams.editRoleImageListener();
    app.teams.submitRoleImageListener();
    app.teams.boardsAccessButtonListener();
    app.teams.closeBoardsAccessListener();
    app.teams.addBoardAccessButtonListener();
    app.teams.removeBoardAccessButtonListener();
    app.teams.cancelBoardsAccessListener();
    app.teams.saveBoardsAccessListener();
};

$(document).ready(app.init());
