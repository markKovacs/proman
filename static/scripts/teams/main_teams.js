
// Global variable:

var app = app || {};

app.init = function() {
    app.teams.selectButtonListener();
    app.teams.addNewButtonListener();
    app.teams.uploadButtonReplacer();
};

$(document).ready(app.init());
