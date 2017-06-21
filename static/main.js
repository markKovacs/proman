var app = app || {};

// this function is to initialize the application
app.init = function() {
    app.dataHandler.loadBoards()
    var displayBoards = app.dataHandler.database.boards
    for (var i=0; i < displayBoards.length; i++) {
        $("#boardlist").append(`<div class='col-sm-4' style=border: 1px solid black;'>${displayBoards[i].title}</div>`)
    }
    
    $("#new_board").on("click", function() {
        
        $(".create").append(`<form>
                                <input type="text" id="new_title">
                                <input type="submit" id="create_new_board">
                            </form>`);

        $("#create_new_board").click(function(){
            var newTitle = $("#new_title").val();
            app.dataHandler.createNewBoard(newTitle);
            $("#new_title").remove()
        });

    });
}

app.init();

