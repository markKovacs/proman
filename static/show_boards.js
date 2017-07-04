
// showBoards function automatically called
// var boardsData already defined before script



function appendBoardNavDiv () {
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
        var boardTitle = $('#new-board-title').val();
        app.dataHandler.createNewBoard(boardTitle);
        $('#boards').empty();
        $('#cards').hide();
        showBoards();
    });

    $('#new-board-button').on('click', function() {
        $('#new-board-form').toggle();
    });
}


function appendBoards () {
    // Create and append boards, based on stored boards data.

    for (let i = 0; i < boardsData.length; i++) {

        if (i === 0 || i % 4 === 0) {
            var boardsRow = $('<div class="row"></div>');
            $('#boards').append(boardsRow);
        }

        boardsRow.append(`
            <div class="col-sm-3">
                <div class="board-div" data-board-id="${boardsData[i].id}" data-board-title="${boardsData[i].title}">
                    <h2 class="board-title">${boardsData[i].title}</h2>
                    <p class="card-count">Cards: ${boardsData[i].card_count}</p>
                </div>
            </div>
        `);
    }

    $('.board-div').on('click', function() {
        var boardId = $(this).data('board-id');
        var boardTitle = $(this).data('board-title');
        app.dom.showCards(boardId, boardTitle); // not working yet
    });
}


function showBoards () {
    appendBoardNavDiv();
    appendBoards();
}


$(document).ready(showBoards());
