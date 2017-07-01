var app = app || {};

// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs
app.dataHandler = {
    boards: [], // it contains the boards and their cards
    boardCount: 0,
    cardCount: 0,
    loadTestBoards: function() {
        // if the settings say that we are in developer environment then it loads in
        // some test data, like the ones you find in sample_data.json
        this.boards = JSON.parse(app.testBoards).boards;
        this.boardCount = JSON.parse(app.testBoards).boardCount;
        this.cardCount = JSON.parse(app.testBoards).cardCount;
    },
    loadBoards: function() {
        var boardsString = localStorage.getItem('boards');
        var boardCountString = localStorage.getItem('boardCount');
        var cardCountString = localStorage.getItem('cardCount');

        if (!boardsString) {
            localStorage.setItem('boards', []);
        }
        if (!boardCountString) {
            localStorage.setItem('boardCount', 0);
        }
        if (!cardCountString) {
            localStorage.setItem('cardCount', 0);
        }

        try {
            this.boards = JSON.parse(localStorage.getItem('boards'));
        } catch(err) {
            this.boards = [];
        }
        
        this.boardCount = JSON.parse(localStorage.getItem('boardCount'));
        this.cardCount = JSON.parse(localStorage.getItem('cardCount'));
    },
    saveBoards: function() {
        // saves data to local storage from this.boards property
        localStorage.setItem('boards', JSON.stringify(this.boards));
        localStorage.setItem('boardCount', JSON.stringify(this.boardCount));
    },
    getBoard: function(boardId) {
        // returns the board with the given id from this.boards
        for (var i = 0; i < this.boards.length; i++) {
            if (this.boards[i].id === boardId) {
                return this.boards[i];
            }
        }
    },
    createNewBoard: function(boardTitle) {
        // creates new board, saves it and returns its id
        var boardId = this.boardCount;
        this.boardCount += 1;

        var newBoardObj = {
            id: boardId,
            title: boardTitle,
            state: "active",
            cards: []
        };

        if (this.boards.length > 0) {
            this.boards.push(newBoardObj);
        } else {
            this.boards = [newBoardObj];
        }
        this.saveBoards();

    },
    createNewCard: function(boardId, cardTitle) {
        // creates new card in the given board, saves it and returns its id
        var cardId = this.cardCount;
        this.cardCount += 1;

        var lastPlace = getMaxOrder(boardId) + 1;

        var newCardObj = {
            id: cardId,
            title: cardTitle,
            status: "new",
            order: lastPlace
        }

        for (var i = 0; i < this.boards.length; i++) {
            if (this.boards[i].id === boardId) {
                this.boards[i].cards.push(newCardObj);
            break;
            }
        }

        localStorage.setItem('boards', JSON.stringify(this.boards));
        localStorage.setItem('cardCount', JSON.stringify(this.cardCount));
    },
    editCard: function(boardId, cardId, newTitle) {
        // edit cards title and save in localStorage
        for (var i = 0; i < this.boards.length; i++) {
            if (this.boards[i].id === boardId) {
                for (var j = 0; j < this.boards[i].cards.length; j++) {
                    if (this.boards[i].cards[j].id === cardId) {
                        this.boards[i].cards[j].title = newTitle;
                        localStorage.setItem('boards', JSON.stringify(this.boards));
                        return;
                    }
                }
            }
        }
    }
    // here can come another features
};


function getMaxOrder (boardId) {
    for (var i = 0; i < app.dataHandler.boards.length; i++) {
        if (app.dataHandler.boards[i].id === boardId) {
            
            var theseCards = app.dataHandler.boards[i].cards;
            return theseCards.length;
        }
    }
}