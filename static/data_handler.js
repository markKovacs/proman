var app = app || {};

// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs
app.dataHandler = {
    database: {boards: [], boardCounter: 0, cardCounter: 0,
    },
    loadTestBoards: function() {
        // if the settings say that we are in developer environment then it loads in
        // some test data, like the ones you find in sample_data.json
    },
    loadBoards: function() {
       // loads data from local storage to this.boards property
       this.database.boards = JSON.parse(localStorage.getItem('boards'));
       this.database.boardCounter = JSON.parse(localStorage.getItem('bCounter'));
       this.database.cardCounter = JSON.parse(localStorage.getItem('cCounter'));
    },
    saveBoards: function() {
        // saves data to local storage from this.boards property
        localStorage.setItem("boards", JSON.stringify(this.database.boards));
        localStorage.setItem("bCounter", JSON.stringify(this.database.boardCounter));
        localStorage.setItem("cCounter", JSON.stringify(this.database.cardCounter));
    },
    getBoard: function(boardId) {
        // returns the board with the given id from this.boards
    },
    createNewBoard: function(boardTitle) {
        // creates new board, saves it and returns its id
        this.loadBoards()
        if (this.database.boards === null) {
            this.database.boards = []
        }
        if (this.database.boardCounter === null) {
            this.database.boardCounter = 0
        }
        var boardId = this.database.boardCounter;
        alert(this.database.boardCounter)
        this.database.boardCounter += 1;
        var boardObj = {id: boardId,
                        title: boardTitle,
                        state: "active",
                        cards: []
                        };
        
        this.database.boards.push(boardObj);
        this.saveBoards();
    },
    createNewCard: function(boardId, cardTitle) {
        // creates new card in the given board, saves it and returns its id
    }
    // here can come another features
}
