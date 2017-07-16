
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
                    <button id="new-board-button">New Board</button>
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
            $('#new-board-form').slideToggle(100);
            $('#new-board-title').focus();
        });
    },

    newBoardOnEnter: function (ev) {
        $('#new-board-title').on('keypress', function(ev) {
            if (!ev) {
                ev = window.event;
            }
            ev.stopPropagation();
            var keyCode = ev.keyCode || ev.which;

            if (keyCode == '13'){
                ev.preventDefault();
                $('#new-board-entry').trigger('click');
            }
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

    deleteBoardListener: function () {
        $("#boards").on("click", ".delete", function(ev) {
            ev.stopPropagation();
            $('.success').remove();
            $('.error').remove();
            var boardId = $(this).data("board-id");
            var boardTitle = $(this).data('board-title');
            app.dataHandler.deleteBoard(boardId, boardTitle);
        });
    },

    boardDetailsListener: function () {
        $("#boards").on("click", ".details", function(ev) {
            ev.stopPropagation();
            $('.success').remove();
            $('.error').remove();
            var boardId = $(this).data("board-id");
            app.dataHandler.getBoardDetails(boardId);
        });
    },

    loadBoardDetails: function (board) {
        $('#modal-content').empty();

        $('#modal-content').append(`
            <span class="close">&times;</span>
            <div class="modal-board-id-number">#${board.id}</div>
            <textarea class="modal-title" disabled rows="2">${board.title}</textarea>
            <p>Created: ${board.created.substring(0, board.created.length - 4)}</p>
            <p id="modal-modified">Modified: ${board.modified.substring(0, board.modified.length - 4)}</p>

            <label class="modal-description" for="mod-desc">Description</label>  
            <textarea id="mod-desc" class="modal-description" placeholder="No description found." disabled rows="5">${board.description ? board.description : ''}</textarea>
            <div class="modal-edit-submit-button-boards modal-edit-button" data-entity-id="${board.id}">Edit</div>
        `);
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
                        <div class="board-id-number">#${boardId}</div>
                        <div class="buttons-div">
                            <img data-board-id="${boardId}" data-board-title="${boardTitle}" src="static/images/trash.svg" class="delete" alt="DEL">
                            <img data-board-id="${boardId}" src="static/images/details.svg" class="details" alt="MORE">
                        </div>
                        <h2 class="board-title">${boardTitle}</h2>
                        <p class="card-count" data-board-id="${boardId}">Cards: ${cardCount}</p>
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
    },

    editBoardListener: function () {
        $('#modal-content').on('click', '.modal-edit-button', function(ev) {
            ev.stopPropagation();

            originalBoardTitle = $('.modal-title').val();
            originalBoardDesc = $('textarea.modal-description').val();

            $('.modal-title').prop('disabled', false);
            $('.modal-title').addClass('enabled-modal-title');
            $('textarea.modal-description').prop('disabled', false);
            $('textarea.modal-description').addClass('enabled-modal-description');

            $('.modal-title').focus();
            $('.modal-title').val('');
            $('.modal-title').val(originalBoardTitle);

            $(this).text('Submit');
            $(this).addClass('modal-submit-button');
            $(this).removeClass('modal-edit-button');
        });
    },

    submitBoardListener: function () {
        $('#modal-content').on('click', '.modal-submit-button', function(ev) {
            ev.stopPropagation();

            var boardId = $(this).data('entity-id');
            var newTitle = $('.modal-title').val();
            var newDesc = $('textarea.modal-description').val();

            $('.modal-title').prop('disabled', true);
            $('.modal-title').removeClass('enabled-modal-title');
            $('textarea.modal-description').prop('disabled', true);
            $('textarea.modal-description').removeClass('enabled-modal-description');

            $(this).text('Edit');
            $(this).removeClass('modal-submit-button');
            $(this).addClass('modal-edit-button');

            app.dataHandler.editBoard(boardId, newTitle, newDesc);
        });
    },

    boardChangeSuccess: function (newModDate, boardId, newTitle) {

        app.common.toastMessage(`Board #${boardId} changed successfully.`);
        $('.success').remove();
        $('.error').remove();
        $('#boards h1').after(`<p class="success">Board #${boardId} changed successfully.</p>`);

        $('#modal-modified').text(`Modified: ${newModDate.substring(0, newModDate.length - 4)}`);
        $(`#board-id-${boardId} h2`).text(newTitle);

    },

    boardChangeFail: function () {

        app.common.toastMessage(`Wrong input. Title must be 1-30 characters long, while title cannot exceed 255 characters.`);
        $('.success').remove();
        $('.error').remove();
        $('#boards h1').after(`<p class="error">Wrong input. Title must be 1-30 characters long, while title cannot exceed 255 characters.</p>`);

        $('.modal-title').val(originalBoardTitle);
        $('textarea.modal-description').val(originalBoardDesc);
    }
};
