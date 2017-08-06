
// Global variable:
var originalCardTitle;
var originalCardDesc;
var originalCardAssignedTo;
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

    app.cards.addDropZoneEventListeners();
    app.cards.addEditTitleEventListener();
    app.cards.addCardsEventListeners();
    app.cards.deleteCardEventListener();
    app.cards.cardTitleOnEnter();
    app.cards.newCardOnEnter();

    app.common.closeButtonListener();
    app.common.modalBackgroundListener();
    app.common.confirmDeleteEntityListeners();

    app.boards.teamSelectListener();

    app.cards.cardDetailsListener();
    app.cards.editCardListener();
    app.cards.submitCardListener();
};

$(document).ready(app.init());
