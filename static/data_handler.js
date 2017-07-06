
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
                app.dom.appendNewBoard(boardTitle, response.id);
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
                app.dom.insertNewCard(cardId, cardTitle, order, boardTitle, boardId );
                app.dom.resetForm(cardTitle);
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
                flashCardEditSuccess(cardId, newTitle);
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
                app.dom.showCards(cards, boardId, boardTitle);
            }
        });
    },

    makeDragAndDropPersistent: function (movedCardId, newStatus, iDsOfcardsOnBoard) {
        // Make result of drag and drop persistent in database.
        console.log(iDsOfcardsOnBoard);
        console.log('iDsOfcardsOnBoard');
        console.log(JSON.stringify(iDsOfcardsOnBoard));
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
                flashDragDropSuccess(movedCardId);
            }
        });
    },

    deleteBoard: function(boardId) {
        $.ajax({
            url: "/api/delete_board",
            data: {board_id: boardId},
            dataType: "json",
            success: function(response) {
                //$('#boards').prepend(`<p class="success">Board #${boardId} deletion saved.</p>`);
                window.location.replace("/boards");
            }
        });
    },

    deleteCard: function(cardId, boardId, boardTitle) {
        $.ajax({
            url: "/api/delete_card",
            data: {card_id: cardId},
            dataType: "json",
            success: function(response) {
                //$('#boards').prepend(`<p class="success">Board #${boardId} deletion saved.</p>`);
                app.dataHandler.getCards(boardId, boardTitle);
            }
        });
    }
};
