
// Global variable:

var app = app || {};

app.init = function() {
    app.teams.selectButtonListener();
    app.teams.addNewButtonListener();
};

$(document).ready(app.init());
