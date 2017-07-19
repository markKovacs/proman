
// DOM manipulation - Common Functions:

var app = app || {};

app.common = {
    
    showLoadingModal: function () {
        $('#modal-content').append(`
            <span class="close">&times;</span>
            <h2 class="loading">Loading content...</h2>
            <img class="loading" src="/static/images/loading.gif" alt="Loading">
        `);
        $('#modal-background').show();
    },

    closeButtonListener: function () {
        $('#modal-content').on('click', '.close', function() {
            $('#modal-content').empty();
            $('#modal-background').hide();
            originalBoardTitle = undefined;
            originalBoardDesc = undefined;
        });
    },

    modalBackgroundListener: function () {
        $(window).on('click', function(event) {
            if ($(event.target).attr('id') === 'modal-background') {
                $('#modal-content').empty();
                $('#modal-background').hide();
                originalBoardTitle = undefined;
                originalBoardDesc = undefined;
            }
        });
    },

    toastMessage: function (message) {
        $('#toast').text(message);
        $('#toast').addClass('show');
        setTimeout(function(){ $('#toast').removeClass('show'); }, 3000);
    },

    showConfirmationModal: function (entityId, entityTitle, entityType, boardId=null, boardTitle=null) {
        $('#modal-content').append(`
            <span class="close">&times;</span>
            <p id="confirm-question">Are you sure you want to delete ${entityType} #${entityId} titled as '${entityTitle}'?</p>
            <div class="confirm-buttons">
                <div id="confirm" data-entity-type="${entityType}" data-entity-id="${entityId}" data-entity-title="${entityTitle}"
                    data-board-id="${boardId}" data-board-title="${boardTitle}">Confirm</div>
                <div id="cancel">Cancel</div>
            </div>
        `);

        $('#modal-background').show();
    },

    confirmDeleteEntityListeners: function () {
        $("#modal-content").on('click', '#confirm', function (ev) {
            ev.stopPropagation();
            $('.success').remove();
            $('.error').remove();
            var entityId = $(this).data("entity-id");
            var entityTitle = $(this).data('entity-title');
            var entityType = $(this).data('entity-type');
            if (entityType === 'board') {
                app.dataHandler.deleteBoard(entityId, entityTitle);
            } else if (entityType === 'card') {
                var boardId = $(this).data('board-id');
                var boardTitle = $(this).data('board-title');
                app.dataHandler.deleteCard(entityId, entityTitle, boardId, boardTitle);
            }
        });

        $("#modal-content").on('click', '#cancel', function (ev) {
            ev.stopPropagation();
            $('#modal-background').hide();
            $('#modal-content').empty();
        });
    }
};



