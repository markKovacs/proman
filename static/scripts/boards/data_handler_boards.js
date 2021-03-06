
var app = app || {};

app.dataHandler = {

    createNewBoard: function (boardTitle, teamRole, teamId=null) {
        // Create new board, saves it.
        if (teamRole === 'personal') {
            $.ajax({
                url:'/api/new_board',
                method: 'POST',
                data: {
                    title: boardTitle,
                    team_role: teamRole
                },
                dataType: 'json',
                success: function(response) {
                    if (response === 'data_error') {
                        app.boards.flashDataErrorMessage();
                    } else {
                        app.boards.appendNewBoard(boardTitle, response.board_id, response.team_role);
                    }
                },
                error: function() {
                    window.location.replace('/login?error=timedout');
                }
            });
        } else {
            $.ajax({
                url:`/api/new_team_board/${teamId}`,
                method: 'POST',
                data: {
                    title: boardTitle,
                    team_role: teamRole,
                    team_id: teamId
                },
                dataType: 'json',
                success: function(response) {
                    if (response === 'data_error') {
                        app.boards.flashDataErrorMessage();
                    } else {
                        app.boards.appendNewBoard(boardTitle, response.board_id, response.team_role);
                    }
                },
                error: function() {
                    window.location.replace('/login?error=timedout');
                }
            });
        }
    },

    createNewCard: function (boardId, cardTitle, boardTitle) {
        // Create new card in the given board and save it.
        $.ajax({
            url: '/api/new_card',
            method: 'POST',
            dataType: 'json',
            data: {
                title: cardTitle,
                board_id: boardId
            },
            success: function(response) {
                if (response === 'data_error') {
                    app.cards.flashDataErrorMessage();
                } else {
                    app.cards.insertNewCard(response.id, cardTitle, response.card_order, boardTitle, boardId);
                    app.cards.resetForm(cardTitle);
                }
            },
            error: function() {
                window.location.replace('/login?error=timedout');
            }
        });
    },

    editCard: function (cardId, newTitle, oldTitle) {
        // Edit card title and save in database.
        $.ajax({
            url: '/api/new_card_title',
            method: 'POST',
            dataType: 'json',
            data: {
                card_id: cardId,
                title: newTitle
            },
            success: function(response) {
                if (response === 'data_error') {
                    app.cards.restoreCardTitle(cardId, oldTitle);
                } else {
                    app.cards.flashCardEditSuccess(cardId, newTitle);
                }
            },
            error: function() {
                window.location.replace('/login?error=timedout');
            }
        });
    },

    getCards: function (boardId, boardTitle, teamRole) {
        $.ajax({
            dataType: "json",
            url: "/api/cards",
            data: {
                board_id: boardId,
                team_role: teamRole
            },
            success: function(cards) {
                app.cards.showCards(cards, boardId, boardTitle, teamRole);
            },
            error: function() {
                window.location.replace('/login?error=timedout');
            }
        });
    },

    makeDragAndDropPersistent: function (movedCardId, newStatus, iDsOfcardsOnBoard) {
        // Make result of drag and drop persistent in database.
        $.ajax({
            url: '/api/persistent_dnd',
            method: 'POST',
            dataType: 'json',
            data: {
                moved_card_id: movedCardId,
                new_status: newStatus,
                card_ids: JSON.stringify(iDsOfcardsOnBoard)
            },
            success: function(response) {
                app.cards.flashDragDropSuccess(movedCardId);
            },
            error: function() {
                window.location.replace('/login?error=timedout');
            }
        });
    },

    deleteBoard: function (boardId, boardTitle) {
        $.ajax({
            url: "/api/delete_board",
            data: {
                board_id: boardId
            },
            method: 'POST',
            dataType: "json",
            success: function(response) {
                app.boards.removeBoardDiv(boardId);
                app.boards.flashDeleteBoardMessage(boardTitle);
            },
            error: function() {
                window.location.replace('/login?error=timedout');
            }
        });
    },

    deleteCard: function (cardId, cardTitle, boardId, boardTitle) {
        $.ajax({
            url: "/api/delete_card",
            data: {
                card_id: cardId
            },
            method: 'POST',
            dataType: "json",
            success: function(response) {
                app.cards.removeCardDiv(cardId);
                app.cards.flashDeleteCardMessage(cardTitle);
            },
            error: function() {
                window.location.replace('/login?error=timedout');
            }
        });
    },

    getCurrentCardCounts: function (teamRole, teamId) {
        $.ajax({
            url: '/api/current_card_counts',
            dataType: 'json',
            method: 'POST',
            data: {
                team_role: teamRole,
                team_id: teamId
            },
            success: function(response) {
                app.boards.refreshCardCount(response);
                app.boards.switchToBoardsPage();
            },
            error: function() {
                window.location.replace('/login?error=timedout');
            }
        });
    },

    getBoardDetails: function (boardId) {
        $.ajax({
            url: '/api/board_details',
            method: 'POST',
            dataType: 'json',
            data: {
                board_id: boardId
            },
            beforeSend: function() {
                app.common.showLoadingModal();
            },
            success: function(board) {
                app.boards.loadBoardDetails(board);
            },
            error: function() {
                window.location.replace('/login?error=timedout');
            }
        });
    },

    editBoard: function (boardId, newTitle, newDesc) {
        $.ajax({
            url: '/api/edit_board',
            method: 'POST',
            dataType: 'json',
            data: {
                board_id: boardId,
                board_title: newTitle,
                board_desc: newDesc
            },
            success: function(response) {
                if (response === 'data_error') {
                    app.boards.boardChangeFail();
                } else {
                    app.boards.boardChangeSuccess(response, boardId, newTitle);
                }
            },
            error: function() {
                window.location.replace('/login?error=timedout');
            },
            complete: function() {
                originalBoardTitle = undefined;
                originalBoardDesc = undefined;
            }
        });
    },

    editCardDetails: function (cardId, newTitle, newDesc, newAssignee) {
        $.ajax({
            url: '/api/edit_card',
            method: 'POST',
            dataType: 'json',
            data: {
                card_id: cardId,
                card_title: newTitle,
                card_desc: newDesc,
                assigned_to: newAssignee
            },
            success: function(response) {
                if (response === 'data_error') {
                    app.cards.cardChangeFail();
                } else {
                    app.cards.cardChangeSuccess(response, cardId, newTitle, newAssignee, newDesc);
                }
            },
            error: function() {
                window.location.replace('/login?error=timedout');
            },
            complete: function() {
                originalCardTitle = undefined;
                originalCardDesc = undefined;
            }
        });
    },

    getTeamBoards: function (selectedAccTeamId, selectedTeamId) {
        $.ajax({
            url: `/api/get_team_boards/${selectedTeamId}`,
            method: 'POST',
            dataType: 'json',
            data: {
                acc_team_id: selectedAccTeamId
            },
            success: function(response) {
                boardsData = response.boards_data;
                teamId = response.team_id;
                teamRole = response.team_role;
                teamMembers = response.team_members;
                app.boards.showBoards();
            },
            error: function() {
                window.location.replace('/login?error=timedout');
            }
        });
    },

    getPersonalBoards: function () {
        $.ajax({
            url: '/api/get_personal_boards',
            dataType: 'json',
            success: function(response) {
                boardsData = response.boards_data;
                teamRole = response.team_role;
                teamMembers = null;
                app.boards.showBoards();
            },
            error: function() {
                window.location.replace('/login?error=timedout');
            }
        });
    }
};
