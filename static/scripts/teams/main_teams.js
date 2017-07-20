
// Global variable:

var app = app || {};

app.init = function() {
    app.teams.selectButtonListener();
    app.teams.addNewButtonListener();
    app.teams.uploadButtonReplacer();
    app.teams.deleteImageListener();
    app.teams.confirmDeleteEntityListeners();
    app.teams.closeButtonListener();
    app.teams.modalBackgroundListener();
};

$(document).ready(app.init());
