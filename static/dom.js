
var app = app || {};

app.dom = {
    // DOM manipulation related methods

    showCards: function (cardsData, boardId, boardTitle) {
        $("#cards").empty();
        appendCardNavDiv(boardId, boardTitle);

        if (!cardsData) {
            $('#cards').append(`
                <p>There are no cards added yet.</p>
                <div class="row" id="cards-main-row">
                    <div class="col-sm-12 col-lg-3 card-pool-col" id="new-cards-col">
                        <h2>New</h2>
                        <div class="drop-zone no-border"></div>
                    </div>
                    <div class="col-sm-12 col-lg-3 card-pool-col" id="inprogress-cards-col">
                        <h2>In Progress</h2>
                        <div class="drop-zone no-border"></div>
                    </div>
                    <div class="col-sm-12 col-lg-3 card-pool-col" id="review-cards-col">
                        <h2>Review</h2>
                        <div class="drop-zone no-border"></div>
                    </div>
                    <div class="col-sm-12 col-lg-3 card-pool-col" id="done-cards-col">
                        <h2>Done</h2>
                        <div class="drop-zone no-border"></div>
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
        appendCards(newCards, 'new-cards-col', boardId, 'New', boardTitle);
        appendCards(inProgressCards, 'inprogress-cards-col', boardId, 'In Progress', boardTitle);
        appendCards(reviewCards, 'review-cards-col', boardId, 'Review', boardTitle);
        appendCards(doneCards, 'done-cards-col', boardId, 'Done', boardTitle);

        $('#cards-main-row').on({
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
        }, '.drop-zone');

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
    },

    insertNewCard: function(id, title, order, boardTitle, boardId) {
        $('#new-cards-col div.drop-zone').before(addParamString(id, title, order, boardTitle, boardId));
    },

    resetForm: function(cardTitle) {
        $("#new-card-title").val('');
        $("#new-card-form").toggle();
        $('#cards').prepend(`<p class="success">New card with title '${cardTitle}' added.</p>`);
    },

    appendNewBoard: function(title, id) {
        var boardsInLastRow = $('#boards div.row:last').children().length;
        if ($(".board-div").children().length === 0 || boardsInLastRow % 4 === 0 ) {
            $('#boards').append(`<div class="row"></div>`);
        }
        var initCardCount = 0;
        $('#boards div.row:last').append(getBoardString(title, id, initCardCount));
        $('#boards').prepend(`<p class="success">Board '${title}' added.</p>`);
        $('#new-board-title').val('');
        $('#new-board-form').toggle();
    }
}

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
        app.dataHandler.createNewCard(boardId, cardTitle, boardTitle);

    });

    $('#new-card-button').on('click', function () {
        $('#new-card-form').toggle();
    });

    $('#back-to-boards').on('click', function () {
        window.location.replace("/boards");
    });
}


function appendCards(cardPool, cardPoolDivId, boardId, cardPoolTitle, boardTitle) {
    // Append cards to cards pool divs respectively.
    // Assign event listeners to drag and drop and edit title buttons.

    var cardPoolDiv = $(`#${cardPoolDivId}`);
    cardPoolDiv.append(`<h2>${cardPoolTitle}</h2>`);

    if (cardPool.length > 0) {
        for (let i = 0; i < cardPool.length; i++) {
            cardPoolDiv.append(addParamString(cardPool[i].id, cardPool[i].title, cardPool[i].order, boardTitle, boardId));
        }
    }

    // Appending drop zone at the end of column:
    var dropZone = $('<div class="drop-zone no-border"></div>');

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

    var cardsOnBoard = $('.card-div');
    var iDsOfcardsOnBoard = new Array();
    for (let i = 0; i < cardsOnBoard.length; i++) {
        iDsOfcardsOnBoard.push(Number(cardsOnBoard[i].id.slice(12)));
    }
    app.dataHandler.makeDragAndDropPersistent(movedCardId, newStatus, iDsOfcardsOnBoard);
}

function addParamString(cardId, cardTitle, cardOrder, boardTitle, boardId) {
    var str = 
        `<div class="row card-div" id="card-div-id-${cardId}" draggable="true">
            <input class="card-title disabled-title" id="card-title-id-${cardId}" disabled value="${cardTitle}">
            <div class="card-order" id="card-order-id-${cardId}">Order: ${cardOrder}</div>
            <div class="edit-title" id="card-submit-id-${cardId}" data-card-id="${cardId}">Edit</div>
            <div class="delete" data-card-id="${cardId}" data-board-id="${boardId}" data-board-title="${boardTitle}">X</div>
        </div>`;
    return str;
}


function getBoardString(title, id, cardCount) {

    return `<div class="col-sm-3">
                <div class="outer-board-div">
                    <div class="board-div" data-board-id="${id}" data-board-title="${title}">
                        <h2 class="board-title">${title}</h2>
                        <p class="card-count">Cards: ${cardCount}</p>
                    </div>
                    <div><span class="delete" data-board-id=${id}>X</span></div>
                </div>
            </div>`;
}

function flashCardEditSuccess(cardId, newTitle) {
    $('#cards').prepend(`<p class="success">Card #${cardId} title edited to '${newTitle}'.</p>`);
}

function flashDragDropSuccess(movedCardId) {
    $('#cards').prepend(`<p class="success">Card #${movedCardId} replacement saved.</p>`);
}

$("#boards").on("click", ".delete", function() {
    $('.success').remove();
    var boardId = $(this).data("board-id")
    app.dataHandler.deleteBoard(boardId);
});

$("#cards").on("click", ".delete", function() {
    $('.success').remove();
    var cardId = $(this).data("card-id");
    var boardId = $(this).data("board-id");
    var boardTitle = $(this).data("board-title");
    app.dataHandler.deleteCard(cardId, boardId, boardTitle);
});