var app = app || {};

// this object contains the functions which create
// and remove dom elements
app.dom = {
    showBoards: function() {
        // shows #boards div and hides #cards
        // using the boards data it creates the boards
        // on the page, appending them to #boards div
        $('#cards').hide();
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
                var boardDivOuter = $('<div class="col-sm-3"></div>')
                var boardDiv = $('<div class="board-div"></div>');
                boardDiv.on('click', function() {
                    var boardId = app.dataHandler.boards[i].id;
                    app.dom.showCards(boardId);
                });
                boardDiv.html('<h2 class="board-title">' + boards[i].title + '</h2>' +
                              '<p class="card-count">Cards: ' + boards[i].cards.length + '</p>');
            boardDivOuter.append(boardDiv);
            boardsRow.append(boardDivOuter);
            }
        }
    },
    showCards: function(boardId) {
        // shows #cards div and hides #boards
        // using the boards data it creates the cards
        // on the page, appending them to #cards div
        $('#boards').hide();
        $('#cards').show();

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

        var newCardsCol = $('<div class="col-sm-12 col-lg-3 card-pool-col" id="new-cards-col"></div>');
        var inProgressCardsCol = $('<div class="col-sm-12 col-lg-3 card-pool-col" id="inprogress-cards-col"></div>');
        var doneCardsCol = $('<div class="col-sm-12 col-lg-3 card-pool-col" id="done-cards-col"></div>');
        var reviewCardsCol = $('<div class="col-sm-12 col-lg-3 card-pool-col" id="review-cards-col"></div>');

        createCardDivsAndAppend(newCards, newCardsCol, boardId, 'New');

        createCardDivsAndAppend(inProgressCards, inProgressCardsCol, boardId, 'In Progress');

        createCardDivsAndAppend(reviewCards, reviewCardsCol, boardId, 'Review');

        createCardDivsAndAppend(doneCards, doneCardsCol, boardId, 'Done');

        // Then append 4 cols to main row
        cardsMainRow.append(newCardsCol, inProgressCardsCol, reviewCardsCol, doneCardsCol);
        $('#cards').append(cardsMainRow);

    }
    // here comes more features
}


function createAddNewBoardDiv () {
    var newRow = $('<div class="row" id="boards-row"></div>');
    var newBoardDiv = $('<div class="col-sm-12 id="new-board-div"></div>');
    var newBoardButton = $('<button id="new-board-button">Add New Board</button>');
    var newBoardForm = $('<div id="new-board-form"></div>');
    var newBoardInput = $('<input type="text" id="new-board-title">');
    var newBoardSubmit = $('<button class="new-entry">Submit</button>');

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
    var newCardSubmit = $('<button class="new-entry">Submit</button>');

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
        $('#cards').hide();
        $('#boards').show();
        // Refresh card count for boards:

        var cardCountElements = $('.card-count');

        var upToDateCardCounts = new Array();
        for (let i = 0; i < app.dataHandler.boards.length; i++) {
            upToDateCardCounts.push(app.dataHandler.boards[i].cards.length);
        }

        for (let i = 0; i < cardCountElements.length; i++) {
            $(cardCountElements[i]).text('Cards: ' + upToDateCardCounts[i]);
        }
    })

    newCardForm.css('display', 'none');
    newCardForm.append(newCardInput, newCardSubmit);

    cardsNavDiv.append(boardTitleHeading, newCardButton, backToBoardsButton, newCardForm)
    cardsNavRow.append(cardsNavDiv);

    return cardsNavRow;
}


function createCardDivsAndAppend (cardPool, cardPoolDiv, boardId, cardPoolTitle) {

    cardPoolDiv.append($('<h2>' + cardPoolTitle + '</h2>'));

    if (cardPool.length > 0) {
        for (let i = 0; i < cardPool.length; i++) {

            var cardDiv = $('<div class="row card-div" id="card-div-id-' + cardPool[i].id + '"></div>');
            var cardTitleInput = $('<input type="text" class="card-title disabled-title" id="card-title-id-' + cardPool[i].id + '" disabled value="' + cardPool[i].title + '">');
            var cardOrder = $('<div class="card-order" id="card-order-id-' + cardPool[i].id + '"></div>');
            var cardNewTitleSubmit = $('<button id="card-submit-id-' + cardPool[i].id + '">Rename card</button>');
            // var cardToggle = $('<button>Edit</button>');

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

            // Event listeners: drag and drop on card divs

            cardDiv.on('dragstart', function(ev) {
                drag(ev);
            });

            cardDiv.attr('draggable', true);

            cardDiv.on('drop', function(ev) {
                drop(ev);
            });

            cardDiv.on('dragover', function(ev) {
                allowDrop(ev);
            });

            cardDiv.append(cardTitleInput, cardOrder, cardNewTitleSubmit);
            cardPoolDiv.append(cardDiv);
        }

        var dropZone = $('<div class="drop-zone no-border"></div>')

        dropZone.on('drop', function(ev) {
            drop(ev);
        });

        dropZone.on('dragover', function(ev) {
            allowDrop(ev);
        });

        cardPoolDiv.append(dropZone);

    } else {
        var dropZone = $('<div class="drop-zone no-border"></div>')

        dropZone.on('drop', function(ev) {
            drop(ev);
        });

        dropZone.on('dragover', function(ev) {
            allowDrop(ev);
        });

        cardPoolDiv.append(dropZone);
    }
}


// Drag and drop:

function allowDrop(ev) {
    ev.preventDefault();
    ev.stopPropagation();
}

function drag(ev) {
    ev.stopPropagation();
    ev.originalEvent.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    var movedElementId = ev.originalEvent.dataTransfer.getData("text");
    var movedElement = document.getElementById(movedElementId);

    var dropTarget = $(event.target);

    console.log(dropTarget);
    console.log('HEEEEERREE');
    console.log(dropTarget.hasClass('card-div'));
    console.log(dropTarget.hasClass('drop-zone'));
    if (!dropTarget.hasClass('drop-zone')){
        while (!dropTarget.hasClass('card-div')) {
            dropTarget = dropTarget.parent();
        }
    }

    dropTarget.before(movedElement);

    makePersistent(movedElement, dropTarget); // MAST KELL BEADNI!!!!
}


function makePersistent (movedElement, dropTarget) {

    var movedCardId = Number(movedElement.id.slice(12));

    var parentColId = dropTarget.parent().attr('id');

    var newStatus;
    switch (parentColId) {
        case 'inprogress-cards-col':
            newStatus = 'in_progress';
            break;
        case 'review-cards-col':
            newStatus = 'review';
            break;
        case 'done-cards-col':
            newStatus = 'done';
            break;
        case 'new-cards-col':
            newStatus = 'new';
            break;
    }


    var cardsOnBoard = $('.card-div');
    var iDsOfcardsOnBoard = new Array();
    for (let i = 0; i < cardsOnBoard.length; i++) {
        iDsOfcardsOnBoard.push(Number(cardsOnBoard[i].id.slice(12)));
    }

    console.log(iDsOfcardsOnBoard);

    for (var h = 0; h < iDsOfcardsOnBoard.length; h++) {
        for (var i = 0; i < app.dataHandler.boards.length; i++) {
            for (var j = 0; j < app.dataHandler.boards[i].cards.length; j++) {
                if (movedCardId === app.dataHandler.boards[i].cards[j].id) {
                    app.dataHandler.boards[i].cards[j].status = newStatus;
                }
                if (iDsOfcardsOnBoard[h] === app.dataHandler.boards[i].cards[j].id) {
                    app.dataHandler.boards[i].cards[j].order = h + 1;
                    console.log(app.dataHandler.boards[i].cards[j].order);
                    console.log(iDsOfcardsOnBoard[h]);
                    console.log(h + 1);
                }
            }
        }
    }

    localStorage.setItem('boards', JSON.stringify(app.dataHandler.boards));

}
