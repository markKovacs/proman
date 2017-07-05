
var app = app || {};

app.dataHandler = {
    // Data handler layer. Reads and writes
    // from/to localStorage and keeps data
    // in memory through this.boards/boardCount/cardCount.

    boards: [],
    boardCount: 0,
    cardCount: 0,

    loadTestBoards: function () {
        // If settings.environment === 'dev', loads data via this function.

        this.boards = JSON.parse(app.testBoards).boards;
        this.boardCount = JSON.parse(app.testBoards).boardCount;
        this.cardCount = JSON.parse(app.testBoards).cardCount;
    },

    loadBoards: function () {
        // If settings.environment === 'prod', loads data via this function.

        var boardsString = localStorage.getItem('boards');
        var boardCountString = localStorage.getItem('boardCount');
        var cardCountString = localStorage.getItem('cardCount');

        if (!boardsString) {
            localStorage.setItem('boards', []);
        }
        if (!boardCountString) {
            localStorage.setItem('boardCount', 0);
        }
        if (!cardCountString) {
            localStorage.setItem('cardCount', 0);
        }

        try {
            this.boards = JSON.parse(localStorage.getItem('boards'));
        } catch (err) {
            this.boards = [];
        }

        this.boardCount = JSON.parse(localStorage.getItem('boardCount'));
        this.cardCount = JSON.parse(localStorage.getItem('cardCount'));
    },

    saveBoards: function () {
        // Save data to local storage from this.boards/boardCount properties.

        localStorage.setItem('boards', JSON.stringify(this.boards));
        localStorage.setItem('boardCount', JSON.stringify(this.boardCount));
    },

    getBoard: function (boardId) {
        // Return the board with the given id from this.boards.

        for (var i = 0; i < this.boards.length; i++) {
            if (this.boards[i].id === boardId) {
                return this.boards[i];
            }
        }
    },




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
                var boardsInLastRow = $('#boards div.row:last').children().length;
                if (boardsInLastRow === 0 || boardsInLastRow % 4 !== 0 ) {
                    $('#boards').prepend(`<p class="success">Board '${boardTitle}' added.</p>`);
                    $('#boards div.row:last').append(`
                        <div class="col-sm-3">
                            <div class="board-div" data-board-id="${response.id}" data-board-title="${boardTitle}">
                                <h2 class="board-title">${boardTitle}</h2>
                                <p class="card-count">Cards: 0</p>
                            </div>
                        </div>
                    `);
                } else {
                    $('#boards').prepend(`<p class="success">Board '${boardTitle}' added.</p>`);
                    $('#boards').append(`
                        <div class="row">
                            <div class="col-sm-3">
                                <div class="board-div" data-board-id="${response.id}" data-board-title="${boardTitle}">
                                    <h2 class="board-title">${boardTitle}</h2>
                                    <p class="card-count">Cards: 0</p>
                                </div>
                            </div>
                        </div>
                    `);
                }

                $('#new-board-title').val('');
                $('#new-board-form').toggle();
            }

        });
    },

    createNewCard: function (boardId, cardTitle) {
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
                $('#cards').prepend(`<p class="success">New card with title '${cardTitle}' added.</p>`);
                $('#new-cards-col div.drop-zone').before(`
                    <div class="row card-div" id="card-div-id-${cardId}" draggable="true">
                        <input class="card-title disabled-title" id="card-title-id-${cardId}" disabled value="${cardTitle}">
                        <div class="card-order" id="card-order-id-${cardId}">Order: ${response.order}</div>
                        <button class="edit-title" id="card-submit-id-${cardId}" data-card-id="${cardId}">Edit</button>
                    </div>
                `);
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
                $('#cards').prepend(`<p class="success">Card #${cardId} title edited to '${newTitle}'.</p>`);
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
                $('#cards').prepend(`<p class="success">Card #${movedCardId} replacement saved.</p>`);
            }
        });
    }
};
