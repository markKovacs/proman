
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
            $('.error').remove();
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
            $('.error').remove();
            var boardId = $(this).data('board-id');
            var boardTitle = $(this).data('board-title');
            app.dataHandler.getCards(boardId, boardTitle);
        });
    },

    addDeleteBoardEventListener: function () {
        $("#boards").on("click", ".delete", function(ev) {
            ev.stopPropagation();
            $('.success').remove();
            $('.error').remove();
            var boardId = $(this).data("board-id");
            var boardTitle = $(this).data('board-title');
            app.dataHandler.deleteBoard(boardId, boardTitle);
        });
    },

    appendNewBoard: function (boardTitle, boardId) {
        $('.no-boards').remove();
        $('#boards h1').after(`<p class="success">Board '${boardTitle}' has been created.</p>`);

        $('#new-board-title').val('');
        $('#new-board-form').toggle();

        var initCardCount = 0;
        $('#boards div.row:last').append(this.getBoardHTML(boardTitle, boardId, initCardCount));
    },

    getBoardHTML: function (boardTitle, boardId, cardCount) {
        return `<div class="col-sm-3">
                    <div class="board-div" id="board-id-${boardId}" data-board-id="${boardId}" data-board-title="${boardTitle}">
                        <h2 class="board-title">${boardTitle}</h2>
                        <p class="card-count" data-board-id="${boardId}">Cards: ${cardCount}</p>
                        <div>
                            <img data-board-id="${boardId}" data-board-title="${boardTitle}" src="static/images/trash.svg" class="trash delete" alt="DEL">
                        </div>
                    </div>
                </div>`;
    },

    removeBoardDiv: function (boardId) {
        $(`#board-id-${boardId}`).parent().remove();
        var numberOfBoardDivs = $('.board-div').length;
        if (numberOfBoardDivs === 0) {
            $('#boards').append(`<p class="no-boards">There are no boards added yet.</p>`);
        }
    },

    flashDeleteBoardMessage: function (boardTitle) {
        $('#boards h1').after(`<p class="success">Board '${boardTitle}' has been deleted.</p>`);
    },

    refreshCardCount: function (currentCardCounts) {
        var cardCountsElements = $('.card-count');
        for (let j = 0; j < currentCardCounts.length; j++) {
            for (let i = 0; i < cardCountsElements.length; i++) {
                if (currentCardCounts[j].board_id === Number($(cardCountsElements[i]).data('board-id'))) {
                    $(cardCountsElements[i]).text(`Cards: ${currentCardCounts[j].card_count}`);
                }
            }
        }
    },

    switchToBoardsPage: function () {
        $('#cards').hide();
        $('#boards').show();
        $('#cards').empty();
    },

    flashDataErrorMessage: function () {
        $('.success').remove();
        $('.error').remove();

        $('#new-board-title').val('');
        $('#new-board-form').toggle();

        $('#boards h1').after(`<p class="error">Board title must be 1-30 characters long.</p>`);
    }
};
