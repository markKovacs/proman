var app = app || {};

// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs
app.dataHandler = {
    boards: [], // it contains the boards and their cards
    loadTestBoards: function() {
        // if the settings say that we are in developer environment then it loads in
        // some test data, like the ones you find in sample_data.json
        this.boards = JSON.parse(app.testBoards).boards;
    },
    loadBoards: function() {
        // loads data from local storage to this.boards property
    },
    saveBoards: function() {
        // saves data to local storage from this.boards property
    },
    getBoard: function(boardId) {
        // returns the board with the given id from this.boards
    },
    createNewBoard: function(boardTitle) {
        // creates new board, saves it and returns its id
    },
    createNewCard: function(boardId, cardTitle) {
        // creates new card in the given board, saves it and returns its id
    }
    // here can come another features
};
