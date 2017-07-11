
// DOM manipulation related to cards

var app = app || {};

app.cards = {

    showCards: function (cardsData, boardId, boardTitle) {
        // Show cards on selected board.
        this.appendCardNavDiv(boardId, boardTitle);

        if (!cardsData) {
            $('#cards').append(`
                <p class="no-cards">There are no cards added yet.</p>
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
        } else {
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
            this.appendCards(newCards, 'new-cards-col', boardId, 'New', boardTitle);
            this.appendCards(inProgressCards, 'inprogress-cards-col', boardId, 'In Progress', boardTitle);
            this.appendCards(reviewCards, 'review-cards-col', boardId, 'Review', boardTitle);
            this.appendCards(doneCards, 'done-cards-col', boardId, 'Done', boardTitle);
        }

        $('#boards').hide();
        $('#cards').show();
    },

    addDropZoneEventListeners: function () {
        // Add event listeners to drop zones at the end of each card column.
        $('#cards').on({
            drop: function (ev) {
                app.cards.drop(ev);
                $(ev.target).css('border', 'none');
            },
            dragover: function (ev) {
                app.cards.allowDrop(ev);
            },
            dragenter: function () {
                $('.card-div').css('border', 'none');
                $(this).css('border', '3px dashed gray');
            },
            dragleave: function () {
                $(this).css('border', 'none');
            }
        }, '.drop-zone');
    },

    addEditTitleEventListener: function () {
        // Title edit / Submit button event listener:

        $('#cards').on('click', '.edit-title', function (ev) {
            ev.stopPropagation();

            if (prevCardTitle) {
                var titleInputField = $($('.submit-title')[0]).prev();
                titleInputField.val(prevCardTitle);
            }

            // Disable all others:
            $('.card-title').prop('disabled', true);
            $('.card-title').addClass('disabled-title');
            $('.edit-submit-button').text('Edit');
            $('.edit-submit-button').addClass('edit-title');
            $('.edit-submit-button').removeClass('submit-title');

            // Get cardId and title input that belongs to it:
            var cardId = $(this).data('card-id');
            var titleInputField = $(`#card-title-id-${cardId}`);

            // Change input field appearance:
            titleInputField.removeClass('disabled-title');
            // Store previous title for later:
            prevCardTitle = titleInputField.val();
            // Enable input field and put in focus, put cursor at end:
            titleInputField.prop('disabled', false);
            titleInputField.focus();
            titleInputField.val('');
            titleInputField.val(prevCardTitle);
            // Change button text:
            $(this).text('Submit');
            // Change class of clicked button:
            $(this).addClass('submit-title');
            $(this).removeClass('edit-title');
        });

        $('#cards').on('click', '.submit-title', function (ev) {
            ev.stopPropagation();

            // Get cardId and title input that belongs to it:
            var cardId = $(this).data('card-id');
            var titleInputField = $(`#card-title-id-${cardId}`);

            if (prevCardTitle && titleInputField.val() !== prevCardTitle) {
                app.dataHandler.editCard(cardId, titleInputField.val(), prevCardTitle);
            }

            prevCardTitle = undefined;

            titleInputField.addClass('disabled-title');
            titleInputField.prop('disabled', true);

            $(this).text('Edit');
            $(this).addClass('edit-title');
            $(this).removeClass('submit-title');
        });


        $(window).on('click', function(event) {
            var cardId = $(event.target).data('card-id');
            var titleInputField = $($('.submit-title')[0]).prev();
            if (prevCardTitle && !$(event.target).hasClass('edit-submit-button') && $(event.target).attr('id') !== `card-title-id-${cardId}` ) {
                titleInputField.val(prevCardTitle);
                prevCardTitle = undefined;

                $('.card-title').prop('disabled', true);
                $('.card-title').addClass('disabled-title');
                $('.edit-submit-button').text('Edit');
                $('.edit-submit-button').addClass('edit-title');
                $('.edit-submit-button').removeClass('submit-title');
            }
        });
    },

    restoreCardTitle: function (cardId, oldTitle) {
        debugger;
        $('.success').remove();
        $('.error').remove();

        $(`#card-title-id-${cardId}`).val(oldTitle);

        $('#cards h1').after(`<p class="error">Card title must be 1-30 characters long.</p>`);
    },

    addCardsEventListeners: function () {
        // Drag and drop event listeners for card divs:
        $('#cards').on({
            dragstart: function (ev) {
                app.cards.drag(ev);
            },
            drop: function (ev) {
                app.cards.drop(ev);
            },
            dragover: function (ev) {
                app.cards.allowDrop(ev);
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
    },

    insertNewCard: function (id, title, order, boardTitle, boardId) {
        $('.no-cards').remove();
        $('#new-cards-col div.drop-zone').before(this.getCardHTML(id, title, order, boardTitle, boardId));
    },

    resetForm: function (cardTitle) {
        $("#new-card-title").val('');
        $("#new-card-form").toggle();
        $('#cards h1').after(`<p class="success">New card with title '${cardTitle}' added.</p>`);
    },

    appendCardNavDiv: function (boardId, boardTitle) {
        // Create and append div responsible for
        // navigation back to boards and new card creation.
        $('#cards').append(`
            <h1>${boardTitle}</h1>
            <div class="row">
                <div class="col-sm-12">
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
            $('.error').remove();
            var cardTitle = $('#new-card-title').val();
            app.dataHandler.createNewCard(boardId, cardTitle, boardTitle);
        });

        $('#new-card-button').on('click', function () {
            $('#new-card-form').toggle();
        });

        $('#back-to-boards').on('click', function () {
            // window.location.replace("/boards");
            app.dataHandler.getCurrentCardCounts();
        });
    },

    appendCards: function (cardPool, cardPoolDivId, boardId, cardPoolTitle, boardTitle) {
        // Append cards to cards pool divs respectively.
        // Assign event listeners to drag and drop and edit title buttons.
        var cardPoolDiv = $(`#${cardPoolDivId}`);
        cardPoolDiv.append(`<h2>${cardPoolTitle}</h2>`);

        if (cardPool.length > 0) {
            for (let i = 0; i < cardPool.length; i++) {
                cardPoolDiv.append(this.getCardHTML(cardPool[i].id, cardPool[i].title, cardPool[i].card_order, boardTitle, boardId));
            }
        }

        // Appending drop zone at the end of column:
        var dropZone = $('<div class="drop-zone no-border"></div>');
        cardPoolDiv.append(dropZone);
    },

    allowDrop: function (ev) {
        // Allow drop upon 'dragover' by canceling the default behaviour.
        ev.preventDefault();
        ev.stopPropagation();
    },

    drag: function (ev) {
        // Upon 'dragstart' save the id of dragged item,
        // preparing it to be replaced in the DOM tree.
        ev.stopPropagation();
        ev.originalEvent.dataTransfer.setData("target_id", $(ev.target).attr('id'));
    },

    drop: function (ev) {
        // Upon 'drop' replace the element being dragged
        // by inserting before the element it was moved over.
        // Function checks class and adjusts drop target accordingly.
        ev.preventDefault();
        ev.stopPropagation();

        $('.success').remove();
        $('.error').remove();

        var movedElementId = ev.originalEvent.dataTransfer.getData("target_id");
        var movedElement = $(`#${movedElementId}`);

        var dropTarget = $(event.target);

        if (!dropTarget.hasClass('drop-zone')) {
            while (!dropTarget.hasClass('card-div')) {
                dropTarget = dropTarget.parent();
            }
        }

        dropTarget.before(movedElement);
        app.cards.makePersistent(movedElement, dropTarget);
    },

    makePersistent: function (movedElement, dropTarget) {
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
    },

    getCardHTML: function (cardId, cardTitle, cardOrder, boardTitle, boardId) {
        return `<div class="row card-div" id="card-div-id-${cardId}" draggable="true">
                    <div class="card-order" id="card-order-id-${cardId}">Order:<br>${cardOrder}</div>
                    <div class="card-id">ID#${cardId}</div>
                    <textarea class="card-title disabled-title" id="card-title-id-${cardId}" disabled rows="3" data-card-id="${cardId}">${cardTitle}</textarea>
                    <div class="edit-submit-button edit-title" id="card-submit-id-${cardId}" data-card-id="${cardId}">Edit</div>
                    <div>
                        <img data-card-id="${cardId}" data-card-title="${cardTitle}" data-board-id="${boardId}" data-board-title="${boardTitle}" 
                            src="static/images/trash.svg" class="trash delete" alt="DEL">
                    </div>
                </div>`;
    },

    // <textarea class="card-title disabled-title" id="card-title-id-${cardId}" disabled>${cardTitle}</textarea>
    // <input class="card-title disabled-title" id="card-title-id-${cardId}" disabled value="${cardTitle}">

    flashCardEditSuccess: function (cardId, newTitle) {
        $('.success').remove();
        $('.error').remove();
        $('#cards h1').after(`<p class="success">Card #${cardId} title edited to '${newTitle}'.</p>`);
    },

    flashDragDropSuccess: function (movedCardId) {
        $('#cards h1').after(`<p class="success">Card #${movedCardId} replacement saved.</p>`);
    },

    deleteCardEventListener: function () {
        $("#cards").on("click", ".delete", function(ev) {
            ev.stopPropagation();
            $('.success').remove();
            $('.error').remove();
            var cardId = $(this).data("card-id");
            var cardTitle = $(this).data("card-title");
            var boardId = $(this).data("board-id");
            var boardTitle = $(this).data("board-title");
            app.dataHandler.deleteCard(cardId, cardTitle, boardId, boardTitle);
        });
    },

    removeCardDiv: function (cardId) {
        $(`#card-div-id-${cardId}`).remove();
        var numberOfCardDivs = $('.card-div').length;
        if (numberOfCardDivs === 0) {
            $('#cards div.row:first').after(`<p class="no-cards">There are no cards added yet.</p>`);
        }
    },

    flashDeleteCardMessage: function (cardTitle) {
        $('#cards h1').after(`<p class="success">Card '${cardTitle}' has been deleted.</p>`);
    },

    flashDataErrorMessage: function () {
        $('.success').remove();
        $('.error').remove();

        $('#new-card-title').val('');
        $('#new-card-form').toggle();

        $('#cards h1').after(`<p class="error">Card title must be 1-30 characters long.</p>`);
    }
};
