var app = app || {};

// this function is to initialize the application
app.init = function() {
    $("#new_board").on("click", function() {
        
        $(".create").append(`<form>
                                <input type="text" id="new_title">
                                <input type="submit" id="create_new_board">
                            </form>`);


        $("#create_new_board").click(function(){
            var newTitle = $("#new_title").val();
            app.dataHandler.createNewBoard(newTitle);
        });

    });

}

app.init();

