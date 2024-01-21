/* 
    Quick-n-dirty demo page for Sudoku.js.

    For more information, please see https://github.com/robatron/sudoku.js
*/

// Selectors
var BOARD_SEL = "#sudoku-board";
var TABS_SEL = "#generator-tabs";
var MESSAGE_SEL = "#message";
var PUZZLE_CONTROLS_SEL = "#puzzle-controls";
var IMPORT_CONTROLS_SEL = "#import-controls";
var SOLVER_CONTROLS_SEL = "#solver-controls";
var flag_keyup = false;

// Boards
// TODO: Cache puzzles as strings instead of grids to cut down on conversions?
var boards = {
    "easy": null,
    "medium": null,
    "hard": null,
    "very-hard": null,
    "insane": null,
    "inhuman": null,
    "import": null,
};

var points_values = {
    "easy": 1,
    "medium": 2,
    "hard": 3,
    "very-hard": 6,
    "insane": 9,
    "inhuman": 12,
    "import": 0,
};

var build_board = function(){
    /* Build the Sudoku board markup
    
    TODO: Hardcode the result
    */
    for(var r = 0; r < 9; ++r){
        var $row = $("<tr/>", {});
        for(var c = 0; c < 9; ++c){
            var $square = $("<td/>", {});
            if(c % 3 == 2 && c != 8){
                $square.addClass("border-right");
            }
            $square.append(
                $("<input/>", {
                    id: "row" + r + "-col" + c,
                    class: "square numeric maxlength_1",
                    maxlength: "9",
                    type: "number",
                    min: "1",
                    step: "1",
                    max: "9"
                })
            );
            $row.append($square);
        }
        if(r % 3 == 2 && r != 8){
            $row.addClass("border-bottom");
        }
        $(BOARD_SEL).append($row);
    }
};

var init_board = function(){
    /* Initialize board interactions
    */
    $(BOARD_SEL + " input.square").change(function(){
        /* Resize font size in each square depending on how many characters are
        in it.
        */
        var $square = $(this);
        var nr_digits = $square.val().length;
        var font_size = "18px";
        if(nr_digits === 3){
            font_size = "35px";
        } else if(nr_digits === 4){
            font_size = "25px";
        } else if(nr_digits === 5){
            font_size = "20px";
        } else if(nr_digits === 6){
            font_size = "17px";
        } else if(nr_digits === 7){
            font_size = "14px";
        } else if(nr_digits === 8){
            font_size = "13px";
        } else if(nr_digits >= 9){
            font_size = "11px";
        }
        $(this).css("font-size", font_size);
    });
    $(BOARD_SEL + " input.square").keyup(function(){
        /* Fire a change event on keyup, enforce digits
        */
        $(this).change();
    });

};

var init_tabs = function(){
    /* Initialize the Sudoku generator tabs
    */
    $(TABS_SEL + " a").click(function(e){
        e.preventDefault();
        var $t = $(this);
        var t_name = $t.attr("id");
        
        // Hide any error messages
        $(MESSAGE_SEL).hide();
        
        // If it's the import tab
        if(t_name === "import"){
            $(PUZZLE_CONTROLS_SEL).hide();
            $(IMPORT_CONTROLS_SEL).show();
        
        // Otherwise it's a normal difficulty tab
        } else {
            $(PUZZLE_CONTROLS_SEL).show();
            $(IMPORT_CONTROLS_SEL).hide();
        }
        show_puzzle(t_name);
        $t.tab('show');
        
        /*if(t_name !== "import"){
            $("#export-string").val(sudoku.board_grid_to_string(boards[t_name]));
        }*/
    }); 
};

var refresh_board = function(){
    var tab_name = get_tab();
    if(tab_name !== "import"){
        show_puzzle(tab_name, true);
        //$("#export-string").val(sudoku.board_grid_to_string(boards[tab_name]));
        var tabs_names = ["hard",
                         "very-hard",
                         "insane",
                         "inhuman",
                         "import"];

        for(var i = 0; i < 5; i++){
            $("#"+tabs_names[i]).parent().show();
        }
    }
}

var only_refresh_board = function(){
    var tab_name = get_tab();
    if(tab_name !== "import"){
        show_puzzle(tab_name, true);
    }
}

var only_unlock_board = function(){
    var tab_name = get_tab();
    if(tab_name !== "import"){
        var tabs_names = ["hard",
                         "very-hard",
                         "insane",
                         "inhuman",
                         "import"];

        for(var i = 0; i < 5; i++){
            $("#"+tabs_names[i]).parent().show();
        }
    }
}

var clear_this_board = function(){
    var tab_name = get_tab();
    if(tab_name !== "import"){
        clear_puzzle(tab_name);
    }
}

var init_controls = function(){
    /* Initialize the controls
    */
    
    // Puzzle controls
    $(PUZZLE_CONTROLS_SEL + " #cancel").click(function(e){
        /* Refresh the current puzzle
        */
        e.preventDefault();
        var tab_name = get_tab();
        var r = confirm($("#cancel_board_message").text());
        if (r == true) {
            refresh_board();
            /*var tab_name = get_tab();
            if(tab_name !== "import"){
                show_puzzle(tab_name, true);
                $("#export-string").val(sudoku.board_grid_to_string(boards[tab_name]));
            }*/
            $('.timer').countimer('stop');
            flag_keyup = false;
        }
    });
    
    $(PUZZLE_CONTROLS_SEL + " #refresh").click(function(e){
        /* Refresh the current puzzle
        */
        e.preventDefault();
        var tab_name = get_tab();
        var r = confirm("Do you want to refresh?, it will reload the puzzle.");
        if (r == true) {
            refresh_board();
            /*var tab_name = get_tab();
            if(tab_name !== "import"){
                show_puzzle(tab_name, true);
                $("#export-string").val(sudoku.board_grid_to_string(boards[tab_name]));
            }*/
        }
    });
    
    /*$(PUZZLE_CONTROLS_SEL + " #export").click(function(e){
        e.preventDefault();
        var tab_name = get_tab();
        if(tab_name !== "import"){
            $("#export-string").val(sudoku.board_grid_to_string(boards[tab_name]));
        }
    });*/
    
    function copyToClipboard(text) {
		var $temp = $("<input>");
		$("body").append($temp);
		$temp.val(text).select();
		document.execCommand("copy");
		$temp.remove();
	}
    
    /*$(PUZZLE_CONTROLS_SEL + " #copy").click(function(e){
        e.preventDefault();
        var tab_name = get_tab();
        if(tab_name !== "import"){
            $("#export-string").val(sudoku.board_grid_to_string(boards[tab_name]));
            copyToClipboard(sudoku.board_grid_to_string(boards[tab_name]));
        }
    });*/
    
    $(PUZZLE_CONTROLS_SEL + " #clear").click(function(e){
        /* Refresh the current puzzle
        */
        e.preventDefault();
        var tab_name = get_tab();
        if(tab_name !== "import"){
            var r = confirm($("#clear_board_message").text());
            if (r == true) {
                clear_puzzle(tab_name);
            }
        }
    });
    
    // Import controls
    $(IMPORT_CONTROLS_SEL + " #import-string").change(function(){
        /* Update the board to reflect the import string
        */
        var import_val = $(this).val();
        var processed_board = "";
        for(var i = 0; i < 81; ++i){
            if(typeof import_val[i] !== "undefined" &&
                    (sudoku._in(import_val[i], sudoku.DIGITS) || 
                    import_val[i] === sudoku.BLANK_CHAR)){
                processed_board += import_val[i];
            } else {
                processed_board += sudoku.BLANK_CHAR;
            }
        }
        boards["import"] = sudoku.board_string_to_grid(processed_board);
        show_puzzle("import");
    });
    $(IMPORT_CONTROLS_SEL + " #import-string").keyup(function(){
        /* Fire a change event on keyup, enforce digits
        */
        $(this).change();
    });
    
    // Solver controls
    $(SOLVER_CONTROLS_SEL + " #solve").click(function(e){
        /* Solve the current puzzle
        */
        e.preventDefault();
        solve_puzzle(get_tab());
    });
    
    $(".square").on("input",function(e){
        /* Solve the current puzzle
        */
        
        var tab_name = get_tab();
        var tabs_names = ["hard",
                     "very-hard",
                     "insane",
                     "inhuman",
                     "import"];
        
        if(tab_name != "import")
        {
            for(var i = 0; i < 5; i++){
                if(tab_name != tabs_names[i])
                    $("#"+tabs_names[i]).parent().hide();
            }
            if(!flag_keyup)
            {
                $('.timer').countimer('start');
                flag_keyup = true;
            }
        }
        
        var s = "";
        for(var r = 0; r < 9; ++r){
            for(var c = 0; c < 9; ++c){
                var $square = $(BOARD_SEL + " input#row" + r + "-col" + c);
                $square.removeClass("green-text");
                if($square.val() == "")
                    s+=".";
                else
                    s+=$square.val()[0];
            }
        }
        
        var error = false;
        try{
            var solved_board = 
                sudoku.solve(s);
        } catch(e) {
            error = true;
        }
        
        //alert(solved_board + " " + s);
        
        if(solved_board == s && !error)
        {
            $('.timer').countimer('stop');
            flag_keyup = false;
            solve_puzzle(get_tab());
            var tab_name = get_tab();
            var tabs_names = ["hard",
                         "very-hard",
                         "insane",
                         "inhuman",
                         "import"];

            if(tab_name != "import")
            {
                for(var i = 0; i < 5; i++){
                    if(tab_name != tabs_names[i])
                        $("#"+tabs_names[i]).parent().hide();
                }
                for(var r = 0; r < 9; ++r){
                    for(var c = 0; c < 9; ++c){
                        var $square = $(BOARD_SEL + " input#row" + r + "-col" + c);
                        $square.attr("disabled", "disabled");
                        // Fire off a change event on the square
                        $square.change();
                    }
                }
                
                only_refresh_board();
                
                set_points(points_values[get_tab()]);
            }
        }
    });
    
    $(SOLVER_CONTROLS_SEL + " #get-candidates").click(function(e){
        /* Get candidates for the current puzzle
        */
        /*e.preventDefault();
        get_candidates(get_tab());*/
    });
};

var init_message = function(){
    /* Initialize the message bar
    */
    
    //Hide initially
    $(MESSAGE_SEL).hide();
}

var solve_puzzle = function(puzzle){
    /* Solve the specified puzzle and show it
    */
    
    // Solve only if it's a valid puzzle
    if(typeof boards[puzzle] !== "undefined"){
        display_puzzle(boards[puzzle], true);
        
        var error = false;
        try{
            var solved_board = 
                sudoku.solve(sudoku.board_grid_to_string(boards[puzzle]));
        } catch(e) {
            error = true;
        }
        
        // Display the solved puzzle if solved successfully, display error if
        // unable to solve.
        if(solved_board && !error){
            display_puzzle(sudoku.board_string_to_grid(solved_board), true);
            $(MESSAGE_SEL).hide();
        } else {
            $(MESSAGE_SEL + " #text")
                .html("<strong>Unable to solve!</strong> "
                    + "Check puzzle and try again.");
            $(MESSAGE_SEL).show();
        }
    }
};

var get_candidates = function(puzzle){
    /* Get the candidates for the specified puzzle and show it
    */
    
    // Get candidates only if it's a valid puzzle
    if(typeof boards[puzzle] !== "undefined"){
        display_puzzle(boards[puzzle], true);
        
        var error = false;
        try{
            var candidates = 
                sudoku.get_candidates(
                    sudoku.board_grid_to_string(boards[puzzle])
                );
        } catch(e) {
            error = true;
        }
        
        // Display the candidates if solved successfully, display error if
        // unable to solve.
        if(candidates && !error){
            display_puzzle(candidates, true);
            $(MESSAGE_SEL).hide();
        } else {
            $(MESSAGE_SEL + " #text")
                .html("<strong>Unable to display candidates!</strong> " +
                    "Contradictions encountered. Check puzzle and try again.");
            $(MESSAGE_SEL).show();
        }
    }
}

var show_puzzle = function(puzzle, refresh){
    /* Show the puzzle of the specified puzzle. If the board has not been
    generated yet, generate a new one and save. Optionally, set `refresh` to 
    force a refresh of the specified puzzle.
    */
    
    // default refresh to false
    refresh = refresh || false;
    
    // If not a valid puzzle, default -> "easy"
    if(typeof boards[puzzle] === "undefined"){
        puzzle = "easy";
    }
    
    // If the board at the specified puzzle doesn't exist yet, or `refresh`
    // is set, generate a new one
    if(boards[puzzle] === null || refresh){
        if(puzzle === "import"){
            boards[puzzle] = sudoku.board_string_to_grid(sudoku.BLANK_BOARD);
        } else {
            boards[puzzle] = 
                sudoku.board_string_to_grid(sudoku.generate(puzzle));
        }
    }
    
    // Display the puzzle
    display_puzzle(boards[puzzle]);
}

var clear_puzzle = function(puzzle){
    /* Display a Sudoku puzzle on the board, optionally highlighting the new
    values, with green if `highlight` is set. Additionally do not disable the
    new value squares.
    */
    var board = boards[puzzle];
    
    for(var r = 0; r < 9; ++r){
        for(var c = 0; c < 9; ++c){
            var $square = $(BOARD_SEL + " input#row" + r + "-col" + c);
            $square.removeClass("green-text");
            if ($square.attr("disabled") != "disabled" || $square.attr("disabled") == undefined || $square.attr("disabled") == false) {
                $square.val('');
            }
            // Fire off a change event on the square
            $square.change();
        }
    }
}

var display_puzzle = function(board, highlight){
    /* Display a Sudoku puzzle on the board, optionally highlighting the new
    values, with green if `highlight` is set. Additionally do not disable the
    new value squares.
    */
    for(var r = 0; r < 9; ++r){
        for(var c = 0; c < 9; ++c){
            var $square = $(BOARD_SEL + " input#row" + r + "-col" + c);
            $square.removeClass("green-text");
            if(board[r][c] != sudoku.BLANK_CHAR){
                var board_val = board[r][c];
                var square_val = $square.val();
                if(highlight && board_val != square_val){
                    $square.addClass("green-text");
                }else
                    $square.attr("disabled", "disabled");
                $square.val(board_val);
                
            } else {
                $square.val('');
                $square.attr("disabled", false);
            }
            // Fire off a change event on the square
            $square.change();
        }
    }
};

var get_tab = function(){
    /* Return the name of the currently-selected tab
    */
    return $(TABS_SEL + " li.active a").attr("id");
};

var click_tab = function(tab_name){
    /* Click the specified tab by name
    */
    $(TABS_SEL + " #" + tab_name).click();
};

// "Main" (document ready)
$(function(){
    build_board();
    init_board();
    init_tabs();
    init_controls();
    init_message();
    
    // Initialize tooltips
    $("[rel='tooltip']").tooltip();
    
    // Start with generating an easy puzzle
    //click_tab("easy");
    click_tab("hard");
    //$("#hard").click();
    
    // Hide the loading screen, show the app
    $("#app-wrap").removeClass("hidden");
    $("#loading").addClass("hidden");
});
