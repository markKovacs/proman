
// DOM manipulation related to boards

var boardsData = boardsData || {};
var app = app || {};

app.boards = {
    
    showBoards: function () {
        // Show boards page.

        this.appendBoardNavDiv();

        if (boardsData[0]) {
            this.appendBoards();
        } else {
            $('#boards').append(`<p class="no-boards">There are no boards added yet.</p>`);
        }
    },

    appendBoardNavDiv: function () {
        // Create and append the div responsible for
        // the addition of new boards with given title.

        $('#boards').append(`
            <div class="row">
                <div class="col-sm-12">
                    <button id="new-board-button">Add New Board</button>
                    <div id="new-board-form">
                        <input type="text" id="new-board-title">
                        <button id="new-board-entry">Submit</button>
                    </div>
                </div>
            </div>
        `);

        $('#new-board-entry').on('click', function() {
            $('.success').remove();
            var boardTitle = $('#new-board-title').val();
            app.dataHandler.createNewBoard(boardTitle);
        });

        $('#new-board-button').on('click', function() {
            $('#new-board-form').toggle();
        });

    },

    appendBoards: function () {
        // Create and append boards,insertNewCard based on stored boards data.
        var boardsRow = $('<div class="row"></div>');

        for (let i = 0; i < boardsData.length; i++) {
            boardsRow.append(this.getBoardHTML(boardsData[i].title, boardsData[i].id, boardsData[i].card_count));
        }

        $('#boards').append(boardsRow);
    },

    addBoardsEventListener: function () {
        // Add event listener to board divs, allowing navigation to cards on board.

        $('#boards').on('click', '.board-div', function(ev) {
            $('.success').remove();
            var boardId = $(this).data('board-id');
            var boardTitle = $(this).data('board-title');
            app.dataHandler.getCards(boardId, boardTitle);
        });
    },

    addDeleteBoardEventListener: function () {
        $("#boards").on("click", ".delete", function(ev) {
            ev.stopPropagation();
            $('.success').remove();
            var boardId = $(this).data("board-id");
            var boardTitle = $(this).data('board-title');
            app.dataHandler.deleteBoard(boardId, boardTitle);
        });
    },

    appendNewBoard: function (title, id) {
        $('.no-boards').remove();
        $('#boards').prepend(`<p class="success">Board '${title}' added.</p>`);

        $('#new-board-title').val('');
        $('#new-board-form').toggle();

        var initCardCount = 0;
        $('#boards div.row:last').append(this.getBoardHTML(title, id, initCardCount));
    },

    getBoardHTML: function (title, id, cardCount) {
        return `<div class="col-sm-3">
                    <div class="board-div" data-board-id="${id}" data-board-title="${title}">
                        <h2 class="board-title">${title}</h2>
                        <p class="card-count">Cards: ${cardCount}</p>
                        <div><img data-board-id="${id}" data-board-title="${title}" src="static/images/trash.svg" class="trash delete" alt="DEL"></div>
                    </div>
                </div>`;
    },

    flashDeleteBoardMessage: function (boardTitle) {
        $('#boards').prepend(`<p class="success">Board '${boardTitle}' deleted.</p>`);
    }
};
