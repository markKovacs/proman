var app = app || {};

// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs
app.dataHandler = {
    database: {
    },
    loadTestBoards: function() {
        // if the settings say that we are in developer environment then it loads in
        // some test data, like the ones you find in sample_data.json
    },
    loadBoards: function() {
       // loads data from local storage to this.boards property
        var boards = localStorage.getItem('boards');
        var boardCounter = localStorage.getItem('boardCounter');
        var cardCounter =  localStorage.getItem('cardCounter');
        if (boards && boardCounter && cardCounter) {
            alert("ok");
            this.database.boards = boards;
            this.database.boardCounter = boardCounter;
            this.database.cardCounter = cardCounter;
        } 
        else {
            alert("not ok");
            this.database.boards = [];
            this.database.boardCounter = 0;
            this.database.cardCounter = 0;
            var newArray = [];
            newArray = JSON.stringify(newArray);
            localStorage.setItem('boards', newArray);
            localStorage.setItem('boardCounter', 0);
            localStorage.setItem('cardCounter', 0);
        }
    },
    saveBoards: function() {
        // saves data to local storage from this.boards property
        var boardsString = JSON.stringify(this.database.boards);
        localStorage.setItem("boards", boardsString);
    },
    getBoard: function(boardId) {
        // returns the board with the given id from this.boards
    },
    createNewBoard: function(boardTitle) {
        // creates new board, saves it and returns its id
        var boardId = this.database.boardCounter;
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
