
var app = app || {};

app.dataHandler = {

    createNewBoard: function (boardTitle) {
        // Create new board, saves it.
        $.ajax({
            url:'/api/new_board',
            method: 'POST',
            data: {
                title: boardTitle
            },
            dataType: 'json',
            success: function(response) {
                app.boards.appendNewBoard(boardTitle, response.id);
            },
            error: function() {
                window.location.replace('/login');
            }
        });
    },

    createNewCard: function (boardId, cardTitle, boardTitle) {
        // Create new card in the given board and save it.
        $.ajax({
            url: '/api/new_card',
            method: 'POST',
            dataType: 'json',
            data: {
                title: cardTitle,
                board_id: boardId
            },
            success: function(response) {
                var cardId = response.id;
                var order = response.order;
                app.cards.insertNewCard(cardId, cardTitle, order, boardTitle, boardId );
                app.cards.resetForm(cardTitle);
            },
            error: function() {
                window.location.replace('/login');
            }
        });
    },

    editCard: function (cardId, newTitle) {
        // Edit card title and save in database.
        $.ajax({
            url: '/api/new_card_title',
            method: 'POST',
            dataType: 'json',
            data: {
                card_id: cardId,
                title: newTitle
            },
            success: function(response) {
                app.cards.flashCardEditSuccess(cardId, newTitle);
            },
            error: function() {
                window.location.replace('/login');
            }
        });
    },

    getCards: function (boardId, boardTitle) {
        $.ajax({
            dataType: "json",
            url: "/api/cards",
            data: {
                id: boardId
            },
            success: function(cards) {
                app.cards.showCards(cards, boardId, boardTitle);
            },
            error: function() {
                window.location.replace('/login');
            }
        });
    },

    makeDragAndDropPersistent: function (movedCardId, newStatus, iDsOfcardsOnBoard) {
        // Make result of drag and drop persistent in database.
        $.ajax({
            url: '/api/persistent_dnd',
            method: 'POST',
            dataType: 'json',
            data: {
                moved_card_id: movedCardId,
                new_status: newStatus,
                card_ids: JSON.stringify(iDsOfcardsOnBoard)
            },
            success: function(response) {
                app.cards.flashDragDropSuccess(movedCardId);
            },
            error: function() {
                window.location.replace('/login');
            }
        });
    },

    deleteBoard: function(boardId, boardTitle) {
        $.ajax({
            url: "/api/delete_board",
            data: {
                board_id: boardId
            },
            dataType: "json",
            success: function(response) {
                app.boards.removeBoardDiv(boardId);
                app.boards.flashDeleteBoardMessage(boardTitle);
            },
            error: function() {
                window.location.replace('/login');
            }
        });
    },

    deleteCard: function(cardId, cardTitle, boardId, boardTitle) {
        $.ajax({
            url: "/api/delete_card",
            data: {
                card_id: cardId
            },
            dataType: "json",
            success: function(response) {
                app.cards.removeCardDiv(cardId);
                app.cards.flashDeleteCardMessage(cardTitle);
            },
            error: function() {
                window.location.replace('/login');
            }
        });
    }
};
