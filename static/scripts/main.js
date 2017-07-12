
// Global variable:
var prevCardTitle;

var app = app || {};

app.init = function() {
    app.boards.showBoards();
    app.boards.addBoardsEventListener();
    app.boards.addDeleteBoardEventListener();
    app.boards.newBoardOnEnter();
    app.cards.addDropZoneEventListeners();
    app.cards.addEditTitleEventListener();
    app.cards.addCardsEventListeners();
    app.cards.deleteCardEventListener();
    app.cards.cardTitleOnEnter();
    app.cards.newCardOnEnter();
};

$(document).ready(app.init());
