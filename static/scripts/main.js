
var app = app || {};
var prevCardTitle;

app.init = function() {
    app.boards.showBoards();
    app.boards.addBoardsEventListener();
    app.boards.addDeleteBoardEventListener();
    app.cards.addDropZoneEventListeners();
    app.cards.addEditTitleEventListener();
    app.cards.addCardsEventListeners();
    app.cards.deleteCardEventListener();
};

$(document).ready(app.init());
