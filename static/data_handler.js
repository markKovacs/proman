
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
        // Create new card in the given board, saves it.

        var cardId = this.cardCount;
        this.cardCount += 1;

        var lastPlace = getMaxOrder(boardId) + 1;

        var newCardObj = {
            id: cardId,
            title: cardTitle,
            status: "new",
            order: lastPlace
        }

        for (var i = 0; i < this.boards.length; i++) {
            if (this.boards[i].id === boardId) {
                this.boards[i].cards.push(newCardObj);
                break;
            }
        }

        localStorage.setItem('boards', JSON.stringify(this.boards));
        localStorage.setItem('cardCount', JSON.stringify(this.cardCount));
    },

    editCard: function (boardId, cardId, newTitle) {
        // Edit card title and save in localStorage.

        for (var i = 0; i < this.boards.length; i++) {
            if (this.boards[i].id === boardId) {
                for (var j = 0; j < this.boards[i].cards.length; j++) {
                    if (this.boards[i].cards[j].id === cardId) {
                        this.boards[i].cards[j].title = newTitle;
                        localStorage.setItem('boards', JSON.stringify(this.boards));
                        return;
                    }
                }
            }
        }
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
    }
};


function getMaxOrder(boardId) {
    for (var i = 0; i < app.dataHandler.boards.length; i++) {
        if (app.dataHandler.boards[i].id === boardId) {

            var theseCards = app.dataHandler.boards[i].cards;
            return theseCards.length;
        }
    }
}
