
// Global variable:
var prevCardTitle;

var app = app || {};

app.init = function() {
    app.boards.showBoards();
    app.boards.addBoardsEventListener();
    app.boards.addDeleteBoardEventListener();
    app.cards.addDropZoneEventListeners();
    app.cards.addEditTitleEventListener();
    app.cards.cardTitleUponEnter();
    app.cards.addCardsEventListeners();
    app.cards.deleteCardEventListener();
};

$(document).ready(app.init());
