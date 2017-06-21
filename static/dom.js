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

        var boards = app.dataHandler.boards
        var newBoardDiv = createAddNewBoardDiv();
        $('#boards').append(newBoardDiv);

        if (boards) {
            for (let i = 0; i < boards.length; i++) {
                if (i === 0 || i % 4 === 0) {
                    var boardsRow = $('<div class="row"></div>');
                    $('#boards').append(boardsRow);
                }
                var boardDiv = $('<div class="col-sm-3 board-div"></div>');
                boardDiv.on('click', function() {
                    var boardId = app.dataHandler.boards[i].id;
                    app.dom.showCards(boardId);
                });
                boardDiv.html('<h2 class="board-title">' + boards[i].title + '</h2>' +
                              '<p class="card-count">Cards: ' + boards[i].cards.length + '</p>');

            boardsRow.append(boardDiv);
            }
        }
    },
    showCards: function(boardId) {
        // shows #cards div and hides #boards
        // using the boards data it creates the cards
        // on the page, appending them to #cards div
        $('#boards').hide();

        var selectedBoard = app.dataHandler.getBoard(boardId);


        // New code for card into 4 START

        var newCards = new Array();
        var inProgressCards = new Array();
        var doneCards = new Array();
        var reviewCards = new Array();

        for (let i = 0; i < selectedBoard.cards.length; i++) {
            switch (selectedBoard.cards[i].status) {
                case 'new':
                    newCards.push(selectedBoard.cards[i]);
                    break;
                case 'in_progress':
                    inProgressCards.push(selectedBoard.cards[i]);
                    break;
                case 'done':
                    doneCards.push(selectedBoard.cards[i]);
                    break;
                case 'review':
                    reviewCards.push(selectedBoard.cards[i]);
                    break;
            }
        }

        // Sort the 4 new pools:

        newCards.sort(function(a, b) {
            return a.order - b.order;
        });

        inProgressCards.sort(function(a, b) {
            return a.order - b.order;
        });

        doneCards.sort(function(a, b) {
            return a.order - b.order;
        });

        reviewCards.sort(function(a, b) {
            return a.order - b.order;
        });

        // New code for cards into 4 END





        var cardsNavRow = createCardNavDiv(boardId, selectedBoard.title);
        $('#cards').append(cardsNavRow);

        // New code START
        var cardsMainRow = $('<div class="row" id="cards-main-row"></div>');

        var newCardsCol = $('<div class="col-sm-12 col-lg-3" id="new-cards-col"></div>');
        var inProgressCardsCol = $('<div class="col-sm-12 col-lg-3" id="inprogress-cards-col"></div>');
        var doneCardsCol = $('<div class="col-sm-12 col-lg-3" id="done-cards-col"></div>');
        var reviewCardsCol = $('<div class="col-sm-12 col-lg-3" id="review-cards-col"></div>');

        if (newCards.length > 0) {
            createCardDivsAndAppend(newCards, newCardsCol, boardId);
        }
        if (inProgressCards.length > 0) {
            createCardDivsAndAppend(inProgressCards, inProgressCardsCol, boardId);
        }
        if (doneCards.length > 0) {
            createCardDivsAndAppend(doneCards, doneCardsCol, boardId);
        }
        if (reviewCards.length > 0) {
            createCardDivsAndAppend(reviewCards, reviewCardsCol, boardId);
        }

        // Then append 4 cols to main row
        cardsMainRow.append(newCardsCol, inProgressCardsCol, doneCardsCol, reviewCardsCol);
        $('#cards').append(cardsMainRow);

        // New code END

        // if (selectedBoard.cards.length > 0) {
        //     for (let i = 0; i < selectedBoard.cards.length; i++) {
        //         if (i === 0 || i % 4 === 0) {
        //             var cardsRow = $('<div class="row"></div>');
        //             $('#cards').append(cardsRow);
        //         }
        //         var cardDiv = $('<div class="col-sm-3 card-div"></div>');
        //         var cardTitle = $('<h2 class="card-title" id="card-h2-id-' + selectedBoard.cards[i].id + '">' + selectedBoard.cards[i].title + '</div>');
        //         var cardEditForm = $('<div class="card-edit-form" id="card-form-id-' + selectedBoard.cards[i].id + '"></div>');
        //         var cardTitleInput = $('<input type="text" class="card-new-title" id="card-title-id-' + selectedBoard.cards[i].id + '">');
        //         var cardNewTitleSubmit = $('<button>Submit</button>');
        //         var cardToggle = $('<button>Toggle</button>');

        //         cardNewTitleSubmit.on('click', function() {
        //             var newTitle = $('#card-title-id-' + selectedBoard.cards[i].id);
        //             var newTitleValue = newTitle.val();
        //             app.dataHandler.editCard(selectedBoard.id, selectedBoard.cards[i].id, newTitleValue);

        //             $('#card-form-id-' + selectedBoard.cards[i].id).hide();
        //             newTitle.val('');
        //             $('#card-h2-id-' + selectedBoard.cards[i].id).text(newTitleValue);
        //         })

        //         cardEditForm.append(cardTitleInput, cardNewTitleSubmit);
        //         cardEditForm.css('display', 'none');

        //         cardToggle.on('click', function() {
        //             $('#card-form-id-' + selectedBoard.cards[i].id).toggle();
        //         });

        //         cardDiv.append(cardTitle, cardToggle, cardEditForm);
        //         cardsRow.append(cardDiv);
        //         $('#cards').append(cardsRow);
        //     }
        // }

    }
    // here comes more features
}


function createAddNewBoardDiv () {
    var newRow = $('<div class="row" id="boards-row"></div>');
    var newBoardDiv = $('<div class="col-sm-12 id="new-board-div"></div>');
    var newBoardButton = $('<button id="new-board-button">Add New Board</button>');
    var newBoardForm = $('<div id="new-board-form"></div>');
    var newBoardInput = $('<input type="text" id="new-board-title">');
    var newBoardSubmit = $('<button>Submit</button>');

    newBoardForm.append(newBoardInput);
    newBoardSubmit.click(function() {
        var boardTitle = $('#new-board-title').val();
        app.dataHandler.createNewBoard(boardTitle);
        $('#boards').empty();
        app.dom.showBoards();
    })
    newBoardForm.append(newBoardSubmit);
    newBoardForm.css('display', 'none');

    newBoardButton.click(function() {
        $('#new-board-form').toggle();
    })
    newBoardDiv.append(newBoardButton, newBoardForm);
    newRow.append(newBoardDiv);

    return newRow;
}


function createCardNavDiv (boardId, boardTitle) {
    var boardTitleHeading = $('<h2>' + boardTitle + '</h2>');
    var cardsNavRow = $('<div class="row" id="cards-nav-row"></div>');
    var cardsNavDiv = $('<div class="col-sm-12 id="cards-nav-div"></div>');
    var newCardButton = $('<button id="new-card-button">Add New Card</button>');
    var backToBoardsButton = $('<button id="back-to-boards">Back to Boards</button>');
    var newCardForm = $('<div id="new-card-form"></div>');
    var newCardInput = $('<input type="text" id="new-card-title">');
    var newCardSubmit = $('<button>Submit</button>');

    newCardSubmit.click(function() {
        var cardTitle = $('#new-card-title').val();
        app.dataHandler.createNewCard(boardId, cardTitle);
        $('#cards').empty();
        app.dom.showCards(boardId);
    })

    newCardButton.click(function() {
        $('#new-card-form').toggle();
    })

    backToBoardsButton.click(function() {
        $('#cards').empty();
        $('#boards').show();
    })

    newCardForm.css('display', 'none');
    newCardForm.append(newCardInput, newCardSubmit);

    cardsNavDiv.append(boardTitleHeading, newCardButton, backToBoardsButton, newCardForm)
    cardsNavRow.append(cardsNavDiv);

    return cardsNavRow;
}


function createCardDivsAndAppend (cardPool, cardPoolDiv, boardId) {
    // Load (append) card object divs in order into 4 cols
    // In a for cycle, create all necessary elements and create card blocks with unique ID
    for (let i = 0; i < cardPool.length; i++) {

        var cardDiv = $('<div class="row card-div" id="card-div-id-' + cardPool[i].id + '"></div>');
        var cardTitleInput = $('<input type="text" class="card-title disabled-title" id="card-title-id-' + cardPool[i].id + '" disabled value="' + cardPool[i].title + '">');
        var cardOrder = $('<p class="card-order" id="card-order-id-' + cardPool[i].id + '"></p>');
        var cardNewTitleSubmit = $('<button id="card-submit-id-' + cardPool[i].id + '">Submit</button>');
        var cardToggle = $('<button>Edit</button>');

        cardOrder.text('Order: ' + String(cardPool[i].order));


        cardNewTitleSubmit.on('click', function() {
            var newTitle = $('#card-title-id-' + cardPool[i].id);
            var newTitleValue = newTitle.val();
            app.dataHandler.editCard(boardId, cardPool[i].id, newTitleValue);

            $('#card-title-id-' + cardPool[i].id).text(newTitleValue);
            
            var selectedCardTitle = $('#card-title-id-' + cardPool[i].id);
            selectedCardTitle.toggleClass('disabled-title');
            if (selectedCardTitle.attr('disabled')) {
                selectedCardTitle.prop('disabled', false);
            } else {
                selectedCardTitle.prop('disabled', true);
            }
        })

        cardToggle.on('click', function() {
            // new stuff: classToggle for cardTitleInput and cancel disabled
            var selectedCardTitle = $('#card-title-id-' + cardPool[i].id);
            selectedCardTitle.toggleClass('disabled-title');
            if (selectedCardTitle.attr('disabled')) {
                selectedCardTitle.prop('disabled', false);
            } else {
                selectedCardTitle.prop('disabled', true);
            }
        })

        // APPENDING
        cardDiv.append(cardTitleInput, cardOrder, cardNewTitleSubmit, cardToggle);
        cardPoolDiv.append(cardDiv);
    }
}