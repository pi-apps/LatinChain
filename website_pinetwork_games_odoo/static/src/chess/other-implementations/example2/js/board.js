/* exported BOARD */

var BOARD = function board_init(el, options)
{
    "use strict";
    
    var board,
        board_details = {
            ranks: 8,
            files: 8,
        },
        squares,
        hover_squares,
        pos,
        colors = ["blue", "red", "green", "yellow", "teal", "orange", "purple", "pink"],
        ///NOTE: These should match the CSS.
        rgba   = ["rgba(0, 0, 240, .6)", "rgba(240, 0, 0, .6)", "rgba(0, 240, 0, .6)", "rgba(240, 240, 0, .6)", "rgba(0, 240, 240, .6)", "rgba(240, 120, 0, .6)", "rgba(120, 0, 120, .6)", "rgba(240, 0, 240, .6)"],
        rook_arrow_color = "rgba(0, 0, 240, .2)",
        cur_color = 0,
        capturing_clicks,
        legal_moves,
        arrow_manager,
        dragging_arrow = {},
        mode = "setup",
        last_fen,
        fastDrag,
        setInitialDraggingPosition,
        isFlipped = false;
    
    function num_to_alpha(num)
    {
        return "abcdefgh"[num];
    }
    
    function error(str)
    {
        str = str || "Unknown error";
        
        alert("An error occured.\n" + str);
        throw new Error(str);
    }
    
    function check_el(el)
    {
        if (typeof el === "string") {
            return document.getElementById(el);
        }
        return el;
    }
    
    function flip(force)
    {
        if ((isFlipped && force !== true) || force === false) {
            board.el.classList.remove("flipped");
            isFlipped = false;
        } else {
            board.el.classList.add("flipped");
            isFlipped = true;
        }
        size_board(board_details.width, board_details.height);
    }
    
    function get_init_pos()
    {
        ///NOTE: I made this a function so that we could pass other arguments, like chess varients.
        return "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        //return "6R1/1pp5/5k2/p1b4r/P1P2p2/1P5r/4R2P/7K w - - 0 39";
    }
    
    function remove_square_focus(x, y)
    {
        if (squares[y][x].focus_color) {
            squares[y][x].classList.remove("focus_square_" + squares[y][x].focus_color);
            squares[y][x].classList.remove("focusSquare");
            delete squares[y][x].focus_color;
        }
    }
    
    function focus_square(x, y, color)
    {
        remove_square_focus(x, y);
        if (color && colors.indexOf(color) > -1) {
            squares[y][x].focus_color = color;
            squares[y][x].classList.add("focus_square_" + color);
            squares[y][x].classList.add("focusSquare");
        }
    }
    
    function clear_focuses()
    {
        delete board.clicked_piece;
        squares.forEach(function oneach(file, y)
        {
            file.forEach(function oneach(sq, x)
            {
                remove_square_focus(x, y);
            });
        });
    }
    
    function remove_highlight(y, x)
    {
        if (hover_squares[y][x].highlight_color) {
            hover_squares[y][x].classList.remove(hover_squares[y][x].highlight_color);
            delete hover_squares[y][x].highlight_color;
        }
    }
    
    function highlight_square(y, x, color)
    {
        remove_highlight(y, x);
        if (color && colors.indexOf(color) > -1) {
            hover_squares[y][x].highlight_color = color;
            hover_squares[y][x].classList.add(color);
        }
    }
    
    function clear_highlights()
    {
        hover_squares.forEach(function oneach(file, y)
        {
            file.forEach(function oneach(sq, x)
            {
                remove_highlight(y, x);
            });
        });
    }
    
    /**
     * Ctrl click to set/remove colors.
     * Ctrl Left/Right to change colors.
     * Ctrl Non-left click to (only/always) remove colors.
     * Ctrl Space to clear board of highlights.
     */
    function hover_square_click_maker(x, y)
    {
        return function (e)
        {
            var new_color,
                square;
            
            if (e.ctrlKey) {
                if (!dragging_arrow.drew_arrow) {
                    /// Highlight the sqaure.
                    new_color = colors[cur_color];
                    if (is_left_click(e)) {
                        if (hover_squares[y][x].highlight_color === new_color) {
                            remove_highlight(y, x);
                        } else {
                            highlight_square(y, x, new_color);
                        }
                    } else {
                        remove_highlight(y, x);
                        e.preventDefault();
                    }
                }
            } else if (board.clicked_piece) {
                ///TODO: Make sure the move is valid.
                /// Move to the square.
                square = {rank: y, file: x};
                make_move(board.clicked_piece.piece, square, get_move(board.clicked_piece.piece, square), is_promoting(board.clicked_piece.piece, square));
            }
        };
    }
    
    function arrow_start_maker(rank, file)
    {
        return function (e)
        {
            if (e.ctrlKey) {
                dragging_arrow.drew_arrow = false;
                dragging_arrow.start_square = {rank: rank, file: file};
            }
        };
    }
    
    function arrow_move_maker(rank, file)
    {
        function finish_arrow()
        {
            delete dragging_arrow.start_square;
            delete dragging_arrow.cur_square;
            delete dragging_arrow.number;
        }
        
        return function (e)
        {
            if (dragging_arrow.start_square) {
                if (G.normalize_mouse_buttons(e) === 1) {
                    if (!dragging_arrow.cur_square || rank !== dragging_arrow.cur_square.rank || file !== dragging_arrow.cur_square.file) {
                        if (typeof dragging_arrow.number === "number") {
                            arrow_manager.delete_arrow(dragging_arrow.number);
                            delete dragging_arrow.cur_square;
                        }
                        
                        if (dragging_arrow.start_square.rank !== rank || dragging_arrow.start_square.file !== file) {
                            dragging_arrow.number = arrow_manager.draw(dragging_arrow.start_square.rank, dragging_arrow.start_square.file, rank, file, rgba[cur_color])
                            dragging_arrow.cur_square = {rank: rank, file: file};
                            dragging_arrow.drew_arrow = true;
                        }
                    }
                    if (e.type === "mouseup") {
                        finish_arrow();
                    }
                } else {
                    finish_arrow();
                }
            }
        };
    }
    
    function make_hover_square(x, y)
    {
        var el = document.createElement("div");
        
        el.classList.add("hoverSquare");
        el.classList.add("rank" + y);
        el.classList.add("file" + x);
        
        el.addEventListener("click", hover_square_click_maker(x, y));
        
        el.addEventListener("mousedown", arrow_start_maker(y, x));
        el.addEventListener("mousemove", arrow_move_maker(y, x));
        el.addEventListener("mouseup", arrow_move_maker(y, x));
        
        return el;
    }
    
    
    function get_rank_file_from_str(str)
    {
        return {rank: str[1] - 1, file: str.charCodeAt(0) - 97};
    }
    
    function remove_dot(x, y)
    {
        if (hover_squares[y][x].dot_color) {
            hover_squares[y][x].classList.remove("dot_square_" + hover_squares[y][x].dot_color);
            hover_squares[y][x].classList.remove("dotSquare");
            delete hover_squares[y][x].dot_color;
        }
    }
    
    function clear_dots()
    {
        hover_squares.forEach(function oneach(file, y)
        {
            file.forEach(function oneach(sq, x)
            {
                remove_dot(x, y);
            });
        });
    }
    
    function add_dot(x, y, color)
    {
        remove_dot(x, y);
        
        if (color && colors.indexOf(color) > -1) {
            hover_squares[y][x].dot_color = color;
            hover_squares[y][x].classList.add("dot_square_" + color);
            hover_squares[y][x].classList.add("dotSquare");
        }
    }
    
    function add_clickabe_square(move_data)
    {
        if (board.clicked_piece) {
            if (!board.clicked_piece.clickable_squares) {
                board.clicked_piece.clickable_squares = [];
            }
            board.clicked_piece.clickable_squares.push(move_data);
        }
    }
    
    function get_piece_start_square(piece)
    {
        return get_file_letter(piece.file) + (piece.rank + 1);
    }
    
    function show_legal_moves(piece)
    {
        var start_sq = get_piece_start_square(piece);
        
        if (legal_moves && legal_moves.uci) {
            legal_moves.uci.forEach(function oneach(move, i)
            {
                var move_data,
                    color;
                
                if (move.indexOf(start_sq) === 0) {
                    move_data = get_rank_file_from_str(move.substr(2));
                    ///NOTE: We can't use get_piece_from_rank_file(move_data.rank, move_data.file) because it won't find en passant.
                    if (legal_moves.san[i].indexOf("x") === -1) {
                        color = "green";
                    } else {
                        color = "red";
                    }
                    add_dot(move_data.file, move_data.rank, color);
                    add_clickabe_square(move_data);
                }
            });
        }
    }
    
    function make_square(x, y)
    {
        var el = document.createElement("div");
        
        el.classList.add("square");
        el.classList.add("rank" + y);
        el.classList.add("file" + x);
        
        if ((x + y) % 2) {
            el.classList.add("light");
        } else {
            el.classList.add("dark");
        }
        
        return el;
    }
    
    function make_rank(num)
    {
        var el = document.createElement("div");
        
        el.classList.add("rank");
        el.classList.add("rank" + num);
        
        return el;
    }
    
    function size_board(w, h)
    {
        var h_snap = h % board.board_details.ranks,
            w_snap = w % board.board_details.files;
        
        w -= w_snap;
        h -= h_snap;
        
        board_details.width  = parseFloat(w);
        board_details.height = parseFloat(h);
        
        board.el.style.width  = board_details.width  + "px";
        board.el.style.height = board_details.height + "px";
        
        G.events.trigger("board_resize", {w: w, h: h});
    }
    
    function make_board_num(num)
    {
        var el = document.createElement("div");
        
        el.classList.add("notation");
        el.classList.add("num");
        el.textContent = num + 1;
        
        return el;
    }
    
    function get_file_letter(num)
    {
        return String.fromCharCode(97 + num);
    }
    
    function make_board_letter(num)
    {
        var el = document.createElement("div");
        
        el.classList.add("notation");
        el.classList.add("letter");
        el.textContent = get_file_letter(num);
        
        return el;
    }
    
    function switch_turn()
    {
        var last_turn = board.turn;
        if (board.turn === "w") {
            board.turn = "b";
        } else {
            board.turn = "w";
        }
        G.events.trigger("board_turn_switch", {turn: board.turn, last_turn: last_turn});
    }
    
    function create_board(el, dim)
    {
        var x,
            y,
            cur_rank;
        
        if (el) {
            board.el = check_el(el);
        }
        
        board.el.innerHTML = "";
        
        /// Prevent I beam cursor.
        board.el.addEventListener("mousedown", function onboard_mouse_down(e)
        {
            e.preventDefault();
        });
        
        if (dim) {
            size_board(dim.w, dim.h);
        } else {
            size_board(600, 600);
        }
        
        squares = [];
        hover_squares = [];
        
        for (y = board_details.ranks - 1; y >= 0; y -= 1) {
            squares[y] = [];
            hover_squares[y] = [];
            for (x = 0; x < board_details.files; x += 1) {
                squares[y][x] = make_square(x, y);
                hover_squares[y][x] = make_hover_square(x, y);
                if (x === 0) {
                    cur_rank = make_rank(y);
                    board.el.appendChild(cur_rank);
                    squares[y][x].appendChild(make_board_num(y));
                }
                if (y === 0) {
                    squares[y][x].appendChild(make_board_letter(x));
                }
                squares[y][x].appendChild(hover_squares[y][x]);
                cur_rank.appendChild(squares[y][x]);
            }
        }
        
        board.el.classList.add("chess_board");
        
        return board;
    }
    
    function load_pieces_from_start(fen)
    {
        var fen_pieces = fen.match(/^\S+/),
            rank = 7,
            file = 0,
            id = 0,
            piece_count = 0,
            create_pieces;
        
        delete board.last_move;
        
        if (fen !== last_fen) {
            create_pieces = true;
            if (board.pieces) {
                board.pieces.forEach(function oneach(piece)
                {
                    if (piece.el && piece.el.parentNode) {
                        piece.el.parentNode.removeChild(piece.el);
                    }
                    
                });
            }
            board.pieces = [];
        }
        last_fen = fen;
        
        if (!fen_pieces) {
            error("Bad position: " + pos);
        }
        
        fen_pieces[0].split("").forEach(function oneach(letter)
        {
            var piece;
            
            if (letter === "/") {
                rank -= 1;
                file = 0;
            } else if (/\d/.test(letter)) {
                file += parseInt(letter, 10);
            } else { /// It's a piece.
                if (create_pieces) {
                    piece = {};
                    /// Is it white?
                    if (/[A-Z]/.test(letter)) {
                        piece.color = "w";
                    } else {
                        piece.color = "b";
                    }
                    piece.id = id;
                    board.pieces[piece_count] = piece;
                }
                
                /// We do, however, always need to set the starting rank and file.
                board.pieces[piece_count].rank = rank;
                board.pieces[piece_count].file = file;
                /// We also need to set the type, in case it was a pawn that promoted.
                board.pieces[piece_count].type = letter.toLowerCase();
                
                file += 1;
                id += 1;
                piece_count += 1;
            }
        });
    }
    
    function is_piece_moveable(piece)
    {
        return board.get_mode() === "setup" || (board.get_mode() === "play" && board.turn === piece.color && board.players[board.turn].type === "human");
    }
    
    function is_left_click(e)
    {
        return (e.which || (e || window.event).button) === 1;
    }
    
    function fix_touch_event(e)
    {
        if (e.changedTouches && e.changedTouches[0]) {
            e.clientX = e.changedTouches[0].pageX;
            e.clientY = e.changedTouches[0].pageY;
        }
    }
    
    function select_piece(rank, file)
    {
        focus_piece_for_moving(get_piece_from_rank_file(rank, file));
    }
    
    function focus_piece_for_moving(piece)
    {
        board.clicked_piece = {piece: piece};
        focus_square(piece.file, piece.rank, "green");
        show_legal_moves(piece);
        G.events.trigger("focus_piece", {piece: {rank: piece.rank, file: piece.file, color: piece.color, type: piece.type}});
    }
    
    function add_piece_events(piece)
    {
        function onpiece_mouse_down(e)
        {
            ///TODO: Test and make sure it works on touch devices.
            if ((e.type === "touchstart" || is_left_click(e)) && is_piece_moveable(piece)) {
                fix_touch_event(e);
                board.dragging = {};
                board.dragging.piece = piece;
                board.dragging.box = piece.el.getBoundingClientRect();
                board.dragging.origin = {x: e.clientX, y: e.clientY};
                
                board.dragging.offset = {
                    x: board.dragging.origin.x - (board.dragging.box.left + (board.dragging.box.width /2)),
                    y: board.dragging.origin.y - (board.dragging.box.top + (board.dragging.box.height /2))
                };
                board.el.classList.add("dragging");
                board.dragging.piece.el.classList.add("dragging");
                fastDrag = 0;
                setInitialDraggingPosition = setTimeout(function ()
                {
                    onmousemove(e)
                }, 300);
            }
            if (e.preventDefault) {
                /// Prevent the cursor from becoming an I beam.
                e.preventDefault();
            }
            
            if (board.get_mode() === "play") {
                if (board.clicked_piece && board.clicked_piece.piece) {
                    remove_square_focus(board.clicked_piece.piece.file, board.clicked_piece.piece.rank);
                    clear_dots();
                    /// If the king was previously selected, we want to refocus it.
                    if (board.checked_king) {
                        focus_square(board.checked_king.file, board.checked_king.rank, "red");
                    }
                }
                
                if (is_piece_moveable(piece)) {
                    focus_piece_for_moving(piece);
                }
            }
        }
        
        piece.el.addEventListener("mousedown", onpiece_mouse_down);
        
        piece.el.addEventListener("touchstart", onpiece_mouse_down);
    }
    
    function css_transform(el, prop, value)
    {
        if (isFlipped) {
            value += " rotateZ(180deg)";
        }
        el.style[prop] = value;
        el.style["Webkit" + prop[0].toUpperCase() + prop.substr(1)] = value;
        el.style["O" + prop[0].toUpperCase() + prop.substr(1)] = value;
        el.style["MS" + prop[0].toUpperCase() + prop.substr(1)] = value;
        el.style["Moz" + prop[0].toUpperCase() + prop.substr(1)] = value;
    }
    
    function onmousemove(e)
    {
        var x, y;
        /// If the user held the ctrl button and then clicked off of the browser, it will still be marked as capturing. We remove that here.
        if (capturing_clicks && !e.ctrlKey) {
            stop_capturing_clicks();
        }
        if (board.dragging && board.dragging.piece) {
            fix_touch_event(e);
            x = e.clientX - board.dragging.origin.x + board.dragging.offset.x;
            y = e.clientY - board.dragging.origin.y + board.dragging.offset.y;
            if (isFlipped) {
                x *= -1;
                y *= -1;
            }
            css_transform(board.dragging.piece.el, "transform", "translate(" + x + "px," + y + "px)");
            
            if (!fastDrag) {
                clearInterval(setInitialDraggingPosition);
                fastDrag = setTimeout(function ()
                {
                    if (board.dragging && board.dragging.piece && board.dragging.piece.el) {
                        board.dragging.piece.el.classList.add("fastDrag");
                    }
                }, 75);
            }
        }
    }
    
    function get_dragging_hovering_square(e)
    {
        fix_touch_event(e);
        var el,
            match,
            square = {},
            rank_m,
            file_m,
            x = e.clientX,
            y = e.clientY;
        
        el = document.elementFromPoint(x, y);
        
        if (el && (el.className && el.classList && el.classList.contains("square") || el.classList.contains("hoverSquare"))) {
            rank_m = el.className.match(/rank(\d+)/);
            file_m = el.className.match(/file(\d+)/);
            
            if (rank_m) {
                square.rank = parseInt(rank_m[1], 10);
            }
            if (file_m) {
                square.file = parseInt(file_m[1], 10);
            }
        }
        if (!isNaN(square.rank) && !isNaN(square.file)) {
            square.el = el;
            return square;
        }
        
    }
    
    function is_legal_move(uci)
    {
        if (!legal_moves || !legal_moves.uci) {
            return false;
        }
        
        return legal_moves.uci.indexOf(uci) > -1;
    }
    
    function get_move(starting, ending)
    {
        var str;
        if (starting && ending) {
            str = get_file_letter(starting.file) + (parseInt(starting.rank, 10) + 1) + get_file_letter(ending.file) + (parseInt(ending.rank, 10) + 1);
            if (is_promoting(starting, ending)) {
                str += "q"; /// We just add something to make sure it's a legal move. We'll ask the user later what he actually wants to promote to.
            }
        }
        return str;
    }
    
    function create_promotion_icon(which, piece, cb)
    {
        var icon = document.createElement("div");
        
        icon.addEventListener("click", function onclick()
        {
            cb(which);
        });
        
        /// In play mode, we can go with the color; in setup mode, we need to get the color from the piece.
        icon.style.backgroundImage = get_piece_img({color: board.get_mode() === "play" ? board.turn : piece.color, type: which});
        
        icon.classList.add("promotion_icon");
        
        return icon;
    }
    
    function create_modular_window(options)
    {
        var mod_win = G.cde("div", {c: "board_modular_window"}),
            old_mode,
            modular_mode = "waiting_for_modular_window";
        
        function close_window()
        {
            delete board.close_modular_window;
            document.body.removeChild(mod_win);
            if (!options.dont_change_mode && board.get_mode() === modular_mode) {
                board.set_mode(old_mode);
            }
            window.removeEventListener("keydown", listen_for_close);
        }
        
        function open_window()
        {
            if (board.close_modular_window) {
                return setTimeout(open_window, 200);
            }
            board.close_modular_window = close_window;
            
            document.body.appendChild(mod_win);
            if (!options.dont_change_mode) {
                old_mode = board.get_mode();
                board.set_mode(modular_mode);
            }
        }
        
        function listen_for_close(e)
        {
            if (e.keyCode === 27) { /// escape
                close_window();
            }
        }
        
        function add_x()
        {
            mod_win.appendChild(G.cde("div", {t: "X", c: "xButton"}, {click: close_window}));
        }
        
        if (options) {
            if (options.content) {
                if (typeof options.content === "object") {
                    mod_win.appendChild(options.content);
                } else {
                    mod_win.innerHTML = options.content;
                }
            }
            if (options.cancelable) {
                window.addEventListener("keydown", listen_for_close);
                add_x();
            }
            if (options.open) {
                open_window();
            }
        } else {
            options = {};
        }
        
        return {
            close: close_window,
            open: open_window,
            el: mod_win,
        }
    }
    
    function promotion_prompt(piece, cb)
    {
        var modular_window = create_modular_window();
        
        function onselect(which)
        {
            modular_window.close();
            cb(which);
        }
        
        modular_window.el.appendChild(G.cde("div", {t:"Promote to", c: "promotion_text"}));
        
        modular_window.el.appendChild(create_promotion_icon("q", piece, onselect));
        modular_window.el.appendChild(create_promotion_icon("r", piece, onselect));
        modular_window.el.appendChild(create_promotion_icon("b", piece, onselect));
        modular_window.el.appendChild(create_promotion_icon("n", piece, onselect));
        
        modular_window.open();
    }
    
    function report_move(uci, promoting, piece, cb)
    {
        /// We make it async because of promotion.
        function record()
        {
            var san = get_san(uci);
            
            legal_moves = null;
            
            if (board.get_mode() === "play") {
                track_move(uci, san);
                if (board.onmove) {
                    board.onmove(uci, san);
                }
            }
            
            if (cb) {
                cb(uci);
            }
        }
        
        if (promoting) {
            promotion_prompt(piece, function onres(answer)
            {
                ///NOTE: The uci move already includes a promotion to queen to make it a valid move. We need to remove this and replace it with the desired promotion.
                uci = uci.substr(0, 4) + answer;
                record();
            });
        } else {
            setTimeout(record, 10);
        }
    }
    
    function set_piece_pos(piece, square, do_not_save)
    {
        if (!piece || !piece.el || !piece.el.style || !square) {
            return;
        }
        
        piece.el.style.top = -(square.rank * 100) + "%";
        piece.el.style.bottom = (square.rank * 100) + "%";
        
        piece.el.style.left = (square.file * 100) + "%";
        piece.el.style.right = -(square.file * 100) + "%";
        
        if (!do_not_save) {
            piece.rank = square.rank;
            piece.file = square.file;
        }
    }
    
    function get_san(uci)
    {
        if (!legal_moves || !legal_moves.uci || !legal_moves.san) {
            return;
        }
        
        return legal_moves.san[legal_moves.uci.indexOf(uci)];
    }
    
    function set_image(piece)
    {
        var img = get_piece_img(piece);
        
        /// Don't set it if it's the same.
        if (piece.backgroundImage !== img) {
            piece.backgroundImage = img;
            piece.el.style.backgroundImage = img;
        }
    }
    
    function promote_piece(piece, uci)
    {
        if (piece && uci.length === 5 && /[qrbn]/.test(uci[4])) {
            piece.type = uci[4];
            set_image(piece);
        }
    }
    
    function mark_ep(uci)
    {
        var index
        
        if (!legal_moves || !legal_moves.uci || !legal_moves.san) {
            return;
        }
        
        index = legal_moves.uci.indexOf(uci);
        
        if (legal_moves.san && legal_moves.san[index] && legal_moves.san[index].indexOf("e.p.") === -1 && legal_moves.san[index].indexOf("(ep)") === -1) {
            /// Add the notation after the move notation but before check(mate) symbol.
            ///NOTE: A pawn could check(mate) and en passant at the same time, but not promote.
            legal_moves.san[index] = legal_moves.san[index].substr(0, 4) + "e.p." + legal_moves.san[index].substr(4);
        }
    }
    
    function move_piece(piece, square, uci)
    {
        var captured_piece,
            rook,
            san = get_san(uci),
            rook_rank = board.turn === "w" ? 0 : 7; ///TODO: Use board_details.ranks
        
        if (!piece || !square || !uci) {
            return false;
        }
        
        ///NOTE: This does not find en passant captures. See below.
        captured_piece = get_piece_from_rank_file(square.rank, square.file);
        
        if (board.get_mode() === "play") {
            /// Indicate that the board has been changed; it is not in the inital starting position.
            board.messy = true;
            
            /// En passant
            if (!captured_piece && piece.type === "p" && piece.file !== square.file && ((piece.color === "w" && square.rank === board_details.ranks - 3) || (piece.color === "b" && square.rank === 2))) {
                captured_piece = get_piece_from_rank_file(piece.rank, square.file);
                mark_ep(uci);
            }
            
            if (captured_piece && captured_piece.id !== piece.id) {
                capture(captured_piece);
            }
            
            /// Is it castling?
            if (san === "O-O" || san === "0-0") { /// Kingside castle
                rook = get_piece_from_rank_file(rook_rank, board_details.files - 1);
                set_piece_pos(rook, {rank: rook_rank, file: board_details.files - 3});
            } else if (san === "O-O-O" || san === "0-0-0") { /// Queenside castle
                rook = get_piece_from_rank_file(rook_rank, 0);
                set_piece_pos(rook, {rank: rook_rank, file: 3});
            }
        } else if (board.get_mode() === "setup" && captured_piece) {
            /// The pieces should swap places.
            set_piece_pos(captured_piece, piece);
            
            if (captured_piece.type === "p" && (captured_piece.rank === 0 || captured_piece.rank === board_details.ranks - 1)) {
                promotion_prompt(captured_piece, function onres(answer)
                {
                    promote_piece(captured_piece, num_to_alpha(square.file) + square.rank + num_to_alpha(piece.file) + piece.rank + answer);
                });
            }
        }
        
        /// Make sure to change the rank and file after checking for a capured piece so that you don't capture yourself.
        set_piece_pos(piece, square);
    }
    
    function is_promoting(piece, square)
    {
        if (!piece || !square) {
            return;
        }
        
        return piece.type === "p" && square.rank % (board_details.ranks - 1) === 0;
    }
    
    function remove_piece(piece)
    {
        var i;
        
        function remove()
        {
            piece.el.parentNode.removeChild(piece.el);
        }
        
        for (i = board.pieces.length - 1; i >= 0; i -= 1) {
            if (piece.id === board.pieces[i].id) {
                G.array_remove(board.pieces, i);
                /// Make it fade out.
                piece.el.classList.add("captured");
                setTimeout(remove, 2000);
                return;
            }
        }
    }
    
    function make_move(piece, square, uci, promoting)
    {
        var oldRank = piece.rank;
        var oldFile = piece.file;
        
        move_piece(piece, square, uci);
        report_move(uci, promoting, piece, function onreport(finalized_uci)
        {
            ///NOTE: Since this is async, we need to store which piece was moved.
            promote_piece(piece, finalized_uci);
            G.events.trigger("board_human_move", {
                color: piece.color,
                oldRank: oldRank,
                oldFile: oldFile,
                rank: piece.rank,
                file: piece.file,
                type: piece.type,
                promoted: promoting,
                from: get_piece_start_square({rank: oldRank, file: oldFile}),
                to: get_piece_start_square(piece),
                uci: finalized_uci
            });
        });
    }
    
    function onmouseup(e)
    {
        var square,
            uci,
            promoting,
            piece;
        
        if (board.dragging && board.dragging.piece) {
            square = get_dragging_hovering_square(e);
            promoting = is_promoting(board.dragging.piece, square);
            piece = board.dragging.piece;
            
            uci = get_move(piece, square);
            
            if (square && (board.get_mode() === "setup" || is_legal_move(uci))) {
                make_move(piece, square, uci, promoting);
            } else {
                /// Snap back.
                if (board.get_mode() === "setup" && !board.noRemoving) {
                    remove_piece(piece);
                    /// We need to remove "dragging" to make the transitions work again.
                    piece.el.classList.remove("dragging");
                    clearTimeout(fastDrag);
                    piece.el.classList.remove("fastDrag");
                    delete board.dragging.piece;
                }
            }
            
            /// If it wasn't deleted
            if (board.dragging.piece) {
                /// Make the piece immediately move (no bouncing)
                piece.el.classList.add("snap");
                setTimeout(function ()
                {
                    /// Re-enable smooth moving.
                    piece.el.classList.remove("snap");
                }, 10);
                piece.el.style.transform = "";
                piece.el.classList.remove("dragging");
                /// Fast dragging is to set the initial position. It's not needed now.
                clearTimeout(fastDrag);
                piece.el.classList.remove("fastDrag");
                
            }
            board.el.classList.remove("dragging");
            
            delete board.dragging;
        }
    }
    
    function get_piece_img(piece)
    {
        return "url(\"" + encodeURI(board.pieces_path + board.theme + (board.theme ? "/" : "") + piece.color + piece.type + (board.theme_ext || ".svg")) + "\")";
    }
    
    function clear_board_extras()
    {
        clear_highlights();
        clear_focuses();
        clear_dots();
        arrow_manager.clear();
    }
    
    function add_piece(info)
    {
        var piece = {
            color: info.color,
            rank: info.rank,
            file: info.file,
            type: info.type,
        };
        var last_piece = board.pieces[board.pieces.length - 1];
        
        if (last_piece) {
            piece.id = last_piece.id  + 1;
        } else {
            piece.id = 0;
        }
        
        board.pieces.push(piece);
        
        insert_piece(piece);
        
        /// If the pieces were already on the board from a previous game, a pawn may have promoted.
        set_image(piece);
        
        set_piece_pos(piece, {rank: piece.rank, file: piece.file});
        
        last_fen = get_fen();
    }
    
    function insert_piece(piece)
    {
        piece.el = document.createElement("div");
        
        piece.el.classList.add("piece");
        
        add_piece_events(piece);
        
        /// We just put them all in the bottom left corner and move the position.
        squares[0][0].appendChild(piece.el);
    }
    
    function set_board(fen)
    {
        var matches;
        
        delete board.last_move;
        
        fen = fen || get_init_pos();
        
        load_pieces_from_start(fen);
        
        board.pieces.forEach(function oneach(piece)
        {
            if (!piece.el) {
                insert_piece(piece);
            }
            
            /// If the pieces were already on the board from a previous game, a pawn may have promoted.
            set_image(piece);
            
            /// If the pieces were already on the board from a previous game, they may have been captured.
            if (piece.captured) {
                release(piece);
            }
            
            set_piece_pos(piece, {rank: piece.rank, file: piece.file});
        });
        
        clear_board_extras();
        
        matches = fen.match(/^\S+ ([wb])/);
        if (matches) {
            board.turn = matches[1];
        } else {
            board.turn = "w";
        }
        
        board.moves = [];
        board.messy = false;
        
        if (typeof board.close_modular_window === "function") {
            board.close_modular_window();
        }
    }
    
    function wait()
    {
        board.set_mode("wait")
        board.el.classList.add("waiting");
        board.el.classList.remove("settingUp");
        board.el.classList.remove("playing");
        arrow_manager.el.classList.add("waiting");
    }
    
    function play()
    {
        board.set_mode("play")
        board.el.classList.remove("waiting");
        board.el.classList.remove("settingUp");
        board.el.classList.add("playing");
        arrow_manager.el.classList.remove("waiting");
        delete board.last_move;
    }
    
    function enable_setup()
    {
        board.set_mode("setup")
        board.el.classList.remove("waiting");
        board.el.classList.remove("playing");
        board.el.classList.add("settingUp");
        arrow_manager.el.classList.remove("waiting");
        delete board.last_move;
    }
    
    function get_piece_from_rank_file(rank, file)
    {
        var i;
        
        rank = parseInt(rank, 10);
        file = parseInt(file, 10);
        
        for (i = board.pieces.length - 1; i >= 0; i -= 1) {
            if (!board.pieces[i].captured && board.pieces[i].rank === rank && board.pieces[i].file === file) {
                return board.pieces[i];
            }
        }
    }
    
    function split_uci(uci)
    {
        var positions = {
            starting: {
                file: uci.charCodeAt(0) - 97,
                rank: parseInt(uci[1], 10) - 1
            },
            ending: {
                file: uci.charCodeAt(2) - 97,
                rank: parseInt(uci[3], 10) - 1
            }
        };
        
        if (uci.length === 5) {
            positions.promote_to = uci[4];
        }
        
        return positions;
    }
    
    function capture(piece)
    {
        piece.captured = true;
        piece.el.classList.add("captured");
    }
    
    function release(piece)
    {
        delete piece.captured;
        piece.el.classList.remove("captured");
    }
    
    function move_piece_uci(uci)
    {
        var positions = split_uci(uci),
            piece,
            ending_square;
        
        ending_square = {
            el: squares[positions.ending.rank][positions.ending.file],
            rank: positions.ending.rank,
            file: positions.ending.file
        };
        
        piece = get_piece_from_rank_file(positions.starting.rank, positions.starting.file);
        
        if (piece) {
            move_piece(piece, ending_square, uci);
            promote_piece(piece, uci);
        }
    }
    
    function track_move(uci, san)
    {
        board.moves.push(uci);
        switch_turn();
        clear_board_extras();
        G.events.trigger("board_move", {uci: uci, san: san});
        board.last_move = {uci: uci, san: san};
    }
    
    function move_backward(data)
    {
        var cur_move_data,
            moving_peice,
            rook_data,
            rook_peice;
        /// First, set the fen to the previous (the move we're going to).
        /// Then, move the peice(s) to where they were in the current move (or what was the current move).
        /// Next move them back after a delay (so the CSS transition takes effect).
        /// Finally draw the arrow for the previous move (if any).
        
        /// Step 1
        board.set_board(data.prev_fen);
        
        /// Step 2
        cur_move_data = split_uci(data.cur_uci);
        if (cur_move_data) {
            moving_peice = get_piece_from_rank_file(cur_move_data.starting.rank, cur_move_data.starting.file);
            if (moving_peice) {
                if (data.cur_san === "O-O" || data.cur_san === "0-0") {
                    rook_data = {
                        prev_file: board_details.files - 1,
                        cur_file: cur_move_data.ending.file - 1
                    };
                } else if (data.cur_san === "O-O-O" || data.cur_san === "0-0-0") {
                    rook_data = {
                        prev_file: 0,
                        cur_file: cur_move_data.ending.file + 1
                    };
                }
                if (rook_data) {
                    rook_peice = get_piece_from_rank_file(cur_move_data.starting.rank, rook_data.prev_file);
                }
                set_piece_pos(moving_peice, cur_move_data.ending, true);
                if (rook_peice) {
                    set_piece_pos(rook_peice, {rank: cur_move_data.starting.rank, file: rook_data.cur_file}, true);
                }
                /// Step 3
                setTimeout(function ()
                {
                    /// Make sure it hasn't move in the mean time.
                    if (moving_peice.rank === cur_move_data.starting.rank && moving_peice.file === cur_move_data.starting.file) {
                        ///HACK: Try to force a reflow.
                        window.getComputedStyle(moving_peice.el).top;
                        set_piece_pos(moving_peice, cur_move_data.starting, true);
                        if (rook_peice && rook_peice.rank === cur_move_data.starting.rank && rook_peice.file === rook_data.prev_file) {
                            set_piece_pos(rook_peice, {rank: cur_move_data.starting.rank, file: rook_data.prev_file}, true);
                        }
                    }
                }, 50);
            }
        }
        
        /// Step 4
        if (data.prev_uci) {
            arrow_manager.arrow_onmove({uci: data.prev_uci, san: data.prev_san});
        }
    }
    
    function move(data)
    {
        var san,
            uci;
        /// If it's a string, it's just a uci move. If it's an object, it is data for moving backward.
        if (typeof data === "string") {
            uci = data.toLowerCase();
            san = get_san(uci);
            move_piece_uci(uci);
            if (board.get_mode() !== "setup") {
                track_move(uci, san);
            }
        } else {
            move_backward(data);
        }
    }
    
    function onkeydown(e)
    {
        var target = e.target || e.srcElement || e.originalTarget;
        
        if (e.ctrlKey) {
            board.el.classList.add("catchClicks");
            capturing_clicks = true;
            if (e.keyCode === 39) { /// Right
                cur_color += 1;
                if (cur_color >= colors.length) {
                    cur_color = 0;
                }
            } else if (e.keyCode === 37) { /// Left
                cur_color -= 1;
                if (cur_color < 0) {
                    cur_color = colors.length - 1;
                }
            } else if (e.keyCode === 32) { /// Space
                clear_highlights();
                arrow_manager.clear(true); /// Only clear lines drawn by the user.
            }
        }
        
        if (e.keyCode === 8 && (!target || target.tagName === "BODY")) { /// backspace
            arrow_manager.delete_arrow();
            e.preventDefault();
        }
    }
    
    function stop_capturing_clicks()
    {
        board.el.classList.remove("catchClicks");
        capturing_clicks = false;
    }
    
    function onkeyup(e)
    {
        if (!e.ctrlKey) {
            stop_capturing_clicks();
        }
    }
    
    function get_fen(full)
    {
        var ranks = [],
            i,
            j,
            fen = "";
        
        board.pieces.forEach(function (piece)
        {
            if (!piece.captured) {
                if (!ranks[piece.rank]) {
                    ranks[piece.rank] = [];
                }
                ranks[piece.rank][piece.file] = piece.type;
                if (piece.color === "w") {
                    ranks[piece.rank][piece.file] = ranks[piece.rank][piece.file].toUpperCase();
                }
            }
        });
        
        /// Start with the last rank.
        for (i = board_details.ranks - 1; i >= 0; i -= 1) {
            if (ranks[i]) {
                for (j = 0; j < board_details.files; j += 1) {
                    if (ranks[i][j]) {
                        fen += ranks[i][j];
                    } else {
                        fen += "1";
                    }
                }
            } else {
                fen += "8";
            }
            if (i > 0) {
                fen += "/";
            }
        }
        
        /// Replace 1's with their number (e.g., 11 with 2).
        fen = fen.replace(/1{2,}/g, function replacer(ones)
        {
            return String(ones.length);
        });
        
        if (full) {
            return fen + " " + board.turn;
        }
        
        return fen;
    }
    
    function find_king(color)
    {
        var i;
        
        for (i = board.pieces.length - 1; i >= 0; i -= 1) {
            if (board.pieces[i].color === color && board.pieces[i].type === "k") {
                return board.pieces[i];
            }
        }
    }
    
    function focus_checked_king(king)
    {
        if (king) {
            focus_square(king.file, king.rank, "red");
        }
        board.checked_king = king;
    }
    
    
    function show_lines_of_power()
    {
        var power_squares = [];
        
        function add_square(rank, file, piece)
        {
            var color;
            
            if (rank >= 0 && rank < board_details.ranks && file >= 0 && file < board_details.files) {
                if (!power_squares[rank]) {
                    power_squares[rank] = [];
                }
                
                color = piece.color === "w" ? "red" : "blue";
                
                /// Mix.
                if (power_squares[rank][file] && power_squares[rank][file].color !== color) {   
                    color = "purple";
                }
                power_squares[rank][file] = {rank: rank, file: file, color: color};
                ///TODO: Remove squares when in check that do not remove check.
            }
        }
        
        function add_squares_dir(piece, file_change, rank_change)
        {
            var rank = piece.rank,
                file = piece.file;
            
            for (;;) {
                rank += rank_change;
                file += file_change;
                if (file >= 0 && file < board_details.files && rank >= 0 && rank < board_details.ranks) {
                    add_square(rank, file, piece);
                    
                    /// Stop at a piece (either friend or foe)
                    if (get_piece_from_rank_file(rank, file)) {
                        break;
                    }
                } else {
                    break;
                }
            }
        }
        
        function add_diagonal_squares(piece)
        {
            add_squares_dir(piece,  1,  1);
            add_squares_dir(piece,  1, -1);
            add_squares_dir(piece, -1,  1);
            add_squares_dir(piece, -1, -1);
        }
        
        function add_orthogonal_squares(piece)
        {
            add_squares_dir(piece,  1,  0);
            add_squares_dir(piece, -1,  0);
            add_squares_dir(piece,  0,  1);
            add_squares_dir(piece,  0, -1);
        }
        
        board.pieces.forEach(function oneach(piece)
        {
            var dir;
            if (!piece.captured) {
                if (piece.type === "p") {
                    if (piece.color === "w") {
                        dir = 1;
                    } else {
                        dir = -1;
                    }
                    add_square(piece.rank + dir, piece.file + 1, piece);
                    add_square(piece.rank + dir, piece.file - 1, piece);
                } else if (piece.type === "n") {
                    add_square(piece.rank + 2, piece.file + 1, piece);
                    add_square(piece.rank - 2, piece.file + 1, piece);
                    add_square(piece.rank + 1, piece.file + 2, piece);
                    add_square(piece.rank + 1, piece.file - 2, piece);
                    add_square(piece.rank - 2, piece.file - 1, piece);
                    add_square(piece.rank + 2, piece.file - 1, piece);
                    add_square(piece.rank - 1, piece.file - 2, piece);
                    add_square(piece.rank - 1, piece.file + 2, piece);
                } else if (piece.type === "b") {
                    add_diagonal_squares(piece);
                } else if (piece.type === "r") {
                    add_orthogonal_squares(piece);
                } else if (piece.type === "q") {
                    add_orthogonal_squares(piece);
                    add_diagonal_squares(piece);
                } else if (piece.type === "k") {
                    add_square(piece.rank + 1, piece.file + 1, piece);
                    add_square(piece.rank - 1, piece.file - 1, piece);
                    add_square(piece.rank + 1, piece.file - 1, piece);
                    add_square(piece.rank - 1, piece.file + 1, piece);
                    add_square(piece.rank + 1, piece.file    , piece);
                    add_square(piece.rank - 1, piece.file    , piece);
                    add_square(piece.rank    , piece.file - 1, piece);
                    add_square(piece.rank    , piece.file + 1, piece);
                }
            }
        });
        
        power_squares.forEach(function oneach(ranks)
        {
            ranks.forEach(function oneach(data)
            {
                highlight_square(data.rank, data.file, data.color);
            });
        });
    }
    
    function set_legal_moves(moves)
    {
        legal_moves = moves;
        
        if (board.display_lines_of_power) {
            show_lines_of_power();
        }
        
        G.events.trigger("board_set_legal_moves", {moves: moves});
    }
    
    function get_legal_moves()
    {
        return legal_moves;
    }
    
    function check_highlight(e)
    {
        var king;
        if (legal_moves && legal_moves.checkers && legal_moves.checkers.length) {
            king = find_king(board.turn);
            legal_moves.checkers.forEach(function (checker)
            {
                var checker_data = get_rank_file_from_str(checker);
                arrow_manager.draw(checker_data.rank, checker_data.file, king.rank, king.file, rgba[1], true);
            });
        }
        
        ///NOTE: This will clear the checked king square if there is no checked king, so it must always be called.
        focus_checked_king(king);
    }
    
    function get_mode()
    {
        return mode;
    }
    
    function set_mode(new_mode)
    {
        var old_mode = mode;
        if ((new_mode === "play" || new_mode === "setup") && typeof board.close_modular_window === "function") {
            board.close_modular_window();
        }
        mode = new_mode;
        G.events.trigger("board_mode_change", {old_move: old_mode, mode: new_mode});
    }
    
    function monitor_mode_change(e)
    {
        if (e.mode === "setup") {
            clear_board_extras();
        }
    }
    

    function fixHiDPI(context) {
        var backingStore = context.backingStorePixelRatio ||
            context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 1;
        var scaleVal = (window.devicePixelRatio || 1) / backingStore;
        
        console.log(scaleVal);
        context.scale(scaleVal, scaleVal);
        
        return context;
    }
    
    ///
    /// Start creating board
    ///
    
    options = options || {};
    
    G.events.attach("board_set_legal_moves", check_highlight);
    
    arrow_manager = (function create_draw_arrow()
    {
        var canvas = document.createElement("canvas"),
            ctx,
            on_dom,
            arrows = [],
            canvas_left,
            canvas_top,
            remove_timer;
        
        function get_intersect(x1, y1, x2, y2, x3, y3, x4, y4)
        {
            /// See https://en.wikipedia.org/wiki/Line–line_intersection.
            return {
                x: ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)),
                y: ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4))
            };
        }
        
        function rotate_point(point_x, point_y, origin_x, origin_y, angle) {
            return {
                x: Math.cos(angle) * (point_x - origin_x) - Math.sin(angle) * (point_y - origin_y) + origin_x,
                y: Math.sin(angle) * (point_x - origin_x) + Math.cos(angle) * (point_y - origin_y) + origin_y
            };
        }
        
        function create_arrow(x1, y1, x2, y2, options)
        {
            options = options || {};
            
            options.width = options.width || 12;
            options.fillStyle = options.fillStyle || "rgb(0,0,200)";
            options.head_len = options.head_len || 30;
            
            if (options.head_len < options.width + 1) {
                options.head_len = options.width + 1;
            }
            options.head_angle = options.head_angle || Math.PI / 6;
            
            var angle = Math.atan2(y2 - y1, x2 - x1);
            
            var ang_neg = angle - options.head_angle;
            var ang_pos = angle + options.head_angle;
            var tri_point1 = {
                x: x2 - options.head_len * Math.cos(ang_neg),
                y: y2 - options.head_len * Math.sin(ang_neg)
            };
            var tri_point2 = {
                x: x2 - options.head_len * Math.cos(ang_pos),
                y: y2 - options.head_len * Math.sin(ang_pos)
            };
            
            /// Since the line has a width, we need to create a new line by moving the point half of the width and then rotating it to match the line.
            var p1 = rotate_point(x1, y1 + options.width / 2, x1, y1, angle);
            var p2 = rotate_point(x2, y2 + options.width / 2, x2, y2, angle);
            
            /// Find the point at which the line will reach the bottom of the triangle.
            var int2 = get_intersect(p1.x, p1.y, p2.x, p2.y, tri_point1.x, tri_point1.y, tri_point2.x, tri_point2.y);
            
            var p3 = rotate_point(x1, y1 - options.width / 2, x1, y1, angle);
            var p4 = rotate_point(x2, y2 - options.width / 2, x2, y2, angle);
            var int3 = get_intersect(p3.x, p3.y, p4.x, p4.y, tri_point1.x, tri_point1.y, tri_point2.x, tri_point2.y);
            
            ctx.fillStyle = options.fillStyle;
            ctx.beginPath();
            ctx.arc(x1, y1, options.width / 2, angle - Math.PI / 2, angle - Math.PI * 1.5, true);
            ctx.lineTo(int2.x, int2.y);
            ctx.lineTo(tri_point1.x, tri_point1.y);
            ctx.lineTo(x2, y2);
            ctx.lineTo(tri_point2.x, tri_point2.y);
            ctx.lineTo(int3.x, int3.y);
            ctx.closePath();
            if (options.lineWidth) {
                ctx.lineWidth = options.lineWidth;
                ctx.strokeStyle = options.strokeStyle;
                ctx.stroke();
            }
            ctx.fill();
        }
        
        function draw_arrow(rank1, file1, rank2, file2, color, auto, do_not_add)
        {
            var box1 = squares[rank1][file1].getBoundingClientRect(),
                box2 = squares[rank2][file2].getBoundingClientRect(),
                proportion,
                adjust_height;
            
            if (!do_not_add) {
                arrows.push({
                    rank1: rank1,
                    file1: file1,
                    rank2: rank2,
                    file2: file2,
                    color: color,
                    auto: auto,
                });
            }
            
            if (!on_dom) {
                set_size();
                document.body.appendChild(canvas);
                on_dom = true;
            }
            
            proportion = (box1.width / 50);
            
            create_arrow(window.scrollX + box1.left + box1.width / 2 - canvas_left, window.scrollY + box1.top + box1.height / 2 - canvas_top,
                         window.scrollX + box2.left + box2.width / 2 - canvas_left, window.scrollY + box2.top + box2.height / 2 - canvas_top,
                         {
                            fillStyle: color,
                            width:    box1.width / 5,
                            head_len: box1.width / 1.5,
                         ///lineWidth: box1.width / 10,
                         ///strokeStyle: "rgba(200,200,200,.4)",
                         });
            
            return do_not_add ? -1 : arrows.length - 1;
        }
        
        function remove_if_empty()
        {
            clearTimeout(remove_timer);
            
            /// Since we often draw another arrow quickly, there's no need to remove it right away.
            remove_timer = setTimeout(function ()
            {
                if (on_dom && !arrows.length) {
                    if (canvas.parentNode) {
                        canvas.parentNode.removeChild(canvas);
                    }
                    on_dom = false;
                }
            }, 2000);
        }
        
        function clear(keep_auto_arrows)
        {
            var i;
            
            /// Sometimes, we don't want to remove the arrows for last move and checkers.
            if (keep_auto_arrows) {
                for (i = arrows.length - 1; i >= 0; i -= 1) {
                    if (!arrows[i].auto) {
                        G.array_remove(arrows, i);
                    }
                }
            } else {
                arrows = [];
            }
            set_size();
            
            if (arrows.length) {
                draw_all_arrows();
            } else {
                remove_if_empty();
            }
        }
        
        function draw_all_arrows()
        {
            arrows.forEach(function (arrow)
            {
                draw_arrow(arrow.rank1, arrow.file1, arrow.rank2, arrow.file2, arrow.color, arrow.auto, true);
            });
        }
        
        function set_size()
        {
            var box = board.el.getBoundingClientRect();
            canvas_left = box.left + window.scrollX;
            canvas_top = box.top + window.scrollY;
            canvas.width = box.width;
            canvas.height = box.height;
            canvas.style.top = canvas_top + "px";
            canvas.style.left = canvas_left + "px";
        }
        
        function redraw()
        {
            set_size();
            draw_all_arrows();
        }
        
        function delete_arrow(which)
        {
            if (!which) {
                which = arrows.length - 1;
                for (;;) {
                    /// We are looking for the last arrow drawn by the user.
                    if (arrows[which] && !arrows[which].auto) {
                        break;
                    }
                    
                    which -= 1;
                    
                    if (which < 0) {
                        return;
                    }
                }
            }
            
            if (arrows[which]) {
                G.array_remove(arrows, which);
                redraw();
            }
            
            remove_if_empty();
        }
        
        function arrow_onmove(e)
        {
            var uci_data = split_uci(e.uci),
                rook_data;
            
            draw_arrow(uci_data.starting.rank, uci_data.starting.file, uci_data.ending.rank, uci_data.ending.file, rgba[0], true);
            
            /// Draw rook arrow on castling.
            if (e.san === "O-O" || e.san === "0-0") {
                rook_data = {
                    start_file: board_details.files - 1,
                    end_file: uci_data.ending.file - 1
                };
            } else if (e.san === "O-O-O" || e.san === "0-0-0") {
                rook_data = {
                    start_file: 0,
                    end_file: uci_data.ending.file + 1
                };
            }
            
            if (rook_data) {
                draw_arrow(uci_data.starting.rank, rook_data.start_file, uci_data.ending.rank, rook_data.end_file, rook_arrow_color, true);
            }
        }
        
        function draw(rank1, file1, rank2, file2, color, auto)
        {
            return draw_arrow(rank1, file1, rank2, file2, color, auto);
        }
        
        G.events.attach("board_resize", function redrawDelayed()
        {
            setTimeout(redraw);
        });
        
        G.events.attach("board_move", arrow_onmove);
        
        canvas.className = "boardArrows";
        ctx = fixHiDPI(canvas.getContext("2d"));
        
        return {
            el: canvas,
            draw: draw,
            clear: clear,
            delete_arrow: delete_arrow,
            arrow_onmove: arrow_onmove,
        };
    }());
    
    function clear()
    {
        clear_highlights()
        
        set_board("8/8/8/8/8/8/8/8 w - - 0 1");
    }
    
    board = {
        pieces: [],
        size_board: size_board,
        pieces_path: typeof options.pieces_path === "undefined" ? "img/pieces/" : options.pieces_path,
        theme: typeof options.theme === "undefined" ? "default" : options.theme,
        wait: wait,
        play: play,
        enable_setup: enable_setup,
        move: move,
        players: {
            w: {
                color: "w",
            },
            b: {
                color: "b",
            }
        },
        switch_turn: switch_turn,
        set_board: set_board,
        is_legal_move: is_legal_move,
        moves: [],
        get_fen: get_fen,
        board_details: board_details,
        highlight_colors: colors,
        color_values: rgba,
        clear_highlights: clear_highlights,
        remove_highlight: remove_highlight,
        highlight_square: highlight_square,
        set_legal_moves: set_legal_moves,
        get_legal_moves: get_legal_moves,
        show_lines_of_power: show_lines_of_power,
        get_mode: get_mode,
        set_mode: set_mode,
        get_san: get_san,
        create_modular_window: create_modular_window,
        arrow_manager: arrow_manager,
        split_uci: split_uci,
        add_piece: add_piece,
        clear: clear,
        clear_board_extras: clear_board_extras,
        select_piece: select_piece,
        flip: flip,
    /// onmove()
    /// onswitch()
    /// turn
    /// display_lines_of_power
    };
    
    G.events.attach("board_mode_change", monitor_mode_change);
    
    create_board(el, options.dim);
    
    set_board(options.pos);
    
    window.addEventListener("mousemove", onmousemove);
    window.addEventListener("touchmove", onmousemove);
    window.addEventListener("mouseup",  onmouseup);
    window.addEventListener("touchend", onmouseup);
    window.addEventListener("keydown", onkeydown);
    window.addEventListener("keyup", onkeyup);
    
    return board;
};
