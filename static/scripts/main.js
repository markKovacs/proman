
var app = app || {};

app.init = function() {
    app.boards.showBoards();
    app.boards.addBoardsEventListener();
    app.boards.addDeleteBoardEventListener();
    app.cards.addDropZoneEventListeners();
    app.cards.addEditTitleEventListener();
    app.cards.addCardsEventListeners();
};

$(document).ready(app.init());
