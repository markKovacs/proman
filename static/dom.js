var app = app || {};

// this object contains the functions which create
// and remove dom elements
app.dom = {
    showBoards: function() {
        // shows #boards div and hides #cards
        // using the boards data it creates the boards
        // on the page, appending them to #boards div

        if (app.settings.environment === 'prod') {
            app.dataHandler.loadBoards();
        }
        else {
            app.dataHandler.loadTestBoards();
        }

        var boards = app.dataHandler.boards;
        var boardsDiv = $('<div id="boards"></div>');
        $('#wrapper').append(boardsDiv);

        for (let i = 0; i < boards.length; i++) {
            var boardDiv = $('<div class="board-div"></div>');
            boardDiv.click(function() {
                showBoards(boards[i].id);
            });
            boardDiv.html('<h2 class="board-title">' + boards[i].title + '</h2>' +
                          '<p class="card-count">Cards: ' + boards[i].cardCount + '</p>');
            boardsDiv.append(boardDiv);
        }
    },
    showCards: function(boardId) {
        // shows #cards div and hides #boards
        // using the boards data it creates the cards
        // on the page, appending them to #cards div
    }
    // here comes more features
}
