
// DOM manipulation related to boards

var boardsData = boardsData || {};
var app = app || {};

app.boards = {
    
    showBoards: function () {
        // Show boards page.

        this.appendBoardNavDiv();

        if (boardsData) {
            this.appendBoards();
        } else {
            $('#boards').append('<div class="row"></div>');
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

        for (let i = 0; i < boardsData.length; i++) {
            if (i === 0 || i % 4 === 0) {
                var boardsRow = $('<div class="row"></div>');
                $('#boards').append(boardsRow);
            }
            boardsRow.append(getBoardString(boardsData[i].title, boardsData[i].id, boardsData[i].card_count));
        }
    },

    addBoardsEventListener: function () {
        // Add event listener to board divs, allowing navigation to cards on board.

        $('#boards').on('click', '.board-div', function(ev) {
            if (!$(ev.target).hasClass('delete')) {
                $('.success').remove();
                var boardId = $(this).data('board-id');
                var boardTitle = $(this).data('board-title');
                app.dataHandler.getCards(boardId, boardTitle);
            }
        });
    }
};
