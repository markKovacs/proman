
// Global variable:
var originalCardTitle;
var originalBoardTitle;
var originalBoardDesc;

var app = app || {};

app.init = function() {
    app.boards.showBoards();
    app.boards.addBoardsEventListener();
    app.boards.deleteBoardListener();
    app.boards.boardDetailsListener();
    app.boards.newBoardOnEnter();
    app.boards.editBoardListener();
    app.boards.submitBoardListener();
    app.boards.confirmDeleteBoardListeners();

    app.cards.addDropZoneEventListeners();
    app.cards.addEditTitleEventListener();
    app.cards.addCardsEventListeners();
    app.cards.deleteCardEventListener();
    app.cards.cardTitleOnEnter();
    app.cards.newCardOnEnter();

    app.common.closeButtonListener();
    app.common.modalBackgroundListener();
};

$(document).ready(app.init());
