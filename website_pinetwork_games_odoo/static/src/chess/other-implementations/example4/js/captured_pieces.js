/*!
 *
 *
 * Copyright 2015 Dr.R.Urban
 * Released under the MIT license
 * https://github.com/antiproton
 *
 * Date: 21.6.2015
 */

function captured_pieces(fen) {

var new_fen = fen.split(" ");
 var new_fen = new_fen[0];

// Anzahl weiﬂe Bauern
var W_P = new_fen.split("P").length - 1;
// Geschlagen weiﬂe Bauern
var  G_W_P = 8 - W_P;
//G_W_P = 8;
g_w_bauer = "";
for (var a = 0; a <= G_W_P -1; a++){
var verschiebung = a*15;
var figur= '<div  style="position:absolute; left:'+verschiebung+'px;"> <img src="img/chesspieces/wP.png" width="40" height="40"></div>'
g_w_bauer = g_w_bauer + figur;
}
// Anzahl schwarze Bauern
var b_p = new_fen.split("p").length - 1;
// Geschlagen schwarze Bauern
var  g_b_p = 8 - b_p;
//g_b_p = 8;
g_b_bauer = "";

for (var a = 0; a <= g_b_p -1; a++){
var verschiebung = a*15;
var figur= '<div  style="position:absolute; left:'+verschiebung+'px;"> <img src="img/chesspieces/bP.png" width="40" height="40"></div>'
g_b_bauer = g_b_bauer + figur;
}
// Anzahl weiﬂe Springer
var W_N = new_fen.split("N").length - 1;
// Geschlagen weiﬂe Springer
var  G_W_N = 2 - W_N;
//G_W_N = 2;
var G_W_Springer = "";
for (var a = 0; a <= G_W_N  -1; a++){
var verschiebung = 130 + a*15;
var figur= '<div  style="position:absolute; left:'+verschiebung+'px;"> <img src="img/chesspieces/wN.png" width="40" height="40"></div>'
G_W_Springer = G_W_Springer + figur;
}

// Anzahl schwarze Springer
var b_N = new_fen.split("n").length - 1;
// Geschlagen schwarze Springer
var  G_b_N = 2 - b_N;
//G_b_N = 2;
var G_b_Springer = "";
for (var a = 0; a <= G_b_N  -1; a++){
var verschiebung = 130 + a*15;
var figur= '<div  style="position:absolute; left:'+verschiebung+'px;"> <img src="img/chesspieces/bN.png" width="40" height="40"></div>'
G_b_Springer = G_b_Springer + figur;
}

// Anzahl weiﬂe L‰ufer
var W_B = new_fen.split("B").length - 1;
// Geschlagen weiﬂe L‰ufer
var  G_W_B = 2 - W_B;
//G_W_B = 2;
var G_W_Laeufer = "";
for (var a = 0; a <= G_W_B  -1; a++){
var verschiebung = 170 + a*15;
var figur= '<div  style="position:absolute; left:'+verschiebung+'px;"> <img src="img/chesspieces/wB.png" width="40" height="40"></div>'
G_W_Laeufer = G_W_Laeufer + figur;
}

// Anzahl schwarze L‰ufer
var W_b = new_fen.split("b").length - 1;
// Geschlagen schwarze L‰ufer
var  G_W_b = 2 - W_b;
//G_W_b = 2;
var G_b_Laeufer = "";
for (var a = 0; a <= G_W_b  -1; a++){
var verschiebung = 170 + a*15;
var figur= '<div  style="position:absolute; left:'+verschiebung+'px;"> <img src="img/chesspieces/bB.png" width="40" height="40"></div>'
G_b_Laeufer = G_b_Laeufer + figur;
}

// Anzahl weiﬂe T¸rme
var W_R = new_fen.split("R").length - 1;
// Geschlagen weiﬂe T¸rme
var  G_W_R = 2 - W_R;
//G_W_R = 2;
var G_W_Tuerme = "";
for (var a = 0; a <= G_W_R  -1; a++){
var verschiebung = 210 + a*15;
var figur= '<div  style="position:absolute; left:'+verschiebung+'px;"> <img src="img/chesspieces/wR.png" width="40" height="40"></div>'
G_W_Tuerme = G_W_Tuerme + figur;
}

// Anzahl schwarze T¸rme
var b_R = new_fen.split("r").length - 1;
// Geschlagen schwarze T¸rme
var  G_b_R = 2 - b_R;
//G_b_R = 2;
var G_b_Tuerme = "";
for (var a = 0; a <= G_b_R  -1; a++){
var verschiebung = 210 + a*15;
var figur= '<div  style="position:absolute; left:'+verschiebung+'px;"> <img src="img/chesspieces/bR.png" width="40" height="40"></div>'
G_b_Tuerme = G_b_Tuerme + figur;
}

// Anzahl weiﬂe Dame
var W_Q = new_fen.split("Q").length - 1;
// Geschlagen weiﬂe Dame
var  G_W_Q = 1 - W_Q;
//G_W_Q = 1;
var G_W_Dame = "";
for (var a = 0; a <= G_W_Q  -1; a++){
var verschiebung = 250 + a*15;
var figur= '<div  style="position:absolute; left:'+verschiebung+'px;"> <img src="img/chesspieces/wQ.png" width="40" height="40"></div>'
G_W_Dame = G_W_Dame + figur;
}

// Anzahl schwarze Dame
var W_q = new_fen.split("q").length - 1;
// Geschlagen schwarze Dame
var  G_W_q = 1 - W_q;
//G_b_q = 1;
var G_b_Dame = "";
for (var a = 0; a <= G_W_q  -1; a++){
var verschiebung = 250 + a*15;
var figur= '<div  style="position:absolute; left:'+verschiebung+'px;"> <img src="img/chesspieces/bQ.png" width="40" height="40"></div>'
G_b_Dame = G_b_Dame + figur;
}
document.getElementById('captured_pieces_w').innerHTML = g_w_bauer+G_W_Springer+G_W_Laeufer+G_W_Tuerme+G_W_Dame;
document.getElementById('captured_pieces_b').innerHTML = g_b_bauer+G_b_Springer+G_b_Laeufer+G_b_Tuerme+G_b_Dame;

}