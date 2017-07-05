
var app = app || {};

app.dom = {
    // DOM manipulation related methods

    showBoards_old: function () {
        // Populate and show #boards div with 
        // board management div and all boards from database.


        appendBoardNavDiv();
        appendBoards();
    },

    showCards_old: function (boardId) {
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
        newCards.sort(function (a, b) {
            return a.order - b.order;
        });

        inProgressCards.sort(function (a, b) {
            return a.order - b.order;
        });

        doneCards.sort(function (a, b) {
            return a.order - b.order;
        });

        reviewCards.sort(function (a, b) {
            return a.order - b.order;
        });

        // Append 4 card pools:
        $('#cards').append(`
            <div class="row" id="cards-main-row">
                <div class="col-sm-12 col-lg-3 card-pool-col" id="new-cards-col"></div>
                <div class="col-sm-12 col-lg-3 card-pool-col" id="inprogress-cards-col"></div>
                <div class="col-sm-12 col-lg-3 card-pool-col" id="review-cards-col"></div>
                <div class="col-sm-12 col-lg-3 card-pool-col" id="done-cards-col"></div>
            </div>
        `);

        // Create and append cards to their respective card pool:
        appendCards(newCards, 'new-cards-col', boardId, 'New');
        appendCards(inProgressCards, 'inprogress-cards-col', boardId, 'In Progress');
        appendCards(reviewCards, 'review-cards-col', boardId, 'Review');
        appendCards(doneCards, 'done-cards-col', boardId, 'Done');

        $('#boards').hide();
        $('#cards').show();
    },

    showCards: function (cardsData, boardId, boardTitle) {
        appendCardNavDiv(boardId, boardTitle);

        if (!cardsData) {
            $('#cards').append(`
                <p>There are no cards added yet.</p>
                <div class="row" id="cards-main-row">
                    <div class="col-sm-12 col-lg-3 card-pool-col" id="new-cards-col">
                        <h2>New</h2>
                    </div>
                    <div class="col-sm-12 col-lg-3 card-pool-col" id="inprogress-cards-col">
                        <h2>In Progress</h2>
                    </div>
                    <div class="col-sm-12 col-lg-3 card-pool-col" id="review-cards-col">
                        <h2>Review</h2>
                    </div>
                    <div class="col-sm-12 col-lg-3 card-pool-col" id="done-cards-col">
                        <h2>Done</h2>
                    </div>
                </div>
            `);
            $('#boards').hide();
            $('#cards').show();
            return;
        }


        var newCards = new Array();
        var inProgressCards = new Array();
        var doneCards = new Array();
        var reviewCards = new Array();

        // Group cards by card status:
        for (let i = 0; i < cardsData.length; i++) {
            switch (cardsData[i].status) {
                case 'new':
                    newCards.push(cardsData[i]);
                    break;
                case 'in_progress':
                    inProgressCards.push(cardsData[i]);
                    break;
                case 'done':
                    doneCards.push(cardsData[i]);
                    break;
                case 'review':
                    reviewCards.push(cardsData[i]);
                    break;
            }
        }

        // Sort the 4 new card pools by card order:
        newCards.sort(function (a, b) {
            return a.card_order - b.card_order;
        });

        inProgressCards.sort(function (a, b) {
            return a.card_order - b.card_order;
        });

        doneCards.sort(function (a, b) {
            return a.card_order - b.card_order;
        });

        reviewCards.sort(function (a, b) {
            return a.card_order - b.card_order;
        });

        // Append 4 card pools:
        $('#cards').append(`
            <div class="row" id="cards-main-row">
                <div class="col-sm-12 col-lg-3 card-pool-col" id="new-cards-col"></div>
                <div class="col-sm-12 col-lg-3 card-pool-col" id="inprogress-cards-col"></div>
                <div class="col-sm-12 col-lg-3 card-pool-col" id="review-cards-col"></div>
                <div class="col-sm-12 col-lg-3 card-pool-col" id="done-cards-col"></div>
            </div>
        `);

        // Create and append cards to their respective card pool:
        appendCards(newCards, 'new-cards-col', boardId, 'New');
        appendCards(inProgressCards, 'inprogress-cards-col', boardId, 'In Progress');
        appendCards(reviewCards, 'review-cards-col', boardId, 'Review');
        appendCards(doneCards, 'done-cards-col', boardId, 'Done');


        // Title edit / Submit button event listener:
        $('#cards-main-row').on('click', '.edit-title', function (ev) {
            ev.stopPropagation();
            $('.success').remove();
            var cardId = $(this).data('card-id');

            var titleInput = $(`#card-title-id-${cardId}`);
            var newTitleValue = titleInput.val();

            if (!titleInput.hasClass('disabled-title')) {
                app.dataHandler.editCard(cardId, newTitleValue);
            }

            titleInput.toggleClass('disabled-title');

            if (titleInput.attr('disabled')) {
                titleInput.prop('disabled', false);
                $(this).text('Submit');
            } else {
                titleInput.prop('disabled', true);
                $(this).text('Edit');
            }
        });

        // Drag and drop event listeners for card divs:
        $('#cards-main-row').on({
            dragstart: function (ev) {
                drag(ev);
            },
            drop: function (ev) {
                drop(ev);
            },
            dragover: function (ev) {
                allowDrop(ev);
            },
            dragenter: function (ev) {
                if (!$(ev.target).hasClass('card-title')) {
                    $('.card-div').css('border', 'none');
                }
                $(this).css('border-top', '12px double #243342');
            },
            dragend: function (ev) {
                $('.card-div').css('border', 'none');
            }
        }, '.card-div');



        $('#boards').hide();
        $('#cards').show();
    }
}


// function appendBoardNavDiv() {
//     // Create and append the div responsible for
//     // the addition of new boards with given title.

//     $('#boards').append(`
//         <div class="row">
//             <div class="col-sm-12">
//                 <button id="new-board-button">Add New Board</button>
//                 <div id="new-board-form">
//                     <input type="text" id="new-board-title">
//                     <button id="new-board-entry">Submit</button>
//                 </div>
//             </div>
//         </div>
//     `);

//     $('#new-board-entry').on('click', function () {
//         var boardTitle = $('#new-board-title').val();
//         app.dataHandler.createNewBoard(boardTitle);
//         $('#boards').empty();
//         $('#cards').hide();
//         app.dom.showBoards();
//     });

//     $('#new-board-button').on('click', function () {
//         $('#new-board-form').toggle();
//     });
// }


// function appendBoards() {
//     // Create and append boards, based on stored boards data.

//     var boardsData = app.dataHandler.boards;

//     for (let i = 0; i < boardsData.length; i++) {

//         if (i === 0 || i % 4 === 0) {
//             var boardsRow = $('<div class="row"></div>');
//             $('#boards').append(boardsRow);
//         }

//         boardsRow.append(`
//             <div class="col-sm-3">
//                 <div class="board-div" data-board-id="${app.dataHandler.boards[i].id}">
//                     <h2 class="board-title">${boardsData[i].title}</h2>
//                     <p class="card-count">Cards: ${boardsData[i].cards.length}</p>
//                 </div>
//             </div>
//         `);
//     }

//     $('.board-div').on('click', function () {
//         var boardId = $(this).data('board-id');
//         app.dom.showCards(boardId);
//     });
// }


function appendCardNavDiv(boardId, boardTitle) {
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

    $('#new-card-entry').on('click', function () {
        $('.success').remove();
        var cardTitle = $('#new-card-title').val();
        app.dataHandler.createNewCard(boardId, cardTitle);

        // These will not be needed anymore:

        // $('#cards').empty();
        // app.dom.showCards(boardId);
    });

    $('#new-card-button').on('click', function () {
        $('#new-card-form').toggle();
    });

    $('#back-to-boards').on('click', function () {
        // Refresh card count for boards:
        $('.success').remove();
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


function appendCards(cardPool, cardPoolDivId, boardId, cardPoolTitle) {
    // Append cards to cards pool divs respectively.
    // Assign event listeners to drag and drop and edit title buttons.

    var cardPoolDiv = $(`#${cardPoolDivId}`);
    cardPoolDiv.append(`<h2>${cardPoolTitle}</h2>`);

    if (cardPool.length > 0) {
        for (let i = 0; i < cardPool.length; i++) {

            cardPoolDiv.append(`
                <div class="row card-div" id="card-div-id-${cardPool[i].id}" draggable="true">
                    <input class="card-title disabled-title" id="card-title-id-${cardPool[i].id}" disabled value="${cardPool[i].title}">
                    <div class="card-order" id="card-order-id-${cardPool[i].id}">Order: ${cardPool[i].order}</div>
                    <button class="edit-title" id="card-submit-id-${cardPool[i].id}" data-card-id="${cardPool[i].id}">Edit</button>
                </div>
            `);
        }
    }

    // Appending drop zone at the end of column:
    var dropZone = $('<div class="drop-zone no-border"></div>');

    dropZone.on({
        drop: function (ev) {
            drop(ev);
            $(ev.target).css('border', 'none');
        },
        dragover: function (ev) {
            allowDrop(ev);
        },
        dragenter: function () {
            $('.card-div').css('border', 'none');
            $(this).css('border', '3px dashed gray');
        },
        dragleave: function () {
            $(this).css('border', 'none');
        }
    });

    cardPoolDiv.append(dropZone);
}


function allowDrop(ev) {
    // Allow drop upon 'dragover' by canceling the default behaviour.

    ev.preventDefault();
    ev.stopPropagation();
}

function drag(ev) {
    // Upon 'dragstart' save the id of dragged item,
    // preparing it to be replaced in the DOM tree.

    ev.stopPropagation();
    ev.originalEvent.dataTransfer.setData("target_id", $(ev.target).attr('id'));
}

function drop(ev) {
    // Upon 'drop' replace the element being dragged
    // by inserting before the element it was moved over.
    // Function checks class and adjusts drop target accordingly.

    ev.preventDefault();
    ev.stopPropagation();

    $('.success').remove();

    var movedElementId = ev.originalEvent.dataTransfer.getData("target_id");
    var movedElement = $(`#${movedElementId}`);

    var dropTarget = $(event.target);

    if (!dropTarget.hasClass('drop-zone')) {
        while (!dropTarget.hasClass('card-div')) {
            dropTarget = dropTarget.parent();
        }
    }

    dropTarget.before(movedElement);
    makePersistent(movedElement, dropTarget);
}


function makePersistent(movedElement, dropTarget) {
    // Based on DOM tree, does re-ordering of all cards in board,
    // furthermore overwrites dragged card status with new status.

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
    debugger;
    var cardsOnBoard = $('.card-div');
    var iDsOfcardsOnBoard = new Array();
    for (let i = 0; i < cardsOnBoard.length; i++) {
        iDsOfcardsOnBoard.push(Number(cardsOnBoard[i].id.slice(12)));
    }


    // ajax call doing the logic below
    app.dataHandler.makeDragAndDropPersistent(movedCardId, newStatus, iDsOfcardsOnBoard);



    // for (var h = 0; h < iDsOfcardsOnBoard.length; h++) {
    //     for (var i = 0; i < app.dataHandler.boards.length; i++) {
    //         for (var j = 0; j < app.dataHandler.boards[i].cards.length; j++) {
    //             if (movedCardId === app.dataHandler.boards[i].cards[j].id) {
    //                 app.dataHandler.boards[i].cards[j].status = newStatus;
    //             }
    //             if (iDsOfcardsOnBoard[h] === app.dataHandler.boards[i].cards[j].id) {
    //                 app.dataHandler.boards[i].cards[j].order = h + 1;
    //             }
    //         }
    //     }
    // }

    // app.dataHandler.saveBoards();
}
