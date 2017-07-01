
var app = app || {};

// app.init initializes the JS application

app.init = function() {
    app.dom.showBoards();
}

$(document).ready(app.init());
