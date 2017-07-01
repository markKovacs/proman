
var app = app || {};

app.dom = {
    // DOM manipulation related methods

    showBoards: function() {
        // Populate and show #boards div with 
        // board management div and all boards from database.

        if (app.settings.environment === 'prod') {
            app.dataHandler.loadBoards();
        } else {
            app.dataHandler.loadTestBoards();
        }

        appendBoardNavDiv();
        appendBoards();
    },

    showCards: function(boardId) {
        // Populate and show #cards div and hide #boards div.
        // Create and append cards navigation div and cards based board data.

        var selectedBoard = app.dataHandler.getBoard(boardId);

        appendCardNavDiv(boardId, selectedBoard.title);

        var newCards = new Array();
        var inProgressCards = new Array();
        var doneCards = new Array();
        var reviewCards = new Array();

        // Group cards by card status:
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

        // Sort the 4 new card pools by card order:
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

        // Append 4 card pools:
        $('#cards').append(`
            <div class="row" id="cards-main-row">
                <div class="col-sm-12 col-lg-3 card-pool-col" id="new-cards-col"></div>
                <div class="col-sm-12 col-lg-3 card-pool-col" id="inprogress-cards-col"></div>
                <div class="col-sm-12 col-lg-3 card-pool-col" id="done-cards-col"></div>
                <div class="col-sm-12 col-lg-3 card-pool-col" id="review-cards-col"></div>
            </div>
        `);

        // Create and append cards to their respective card pool:
        appendCards(newCards, 'new-cards-col', boardId, 'New');
        appendCards(inProgressCards, 'inprogress-cards-col', boardId, 'In Progress');
        appendCards(reviewCards, 'done-cards-col', boardId, 'Review');
        appendCards(doneCards, 'review-cards-col', boardId, 'Done');

        $('#boards').hide();
        $('#cards').show();
    }
    // here comes more features
}


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
        app.dom.showBoards();
    });

    $('#new-board-button').on('click', function() {
        $('#new-board-form').toggle();
    });
}


function appendBoards () {
    // Create and append boards, based on stored boards data. 
    var boardsData = app.dataHandler.boards;

    for (let i = 0; i < boardsData.length; i++) {

        if (i === 0 || i % 4 === 0) {
            var boardsRow = $('<div class="row"></div>');
            $('#boards').append(boardsRow);
        }

        boardsRow.append(`
            <div class="col-sm-3">
                <div class="board-div" data-board-id="${app.dataHandler.boards[i].id}">
                    <h2 class="board-title">${boardsData[i].title}</h2>
                    <p class="card-count">Cards: ${boardsData[i].cards.length}</p>
                </div>
            </div>
        `);
    }

    $('.board-div').on('click', function() {
        var boardId = $(this).data('board-id');
        app.dom.showCards(boardId);
    });
}


function appendCardNavDiv (boardId, boardTitle) {
    // Create and append div responsible for
    // navigation back to boards and new card creation.
    $('#cards').append(`
        <div class="row">
            <div class="col-sm-12">
                <h2>${boardTitle}</h2>
                <button id="new-card-button">Add New Card</button>
                <button id="back-to-boards">Back to Boards</button>
                <div id="new-card-form">
                    <input type="text" id="new-card-title">
                    <button id="new-card-entry">Submit</button>
                </div>
            </div>
        </div>
    `);

    $('#new-card-entry').on('click', function() {
        var cardTitle = $('#new-card-title').val();
        app.dataHandler.createNewCard(boardId, cardTitle);
        $('#cards').empty();
        app.dom.showCards(boardId);
    });

    $('#new-card-button').on('click', function() {
        $('#new-card-form').toggle();
    });

    $('#back-to-boards').on('click', function() {
        // Refresh card count for boards:
        var cardCountElements = $('.card-count');
        for (let i = 0; i < app.dataHandler.boards.length; i++) {
            let cardLength = app.dataHandler.boards[i].cards.length;
            $(cardCountElements[i]).text(`Cards: ${cardLength}`);
        }

        $('#cards').hide();
        $('#boards').show();
        $('#cards').empty();
    });
}


function appendCards (cardPool, cardPoolDivId, boardId, cardPoolTitle) {
    debugger;
    var cardPoolDiv = $(`#${cardPoolDivId}`);
    cardPoolDiv.append(`<h2>${cardPoolTitle}</h2>`);

    if (cardPool.length > 0) {
        for (let i = 0; i < cardPool.length; i++) {

            var cardDiv = $('<div class="row card-div" id="card-div-id-' + cardPool[i].id + '"></div>');
            var cardTitleInput = $('<input type="text" class="card-title disabled-title" id="card-title-id-' + cardPool[i].id + '" disabled value="' + cardPool[i].title + '">');
            var cardOrder = $('<div class="card-order" id="card-order-id-' + cardPool[i].id + '"></div>');
            var cardNewTitleSubmit = $('<button id="card-submit-id-' + cardPool[i].id + '">Edit</button>');

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
                    $(this).text('Submit');
                } else {
                    selectedCardTitle.prop('disabled', true);
                    $(this).text('Edit');
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
    var movedElement = $('#' + movedElementId);

    var dropTarget = $(event.target);

    if (!dropTarget.hasClass('drop-zone')){
        while (!dropTarget.hasClass('card-div')) {
            dropTarget = dropTarget.parent();
        }
    }

    dropTarget.before(movedElement);

    makePersistent(movedElement, dropTarget);
}


function makePersistent (movedElement, dropTarget) {

    var movedCardId = Number(movedElement.attr('id').slice(12));

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

    for (var h = 0; h < iDsOfcardsOnBoard.length; h++) {
        for (var i = 0; i < app.dataHandler.boards.length; i++) {
            for (var j = 0; j < app.dataHandler.boards[i].cards.length; j++) {
                if (movedCardId === app.dataHandler.boards[i].cards[j].id) {
                    app.dataHandler.boards[i].cards[j].status = newStatus;
                }
                if (iDsOfcardsOnBoard[h] === app.dataHandler.boards[i].cards[j].id) {
                    app.dataHandler.boards[i].cards[j].order = h + 1;
                }
            }
        }
    }

    localStorage.setItem('boards', JSON.stringify(app.dataHandler.boards));
}
