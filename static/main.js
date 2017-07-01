
var app = app || {};


app.init = function() {
    // Initializes the JS application

    app.dom.showBoards();
}

$(document).ready(app.init());
