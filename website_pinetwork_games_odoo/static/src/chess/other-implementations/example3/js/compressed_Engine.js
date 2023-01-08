var PIECES = {
        EMPTY: 0,
        wP: 1,
        wN: 2,
        wB: 3,
        wR: 4,
        wQ: 5,
        wK: 6,
        bP: 7,
        bN: 8,
        bB: 9,
        bR: 10,
        bQ: 11,
        bK: 12
    },
    BRD_SQ_NUM = 120,
    FILES = {
        FILE_A: 0,
        FILE_B: 1,
        FILE_C: 2,
        FILE_D: 3,
        FILE_E: 4,
        FILE_F: 5,
        FILE_G: 6,
        FILE_H: 7,
        FILE_NONE: 8
    },
    RANKS = {
        RANK_1: 0,
        RANK_2: 1,
        RANK_3: 2,
        RANK_4: 3,
        RANK_5: 4,
        RANK_6: 5,
        RANK_7: 6,
        RANK_8: 7,
        RANK_NONE: 8
    },
    COLOURS = {
        WHITE: 0,
        BLACK: 1,
        BOTH: 2
    },
    CASTLEBIT = {
        WKCA: 1,
        WQCA: 2,
        BKCA: 4,
        BQCA: 8
    },
    SQUARES = {
        A1: 21,
        B1: 22,
        C1: 23,
        D1: 24,
        E1: 25,
        F1: 26,
        G1: 27,
        H1: 28,
        A8: 91,
        B8: 92,
        C8: 93,
        D8: 94,
        E8: 95,
        F8: 96,
        G8: 97,
        H8: 98,
        NO_SQ: 99,
        OFFBOARD: 100
    },
    BOOL = {
        FALSE: 0,
        TRUE: 1
    },
    MAXGAMEMOVES = 2048,
    MAXPOSITIONMOVES = 256,
    MAXDEPTH = 64,
    INFINITE = 3e4,
    MATE = 29e3,
    PVENTRIES = 1e4,
    FilesBrd = Array(BRD_SQ_NUM),
    RanksBrd = Array(BRD_SQ_NUM),
    START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    PceChar = ".PNBRQKpnbrqk",
    SideChar = "wb-",
    RankChar = "12345678",
    FileChar = "abcdefgh";

function FR2SQ(a, b) {
    return 21 + a + 10 * b
}
var SideKey, PieceBig = [BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE],
    PieceMaj = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE],
    PieceMin = [BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE],
    PieceVal = [0, 100, 325, 325, 550, 1e3, 5e4, 100, 325, 325, 550, 1e3, 5e4],
    PieceCol = [COLOURS.BOTH, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK],
    PiecePawn = [BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE],
    PieceKnight = [BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE],
    PieceKing = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE],
    PieceRookQueen = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE],
    PieceBishopQueen = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE],
    PieceSlides = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE],
    KnDir = [-8, -19, -21, -12, 8, 19, 21, 12],
    RkDir = [-1, -10, 1, 10],
    BiDir = [-9, -11, 11, 9],
    KiDir = [-1, -10, 1, 10, -9, -11, 11, 9],
    DirNum = [0, 0, 8, 4, 4, 8, 8, 0, 8, 4, 4, 8, 8],
    PceDir = [0, 0, KnDir, BiDir, RkDir, KiDir, KiDir, 0, KnDir, BiDir, RkDir, KiDir, KiDir],
    LoopNonSlidePce = [PIECES.wN, PIECES.wK, 0, PIECES.bN, PIECES.bK, 0],
    LoopNonSlideIndex = [0, 3],
    LoopSlidePce = [PIECES.wB, PIECES.wR, PIECES.wQ, 0, PIECES.bB, PIECES.bR, PIECES.bQ, 0],
    LoopSlideIndex = [0, 4],
    PieceKeys = Array(1680),
    CastleKeys = Array(16),
    Sq120ToSq64 = Array(BRD_SQ_NUM),
    Sq64ToSq120 = Array(64);

function RAND_32() {
    return Math.floor(255 * Math.random() + 1) << 23 | Math.floor(255 * Math.random() + 1) << 16 | Math.floor(255 * Math.random() + 1) << 8 | Math.floor(255 * Math.random() + 1)
}
var Mirror64 = [56, 57, 58, 59, 60, 61, 62, 63, 48, 49, 50, 51, 52, 53, 54, 55, 40, 41, 42, 43, 44, 45, 46, 47, 32, 33, 34, 35, 36, 37, 38, 39, 24, 25, 26, 27, 28, 29, 30, 31, 16, 17, 18, 19, 20, 21, 22, 23, 8, 9, 10, 11, 12, 13, 14, 15, 0, 1, 2, 3, 4, 5, 6, 7];

function SQ64(a) {
    return Sq120ToSq64[a]
}

function SQ120(a) {
    return Sq64ToSq120[a]
}

function PCEINDEX(a, b) {
    return 10 * a + b
}

function MIRROR64(a) {
    return Mirror64[a]
}
var Kings = [PIECES.wK, PIECES.bK],
    CastlePerm = [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 13, 15, 15, 15, 12, 15, 15, 14, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 7, 15, 15, 15, 3, 15, 15, 11, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15];

function FROMSQ(a) {
    return 127 & a
}

function TOSQ(a) {
    return 127 & a >> 7
}

function CAPTURED(a) {
    return 15 & a >> 14
}

function PROMOTED(a) {
    return 15 & a >> 20
}
var MFLAGEP = 262144,
    MFLAGPS = 524288,
    MFLAGCA = 16777216,
    MFLAGCAP = 507904,
    MFLAGPROM = 15728640,
    NOMOVE = 0;

function SQOFFBOARD(a) {
    return FilesBrd[a] == SQUARES.OFFBOARD ? BOOL.TRUE : BOOL.FALSE
}

function HASH_PCE(a, b) {
    GameBoard.posKey ^= PieceKeys[120 * a + b]
}

function HASH_CA() {
    GameBoard.posKey ^= CastleKeys[GameBoard.castlePerm]
}

function HASH_SIDE() {
    GameBoard.posKey ^= SideKey
}

function HASH_EP() {
    GameBoard.posKey ^= PieceKeys[GameBoard.enPas]
}
var GameController = {
        EngineSide: COLOURS.BOTH,
        PlayerSide: COLOURS.BOTH,
        GameOver: BOOL.FALSE
    },
    UserMove = {};
UserMove.from = SQUARES.NO_SQ, UserMove.to = SQUARES.NO_SQ;

function PrSq(a) {
    return FileChar[FilesBrd[a]] + RankChar[RanksBrd[a]]
}

function PrMove(a) {
    var b, c = FilesBrd[FROMSQ(a)],
        d = RanksBrd[FROMSQ(a)],
        e = FilesBrd[TOSQ(a)],
        f = RanksBrd[TOSQ(a)];
    b = FileChar[c] + RankChar[d] + FileChar[e] + RankChar[f];
    var g = PROMOTED(a);
    if (g != PIECES.EMPTY) {
        var h = "q";
        PieceKnight[g] == BOOL.TRUE ? h = "n" : PieceRookQueen[g] == BOOL.TRUE && PieceBishopQueen[g] == BOOL.FALSE ? h = "r" : PieceRookQueen[g] == BOOL.FALSE && PieceBishopQueen[g] == BOOL.TRUE && (h = "b"), b += h
    }
    return b
}

function PrintMoveList() {
    var a, b, c = 1;
    for (console.log("MoveList:"), a = GameBoard.moveListStart[GameBoard.ply]; a < GameBoard.moveListStart[GameBoard.ply + 1]; ++a) b = GameBoard.moveList[a], console.log("IMove:" + c + ":(" + a + "):" + PrMove(b) + " Score:" + GameBoard.moveScores[a]), c++;
    console.log("End MoveList")
}

function ParseMove(a, b) {
    GenerateMoves();
    var c = NOMOVE,
        d = PIECES.EMPTY,
        e = BOOL.FALSE;
    for (index = GameBoard.moveListStart[GameBoard.ply]; index < GameBoard.moveListStart[GameBoard.ply + 1]; ++index)
        if (c = GameBoard.moveList[index], FROMSQ(c) == a && TOSQ(c) == b) {
            if (d = PROMOTED(c), d != PIECES.EMPTY) {
                if (d == PIECES.wQ && GameBoard.side == COLOURS.WHITE || d == PIECES.bQ && GameBoard.side == COLOURS.BLACK) {
                    e = BOOL.TRUE;
                    break
                }
                continue
            }
            e = BOOL.TRUE;
            break
        } return e == BOOL.FALSE ? NOMOVE : MakeMove(c) == BOOL.FALSE ? NOMOVE : (TakeMove(), c)
}

function PCEINDEX(a, b) {
    return 10 * a + b
}
var GameBoard = {
    pieces: Array(BRD_SQ_NUM),
    side: COLOURS.WHITE,
    fiftyMove: 0,
    hisPly: 0,
    history: [],
    ply: 0,
    enPas: 0,
    castlePerm: 0,
    material: [, , ],
    pceNum: Array(13),
    pList: Array(140),
    posKey: 0,
    moveList: Array(MAXDEPTH * MAXPOSITIONMOVES),
    moveScores: Array(MAXDEPTH * MAXPOSITIONMOVES),
    moveListStart: Array(MAXDEPTH),
    PvTable: [],
    PvArray: Array(MAXDEPTH),
    searchHistory: Array(14 * BRD_SQ_NUM),
    searchKillers: Array(3 * MAXDEPTH)
};

function CheckBoard() {
    var a, b, c, d, e = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        f = [0, 0];
    for (b = PIECES.wP; b <= PIECES.bK; ++b)
        for (c = 0; c < GameBoard.pceNum[b]; ++c)
            if (d = GameBoard.pList[PCEINDEX(b, c)], GameBoard.pieces[d] != b) return console.log("Error Pce Lists"), BOOL.FALSE;
    for (a = 0; 64 > a; ++a) d = SQ120(a), b = GameBoard.pieces[d], e[b]++, f[PieceCol[b]] += PieceVal[b];
    for (b = PIECES.wP; b <= PIECES.bK; ++b)
        if (e[b] != GameBoard.pceNum[b]) return console.log("Error t_pceNum"), BOOL.FALSE;
    return f[COLOURS.WHITE] != GameBoard.material[COLOURS.WHITE] || f[COLOURS.BLACK] != GameBoard.material[COLOURS.BLACK] ? (console.log("Error t_material"), BOOL.FALSE) : GameBoard.side != COLOURS.WHITE && GameBoard.side != COLOURS.BLACK ? (console.log("Error GameBoard.side"), BOOL.FALSE) : GeneratePosKey() == GameBoard.posKey ? BOOL.TRUE : (console.log("Error GameBoard.posKey"), BOOL.FALSE)
}

function PrintBoard() {
    var a, b, c, d;
    for (console.log("\nGame Board:\n"), c = RANKS.RANK_8; c >= RANKS.RANK_1; c--) {
        var e = RankChar[c] + "  ";
        for (b = FILES.FILE_A; b <= FILES.FILE_H; b++) a = FR2SQ(b, c), d = GameBoard.pieces[a], e += " " + PceChar[d] + " ";
        console.log(e)
    }
    console.log("");
    var e = "   ";
    for (b = FILES.FILE_A; b <= FILES.FILE_H; b++) e += " " + FileChar[b] + " ";
    console.log(e), console.log("side:" + SideChar[GameBoard.side]), console.log("enPas:" + GameBoard.enPas), e = "", GameBoard.castlePerm & CASTLEBIT.WKCA && (e += "K"), GameBoard.castlePerm & CASTLEBIT.WQCA && (e += "Q"), GameBoard.castlePerm & CASTLEBIT.BKCA && (e += "k"), GameBoard.castlePerm & CASTLEBIT.BQCA && (e += "q"), console.log("castle:" + e), console.log("key:" + GameBoard.posKey.toString(16))
}

function GeneratePosKey() {
    var a = 0,
        b = 0,
        c = PIECES.EMPTY;
    for (a = 0; a < BRD_SQ_NUM; ++a) c = GameBoard.pieces[a], c != PIECES.EMPTY && c != SQUARES.OFFBOARD && (b ^= PieceKeys[120 * c + a]);
    return GameBoard.side == COLOURS.WHITE && (b ^= SideKey), GameBoard.enPas != SQUARES.NO_SQ && (b ^= PieceKeys[GameBoard.enPas]), b ^= CastleKeys[GameBoard.castlePerm], b
}

function PrintPieceLists() {
    var a, b;
    for (a = PIECES.wP; a <= PIECES.bK; ++a)
        for (b = 0; b < GameBoard.pceNum[a]; ++b) console.log("Piece " + PceChar[a] + " on " + PrSq(GameBoard.pList[PCEINDEX(a, b)]))
}

function UpdateListsMaterial() {
    var a, b, c, d;
    for (c = 0; c < 1680; ++c) GameBoard.pList[c] = PIECES.EMPTY;
    for (c = 0; 2 > c; ++c) GameBoard.material[c] = 0;
    for (c = 0; 13 > c; ++c) GameBoard.pceNum[c] = 0;
    for (c = 0; 64 > c; ++c) b = SQ120(c), a = GameBoard.pieces[b], a != PIECES.EMPTY && (d = PieceCol[a], GameBoard.material[d] += PieceVal[a], GameBoard.pList[PCEINDEX(a, GameBoard.pceNum[a])] = b, GameBoard.pceNum[a]++)
}

function ResetBoard() {
    var a = 0;
    for (a = 0; a < BRD_SQ_NUM; ++a) GameBoard.pieces[a] = SQUARES.OFFBOARD;
    for (a = 0; 64 > a; ++a) GameBoard.pieces[SQ120(a)] = PIECES.EMPTY;
    GameBoard.side = COLOURS.BOTH, GameBoard.enPas = SQUARES.NO_SQ, GameBoard.fiftyMove = 0, GameBoard.ply = 0, GameBoard.hisPly = 0, GameBoard.castlePerm = 0, GameBoard.posKey = 0, GameBoard.moveListStart[GameBoard.ply] = 0
}

function ParseFen(a) {
    ResetBoard();
    for (var b = RANKS.RANK_8, c = FILES.FILE_A, d = 0, e = 0, f = 0, g = 0, h = 0; b >= RANKS.RANK_1 && h < a.length;) {
        switch (e = 1, a[h]) {
            case "p":
                d = PIECES.bP;
                break;
            case "r":
                d = PIECES.bR;
                break;
            case "n":
                d = PIECES.bN;
                break;
            case "b":
                d = PIECES.bB;
                break;
            case "k":
                d = PIECES.bK;
                break;
            case "q":
                d = PIECES.bQ;
                break;
            case "P":
                d = PIECES.wP;
                break;
            case "R":
                d = PIECES.wR;
                break;
            case "N":
                d = PIECES.wN;
                break;
            case "B":
                d = PIECES.wB;
                break;
            case "K":
                d = PIECES.wK;
                break;
            case "Q":
                d = PIECES.wQ;
                break;
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
                d = PIECES.EMPTY, e = a[h].charCodeAt() - 48;
                break;
            case "/":
            case " ":
                b--, c = FILES.FILE_A, h++;
                continue;
            default:
                return void console.log("FEN error");
        }
        for (f = 0; f < e; f++) g = FR2SQ(c, b), GameBoard.pieces[g] = d, c++;
        h++
    }
    for (GameBoard.side = "w" == a[h] ? COLOURS.WHITE : COLOURS.BLACK, h += 2, f = 0; 4 > f && !(" " == a[h]); f++) {
        switch (a[h]) {
            case "K":
                GameBoard.castlePerm |= CASTLEBIT.WKCA;
                break;
            case "Q":
                GameBoard.castlePerm |= CASTLEBIT.WQCA;
                break;
            case "k":
                GameBoard.castlePerm |= CASTLEBIT.BKCA;
                break;
            case "q":
                GameBoard.castlePerm |= CASTLEBIT.BQCA;
                break;
            default:
        }
        h++
    }
    h++, "-" != a[h] && (c = a[h].charCodeAt() - 97, b = a[h + 1].charCodeAt() - 49, console.log("fen[fenCnt]:" + a[h] + " File:" + c + " Rank:" + b), GameBoard.enPas = FR2SQ(c, b)), GameBoard.posKey = GeneratePosKey(), UpdateListsMaterial()
}

function PrintSqAttacked() {
    var a, b, c, d;
    for (console.log("\nAttacked:\n"), c = RANKS.RANK_8; c >= RANKS.RANK_1; c--) {
        var e = c + 1 + "  ";
        for (b = FILES.FILE_A; b <= FILES.FILE_H; b++) a = FR2SQ(b, c), d = SqAttacked(a, 1 ^ GameBoard.side) == BOOL.TRUE ? "X" : "-", e += " " + d + " ";
        console.log(e)
    }
    console.log("")
}

function SqAttacked(a, b) {
    var c, d, e;
    if (b == COLOURS.WHITE) {
        if (GameBoard.pieces[a - 11] == PIECES.wP || GameBoard.pieces[a - 9] == PIECES.wP) return BOOL.TRUE;
    } else if (GameBoard.pieces[a + 11] == PIECES.bP || GameBoard.pieces[a + 9] == PIECES.bP) return BOOL.TRUE;
    for (e = 0; 8 > e; e++)
        if (c = GameBoard.pieces[a + KnDir[e]], c != SQUARES.OFFBOARD && PieceCol[c] == b && PieceKnight[c] == BOOL.TRUE) return BOOL.TRUE;
    for (e = 0; 4 > e; ++e)
        for (dir = RkDir[e], d = a + dir, c = GameBoard.pieces[d]; c != SQUARES.OFFBOARD;) {
            if (c != PIECES.EMPTY) {
                if (PieceRookQueen[c] == BOOL.TRUE && PieceCol[c] == b) return BOOL.TRUE;
                break
            }
            d += dir, c = GameBoard.pieces[d]
        }
    for (e = 0; 4 > e; ++e)
        for (dir = BiDir[e], d = a + dir, c = GameBoard.pieces[d]; c != SQUARES.OFFBOARD;) {
            if (c != PIECES.EMPTY) {
                if (PieceBishopQueen[c] == BOOL.TRUE && PieceCol[c] == b) return BOOL.TRUE;
                break
            }
            d += dir, c = GameBoard.pieces[d]
        }
    for (e = 0; 8 > e; e++)
        if (c = GameBoard.pieces[a + KiDir[e]], c != SQUARES.OFFBOARD && PieceCol[c] == b && PieceKing[c] == BOOL.TRUE) return BOOL.TRUE;
    return BOOL.FALSE
}
var MvvLvaValue = [0, 100, 200, 300, 400, 500, 600, 100, 200, 300, 400, 500, 600],
    MvvLvaScores = Array(196);

function InitMvvLva() {
    var a, b;
    for (a = PIECES.wP; a <= PIECES.bK; ++a)
        for (b = PIECES.wP; b <= PIECES.bK; ++b) MvvLvaScores[14 * b + a] = MvvLvaValue[b] + 6 - MvvLvaValue[a] / 100
}

function MoveExists(a) {
    GenerateMoves();
    var b, c = NOMOVE;
    for (b = GameBoard.moveListStart[GameBoard.ply]; b < GameBoard.moveListStart[GameBoard.ply + 1]; ++b)
        if ((c = GameBoard.moveList[b], MakeMove(c) != BOOL.FALSE) && (TakeMove(), a == c)) return BOOL.TRUE;
    return BOOL.FALSE
}

function MOVE(a, b, c, d, e) {
    return a | b << 7 | c << 14 | d << 20 | e
}

function AddCaptureMove(a) {
    GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply + 1]] = a, GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]++] = MvvLvaScores[14 * CAPTURED(a) + GameBoard.pieces[FROMSQ(a)]] + 1e6
}

function AddQuietMove(a) {
    GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply + 1]] = a, GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]] = 0, GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]] = a == GameBoard.searchKillers[GameBoard.ply] ? 9e5 : a == GameBoard.searchKillers[GameBoard.ply + MAXDEPTH] ? 8e5 : GameBoard.searchHistory[GameBoard.pieces[FROMSQ(a)] * BRD_SQ_NUM + TOSQ(a)], GameBoard.moveListStart[GameBoard.ply + 1]++
}

function AddEnPassantMove(a) {
    GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply + 1]] = a, GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]++] = 1000105
}

function AddWhitePawnCaptureMove(a, b, c) {
    RanksBrd[a] == RANKS.RANK_7 ? (AddCaptureMove(MOVE(a, b, c, PIECES.wQ, 0)), AddCaptureMove(MOVE(a, b, c, PIECES.wR, 0)), AddCaptureMove(MOVE(a, b, c, PIECES.wB, 0)), AddCaptureMove(MOVE(a, b, c, PIECES.wN, 0))) : AddCaptureMove(MOVE(a, b, c, PIECES.EMPTY, 0))
}

function AddBlackPawnCaptureMove(a, b, c) {
    RanksBrd[a] == RANKS.RANK_2 ? (AddCaptureMove(MOVE(a, b, c, PIECES.bQ, 0)), AddCaptureMove(MOVE(a, b, c, PIECES.bR, 0)), AddCaptureMove(MOVE(a, b, c, PIECES.bB, 0)), AddCaptureMove(MOVE(a, b, c, PIECES.bN, 0))) : AddCaptureMove(MOVE(a, b, c, PIECES.EMPTY, 0))
}

function AddWhitePawnQuietMove(a, b) {
    RanksBrd[a] == RANKS.RANK_7 ? (AddQuietMove(MOVE(a, b, PIECES.EMPTY, PIECES.wQ, 0)), AddQuietMove(MOVE(a, b, PIECES.EMPTY, PIECES.wR, 0)), AddQuietMove(MOVE(a, b, PIECES.EMPTY, PIECES.wB, 0)), AddQuietMove(MOVE(a, b, PIECES.EMPTY, PIECES.wN, 0))) : AddQuietMove(MOVE(a, b, PIECES.EMPTY, PIECES.EMPTY, 0))
}

function AddBlackPawnQuietMove(a, b) {
    RanksBrd[a] == RANKS.RANK_2 ? (AddQuietMove(MOVE(a, b, PIECES.EMPTY, PIECES.bQ, 0)), AddQuietMove(MOVE(a, b, PIECES.EMPTY, PIECES.bR, 0)), AddQuietMove(MOVE(a, b, PIECES.EMPTY, PIECES.bB, 0)), AddQuietMove(MOVE(a, b, PIECES.EMPTY, PIECES.bN, 0))) : AddQuietMove(MOVE(a, b, PIECES.EMPTY, PIECES.EMPTY, 0))
}

function GenerateMoves() {
    GameBoard.moveListStart[GameBoard.ply + 1] = GameBoard.moveListStart[GameBoard.ply];
    var a, b, c, d, e, f, g;
    if (GameBoard.side == COLOURS.WHITE) {
        for (a = PIECES.wP, b = 0; b < GameBoard.pceNum[a]; ++b) c = GameBoard.pList[PCEINDEX(a, b)], GameBoard.pieces[c + 10] == PIECES.EMPTY && (AddWhitePawnQuietMove(c, c + 10), RanksBrd[c] == RANKS.RANK_2 && GameBoard.pieces[c + 20] == PIECES.EMPTY && AddQuietMove(MOVE(c, c + 20, PIECES.EMPTY, PIECES.EMPTY, MFLAGPS))), SQOFFBOARD(c + 9) == BOOL.FALSE && PieceCol[GameBoard.pieces[c + 9]] == COLOURS.BLACK && AddWhitePawnCaptureMove(c, c + 9, GameBoard.pieces[c + 9]), SQOFFBOARD(c + 11) == BOOL.FALSE && PieceCol[GameBoard.pieces[c + 11]] == COLOURS.BLACK && AddWhitePawnCaptureMove(c, c + 11, GameBoard.pieces[c + 11]), GameBoard.enPas != SQUARES.NO_SQ && (c + 9 == GameBoard.enPas && AddEnPassantMove(MOVE(c, c + 9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP)), c + 11 == GameBoard.enPas && AddEnPassantMove(MOVE(c, c + 11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP)));
        GameBoard.castlePerm & CASTLEBIT.WKCA && GameBoard.pieces[SQUARES.F1] == PIECES.EMPTY && GameBoard.pieces[SQUARES.G1] == PIECES.EMPTY && SqAttacked(SQUARES.F1, COLOURS.BLACK) == BOOL.FALSE && SqAttacked(SQUARES.E1, COLOURS.BLACK) == BOOL.FALSE && AddQuietMove(MOVE(SQUARES.E1, SQUARES.G1, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA)), GameBoard.castlePerm & CASTLEBIT.WQCA && GameBoard.pieces[SQUARES.D1] == PIECES.EMPTY && GameBoard.pieces[SQUARES.C1] == PIECES.EMPTY && GameBoard.pieces[SQUARES.B1] == PIECES.EMPTY && SqAttacked(SQUARES.D1, COLOURS.BLACK) == BOOL.FALSE && SqAttacked(SQUARES.E1, COLOURS.BLACK) == BOOL.FALSE && AddQuietMove(MOVE(SQUARES.E1, SQUARES.C1, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA))
    } else {
        for (a = PIECES.bP, b = 0; b < GameBoard.pceNum[a]; ++b) c = GameBoard.pList[PCEINDEX(a, b)], GameBoard.pieces[c - 10] == PIECES.EMPTY && (AddBlackPawnQuietMove(c, c - 10), RanksBrd[c] == RANKS.RANK_7 && GameBoard.pieces[c - 20] == PIECES.EMPTY && AddQuietMove(MOVE(c, c - 20, PIECES.EMPTY, PIECES.EMPTY, MFLAGPS))), SQOFFBOARD(c - 9) == BOOL.FALSE && PieceCol[GameBoard.pieces[c - 9]] == COLOURS.WHITE && AddBlackPawnCaptureMove(c, c - 9, GameBoard.pieces[c - 9]), SQOFFBOARD(c - 11) == BOOL.FALSE && PieceCol[GameBoard.pieces[c - 11]] == COLOURS.WHITE && AddBlackPawnCaptureMove(c, c - 11, GameBoard.pieces[c - 11]), GameBoard.enPas != SQUARES.NO_SQ && (c - 9 == GameBoard.enPas && AddEnPassantMove(MOVE(c, c - 9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP)), c - 11 == GameBoard.enPas && AddEnPassantMove(MOVE(c, c - 11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP)));
        GameBoard.castlePerm & CASTLEBIT.BKCA && GameBoard.pieces[SQUARES.F8] == PIECES.EMPTY && GameBoard.pieces[SQUARES.G8] == PIECES.EMPTY && SqAttacked(SQUARES.F8, COLOURS.WHITE) == BOOL.FALSE && SqAttacked(SQUARES.E8, COLOURS.WHITE) == BOOL.FALSE && AddQuietMove(MOVE(SQUARES.E8, SQUARES.G8, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA)), GameBoard.castlePerm & CASTLEBIT.BQCA && GameBoard.pieces[SQUARES.D8] == PIECES.EMPTY && GameBoard.pieces[SQUARES.C8] == PIECES.EMPTY && GameBoard.pieces[SQUARES.B8] == PIECES.EMPTY && SqAttacked(SQUARES.D8, COLOURS.WHITE) == BOOL.FALSE && SqAttacked(SQUARES.E8, COLOURS.WHITE) == BOOL.FALSE && AddQuietMove(MOVE(SQUARES.E8, SQUARES.C8, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA))
    }
    for (d = LoopNonSlideIndex[GameBoard.side], e = LoopNonSlidePce[d++]; 0 != e;) {
        for (b = 0; b < GameBoard.pceNum[e]; ++b)
            for (c = GameBoard.pList[PCEINDEX(e, b)], index = 0; index < DirNum[e]; index++)(g = PceDir[e][index], f = c + g, SQOFFBOARD(f) != BOOL.TRUE) && (GameBoard.pieces[f] == PIECES.EMPTY ? AddQuietMove(MOVE(c, f, PIECES.EMPTY, PIECES.EMPTY, 0)) : PieceCol[GameBoard.pieces[f]] != GameBoard.side && AddCaptureMove(MOVE(c, f, GameBoard.pieces[f], PIECES.EMPTY, 0)));
        e = LoopNonSlidePce[d++]
    }
    for (d = LoopSlideIndex[GameBoard.side], e = LoopSlidePce[d++]; 0 != e;) {
        for (b = 0; b < GameBoard.pceNum[e]; ++b)
            for (c = GameBoard.pList[PCEINDEX(e, b)], index = 0; index < DirNum[e]; index++)
                for (g = PceDir[e][index], f = c + g; SQOFFBOARD(f) == BOOL.FALSE;) {
                    if (GameBoard.pieces[f] != PIECES.EMPTY) {
                        PieceCol[GameBoard.pieces[f]] != GameBoard.side && AddCaptureMove(MOVE(c, f, GameBoard.pieces[f], PIECES.EMPTY, 0));
                        break
                    }
                    AddQuietMove(MOVE(c, f, PIECES.EMPTY, PIECES.EMPTY, 0)), f += g
                }
        e = LoopSlidePce[d++]
    }
}

function GenerateCaptures() {
    GameBoard.moveListStart[GameBoard.ply + 1] = GameBoard.moveListStart[GameBoard.ply];
    var a, b, c, d, e, f, g;
    if (GameBoard.side == COLOURS.WHITE)
        for (a = PIECES.wP, b = 0; b < GameBoard.pceNum[a]; ++b) c = GameBoard.pList[PCEINDEX(a, b)], SQOFFBOARD(c + 9) == BOOL.FALSE && PieceCol[GameBoard.pieces[c + 9]] == COLOURS.BLACK && AddWhitePawnCaptureMove(c, c + 9, GameBoard.pieces[c + 9]), SQOFFBOARD(c + 11) == BOOL.FALSE && PieceCol[GameBoard.pieces[c + 11]] == COLOURS.BLACK && AddWhitePawnCaptureMove(c, c + 11, GameBoard.pieces[c + 11]), GameBoard.enPas != SQUARES.NO_SQ && (c + 9 == GameBoard.enPas && AddEnPassantMove(MOVE(c, c + 9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP)), c + 11 == GameBoard.enPas && AddEnPassantMove(MOVE(c, c + 11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP)));
    else
        for (a = PIECES.bP, b = 0; b < GameBoard.pceNum[a]; ++b) c = GameBoard.pList[PCEINDEX(a, b)], SQOFFBOARD(c - 9) == BOOL.FALSE && PieceCol[GameBoard.pieces[c - 9]] == COLOURS.WHITE && AddBlackPawnCaptureMove(c, c - 9, GameBoard.pieces[c - 9]), SQOFFBOARD(c - 11) == BOOL.FALSE && PieceCol[GameBoard.pieces[c - 11]] == COLOURS.WHITE && AddBlackPawnCaptureMove(c, c - 11, GameBoard.pieces[c - 11]), GameBoard.enPas != SQUARES.NO_SQ && (c - 9 == GameBoard.enPas && AddEnPassantMove(MOVE(c, c - 9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP)), c - 11 == GameBoard.enPas && AddEnPassantMove(MOVE(c, c - 11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP)));
    for (d = LoopNonSlideIndex[GameBoard.side], e = LoopNonSlidePce[d++]; 0 != e;) {
        for (b = 0; b < GameBoard.pceNum[e]; ++b)
            for (c = GameBoard.pList[PCEINDEX(e, b)], index = 0; index < DirNum[e]; index++)(g = PceDir[e][index], f = c + g, SQOFFBOARD(f) != BOOL.TRUE) && GameBoard.pieces[f] != PIECES.EMPTY && PieceCol[GameBoard.pieces[f]] != GameBoard.side && AddCaptureMove(MOVE(c, f, GameBoard.pieces[f], PIECES.EMPTY, 0));
        e = LoopNonSlidePce[d++]
    }
    for (d = LoopSlideIndex[GameBoard.side], e = LoopSlidePce[d++]; 0 != e;) {
        for (b = 0; b < GameBoard.pceNum[e]; ++b)
            for (c = GameBoard.pList[PCEINDEX(e, b)], index = 0; index < DirNum[e]; index++)
                for (g = PceDir[e][index], f = c + g; SQOFFBOARD(f) == BOOL.FALSE;) {
                    if (GameBoard.pieces[f] != PIECES.EMPTY) {
                        PieceCol[GameBoard.pieces[f]] != GameBoard.side && AddCaptureMove(MOVE(c, f, GameBoard.pieces[f], PIECES.EMPTY, 0));
                        break
                    }
                    f += g
                }
        e = LoopSlidePce[d++]
    }
}

function ClearPiece(a) {
    var b, c = GameBoard.pieces[a],
        d = PieceCol[c],
        e = -1;
    for (HASH_PCE(c, a), GameBoard.pieces[a] = PIECES.EMPTY, GameBoard.material[d] -= PieceVal[c], b = 0; b < GameBoard.pceNum[c]; ++b)
        if (GameBoard.pList[PCEINDEX(c, b)] == a) {
            e = b;
            break
        } GameBoard.pceNum[c]--, GameBoard.pList[PCEINDEX(c, e)] = GameBoard.pList[PCEINDEX(c, GameBoard.pceNum[c])]
}

function AddPiece(a, b) {
    var c = PieceCol[b];
    HASH_PCE(b, a), GameBoard.pieces[a] = b, GameBoard.material[c] += PieceVal[b], GameBoard.pList[PCEINDEX(b, GameBoard.pceNum[b])] = a, GameBoard.pceNum[b]++
}

function MovePiece(a, b) {
    var c = 0,
        d = GameBoard.pieces[a];
    for (HASH_PCE(d, a), GameBoard.pieces[a] = PIECES.EMPTY, HASH_PCE(d, b), GameBoard.pieces[b] = d, c = 0; c < GameBoard.pceNum[d]; ++c)
        if (GameBoard.pList[PCEINDEX(d, c)] == a) {
            GameBoard.pList[PCEINDEX(d, c)] = b;
            break
        }
}

function MakeMove(a) {
    var b = FROMSQ(a),
        c = TOSQ(a),
        d = GameBoard.side;
    if (GameBoard.history[GameBoard.hisPly].posKey = GameBoard.posKey, 0 != (a & MFLAGEP)) d == COLOURS.WHITE ? ClearPiece(c - 10) : ClearPiece(c + 10);
    else if (0 != (a & MFLAGCA)) switch (c) {
        case SQUARES.C1:
            MovePiece(SQUARES.A1, SQUARES.D1);
            break;
        case SQUARES.C8:
            MovePiece(SQUARES.A8, SQUARES.D8);
            break;
        case SQUARES.G1:
            MovePiece(SQUARES.H1, SQUARES.F1);
            break;
        case SQUARES.G8:
            MovePiece(SQUARES.H8, SQUARES.F8);
            break;
        default:
    }
    GameBoard.enPas != SQUARES.NO_SQ && HASH_EP(), HASH_CA(), GameBoard.history[GameBoard.hisPly].move = a, GameBoard.history[GameBoard.hisPly].fiftyMove = GameBoard.fiftyMove, GameBoard.history[GameBoard.hisPly].enPas = GameBoard.enPas, GameBoard.history[GameBoard.hisPly].castlePerm = GameBoard.castlePerm, GameBoard.castlePerm &= CastlePerm[b], GameBoard.castlePerm &= CastlePerm[c], GameBoard.enPas = SQUARES.NO_SQ, HASH_CA();
    var e = CAPTURED(a);
    GameBoard.fiftyMove++, e != PIECES.EMPTY && (ClearPiece(c), GameBoard.fiftyMove = 0), GameBoard.hisPly++, GameBoard.ply++, PiecePawn[GameBoard.pieces[b]] == BOOL.TRUE && (GameBoard.fiftyMove = 0, 0 != (a & MFLAGPS) && (GameBoard.enPas = d == COLOURS.WHITE ? b + 10 : b - 10, HASH_EP())), MovePiece(b, c);
    var f = PROMOTED(a);
    return f != PIECES.EMPTY && (ClearPiece(c), AddPiece(c, f)), GameBoard.side ^= 1, HASH_SIDE(), SqAttacked(GameBoard.pList[PCEINDEX(Kings[d], 0)], GameBoard.side) ? (TakeMove(), BOOL.FALSE) : BOOL.TRUE
}

function TakeMove() {
    GameBoard.hisPly--, GameBoard.ply--;
    var a = GameBoard.history[GameBoard.hisPly].move,
        b = FROMSQ(a),
        c = TOSQ(a);
    if (GameBoard.enPas != SQUARES.NO_SQ && HASH_EP(), HASH_CA(), GameBoard.castlePerm = GameBoard.history[GameBoard.hisPly].castlePerm, GameBoard.fiftyMove = GameBoard.history[GameBoard.hisPly].fiftyMove, GameBoard.enPas = GameBoard.history[GameBoard.hisPly].enPas, GameBoard.enPas != SQUARES.NO_SQ && HASH_EP(), HASH_CA(), GameBoard.side ^= 1, HASH_SIDE(), 0 != (MFLAGEP & a)) GameBoard.side == COLOURS.WHITE ? AddPiece(c - 10, PIECES.bP) : AddPiece(c + 10, PIECES.wP);
    else if (0 != (MFLAGCA & a)) switch (c) {
        case SQUARES.C1:
            MovePiece(SQUARES.D1, SQUARES.A1);
            break;
        case SQUARES.C8:
            MovePiece(SQUARES.D8, SQUARES.A8);
            break;
        case SQUARES.G1:
            MovePiece(SQUARES.F1, SQUARES.H1);
            break;
        case SQUARES.G8:
            MovePiece(SQUARES.F8, SQUARES.H8);
            break;
        default:
    }
    MovePiece(c, b);
    var d = CAPTURED(a);
    d != PIECES.EMPTY && AddPiece(c, d), PROMOTED(a) != PIECES.EMPTY && (ClearPiece(b), AddPiece(b, PieceCol[PROMOTED(a)] == COLOURS.WHITE ? PIECES.wP : PIECES.bP))
}
var PawnTable = [0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 0, -10, -10, 0, 10, 10, 5, 0, 0, 5, 5, 0, 0, 5, 0, 0, 10, 20, 20, 10, 0, 0, 5, 5, 5, 10, 10, 5, 5, 5, 10, 10, 10, 20, 20, 10, 10, 10, 20, 20, 20, 30, 30, 20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0],
    KnightTable = [0, -10, 0, 0, 0, 0, -10, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 10, 10, 10, 10, 0, 0, 0, 0, 10, 20, 20, 10, 5, 0, 5, 10, 15, 20, 20, 15, 10, 5, 5, 10, 10, 20, 20, 10, 10, 5, 0, 0, 5, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    BishopTable = [0, 0, -10, 0, 0, -10, 0, 0, 0, 0, 0, 10, 10, 0, 0, 0, 0, 0, 10, 15, 15, 10, 0, 0, 0, 10, 15, 20, 20, 15, 10, 0, 0, 10, 15, 20, 20, 15, 10, 0, 0, 0, 10, 15, 15, 10, 0, 0, 0, 0, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    RookTable = [0, 0, 5, 10, 10, 5, 0, 0, 0, 0, 5, 10, 10, 5, 0, 0, 0, 0, 5, 10, 10, 5, 0, 0, 0, 0, 5, 10, 10, 5, 0, 0, 0, 0, 5, 10, 10, 5, 0, 0, 0, 0, 5, 10, 10, 5, 0, 0, 25, 25, 25, 25, 25, 25, 25, 25, 0, 0, 5, 10, 10, 5, 0, 0],
    BishopPair = 40;

function EvalPosition() {
    var a, b, c, d = GameBoard.material[COLOURS.WHITE] - GameBoard.material[COLOURS.BLACK];
    for (a = PIECES.wP, c = 0; c < GameBoard.pceNum[a]; ++c) b = GameBoard.pList[PCEINDEX(a, c)], d += PawnTable[SQ64(b)];
    for (a = PIECES.bP, c = 0; c < GameBoard.pceNum[a]; ++c) b = GameBoard.pList[PCEINDEX(a, c)], d -= PawnTable[MIRROR64(SQ64(b))];
    for (a = PIECES.wN, c = 0; c < GameBoard.pceNum[a]; ++c) b = GameBoard.pList[PCEINDEX(a, c)], d += KnightTable[SQ64(b)];
    for (a = PIECES.bN, c = 0; c < GameBoard.pceNum[a]; ++c) b = GameBoard.pList[PCEINDEX(a, c)], d -= KnightTable[MIRROR64(SQ64(b))];
    for (a = PIECES.wB, c = 0; c < GameBoard.pceNum[a]; ++c) b = GameBoard.pList[PCEINDEX(a, c)], d += BishopTable[SQ64(b)];
    for (a = PIECES.bB, c = 0; c < GameBoard.pceNum[a]; ++c) b = GameBoard.pList[PCEINDEX(a, c)], d -= BishopTable[MIRROR64(SQ64(b))];
    for (a = PIECES.wR, c = 0; c < GameBoard.pceNum[a]; ++c) b = GameBoard.pList[PCEINDEX(a, c)], d += RookTable[SQ64(b)];
    for (a = PIECES.bR, c = 0; c < GameBoard.pceNum[a]; ++c) b = GameBoard.pList[PCEINDEX(a, c)], d -= RookTable[MIRROR64(SQ64(b))];
    for (a = PIECES.wQ, c = 0; c < GameBoard.pceNum[a]; ++c) b = GameBoard.pList[PCEINDEX(a, c)], d += RookTable[SQ64(b)];
    for (a = PIECES.bQ, c = 0; c < GameBoard.pceNum[a]; ++c) b = GameBoard.pList[PCEINDEX(a, c)], d -= RookTable[MIRROR64(SQ64(b))];
    return 2 <= GameBoard.pceNum[PIECES.wB] && (d += BishopPair), 2 <= GameBoard.pceNum[PIECES.bB] && (d -= BishopPair), GameBoard.side == COLOURS.WHITE ? d : -d
}

function GetPvLine(a) {
    for (var b = ProbePvTable(), c = 0; b != NOMOVE && c < a && MoveExists(b) == BOOL.TRUE;) {
        MakeMove(b), GameBoard.PvArray[c++] = b;
        b = ProbePvTable()
    }
    for (; 0 < GameBoard.ply;) TakeMove();
    return c
}

function ProbePvTable() {
    var a = GameBoard.posKey % PVENTRIES;
    return GameBoard.PvTable[a].posKey == GameBoard.posKey ? GameBoard.PvTable[a].move : NOMOVE
}

function StorePvMove(a) {
    var b = GameBoard.posKey % PVENTRIES;
    GameBoard.PvTable[b].posKey = GameBoard.posKey, GameBoard.PvTable[b].move = a
}
var SearchController = {};
SearchController.nodes, SearchController.fh, SearchController.fhf, SearchController.depth, SearchController.time, SearchController.start, SearchController.stop, SearchController.best, SearchController.thinking;

function PickNextMove(a) {
    var b = 0,
        c = -1,
        d = a;
    for (b = a; b < GameBoard.moveListStart[GameBoard.ply + 1]; ++b) GameBoard.moveScores[b] > c && (c = GameBoard.moveScores[b], d = b);
    if (d != a) {
        var e = 0;
        e = GameBoard.moveScores[a], GameBoard.moveScores[a] = GameBoard.moveScores[d], GameBoard.moveScores[d] = e, e = GameBoard.moveList[a], GameBoard.moveList[a] = GameBoard.moveList[d], GameBoard.moveList[d] = e
    }
}

function ClearPvTable() {
    for (index = 0; index < PVENTRIES; index++) GameBoard.PvTable[index].move = NOMOVE, GameBoard.PvTable[index].posKey = 0
}

function CheckUp() {
    $.now() - SearchController.start > SearchController.time && (SearchController.stop = BOOL.TRUE)
}

function IsRepetition() {
    var a = 0;
    for (a = GameBoard.hisPly - GameBoard.fiftyMove; a < GameBoard.hisPly - 1; ++a)
        if (GameBoard.posKey == GameBoard.history[a].posKey) return BOOL.TRUE;
    return BOOL.FALSE
}

function Quiescence(a, b) {
    if (0 == (2047 & SearchController.nodes) && CheckUp(), SearchController.nodes++, (IsRepetition() || 100 <= GameBoard.fiftyMove) && 0 != GameBoard.ply) return 0;
    if (GameBoard.ply > MAXDEPTH - 1) return EvalPosition();
    var c = EvalPosition();
    if (c >= b) return b;
    c > a && (a = c), GenerateCaptures();
    var d = 0,
        e = 0,
        f = a,
        g = NOMOVE,
        h = NOMOVE;
    for (d = GameBoard.moveListStart[GameBoard.ply]; d < GameBoard.moveListStart[GameBoard.ply + 1]; ++d)
        if (PickNextMove(d), h = GameBoard.moveList[d], MakeMove(h) != BOOL.FALSE) {
            if (e++, c = -Quiescence(-b, -a), TakeMove(), SearchController.stop == BOOL.TRUE) return 0;
            if (c > a) {
                if (c >= b) return 1 == e && SearchController.fhf++, SearchController.fh++, b;
                a = c, g = h
            }
        } return a != f && StorePvMove(g), a
}

function AlphaBeta(a, b, c) {
    if (0 >= c) return Quiescence(a, b);
    if (0 == (2047 & SearchController.nodes) && CheckUp(), SearchController.nodes++, (IsRepetition() || 100 <= GameBoard.fiftyMove) && 0 != GameBoard.ply) return 0;
    if (GameBoard.ply > MAXDEPTH - 1) return EvalPosition();
    var d = SqAttacked(GameBoard.pList[PCEINDEX(Kings[GameBoard.side], 0)], 1 ^ GameBoard.side);
    d == BOOL.TRUE && c++;
    var e = -INFINITE;
    GenerateMoves();
    var f = 0,
        g = 0,
        h = a,
        i = NOMOVE,
        j = NOMOVE,
        k = ProbePvTable();
    if (k != NOMOVE)
        for (f = GameBoard.moveListStart[GameBoard.ply]; f < GameBoard.moveListStart[GameBoard.ply + 1]; ++f)
            if (GameBoard.moveList[f] == k) {
                GameBoard.moveScores[f] = 2e6;
                break
            } for (f = GameBoard.moveListStart[GameBoard.ply]; f < GameBoard.moveListStart[GameBoard.ply + 1]; ++f)
        if (PickNextMove(f), j = GameBoard.moveList[f], MakeMove(j) != BOOL.FALSE) {
            if (g++, e = -AlphaBeta(-b, -a, c - 1), TakeMove(), SearchController.stop == BOOL.TRUE) return 0;
            if (e > a) {
                if (e >= b) return 1 == g && SearchController.fhf++, SearchController.fh++, 0 == (j & MFLAGCAP) && (GameBoard.searchKillers[MAXDEPTH + GameBoard.ply] = GameBoard.searchKillers[GameBoard.ply], GameBoard.searchKillers[GameBoard.ply] = j), b;
                0 == (j & MFLAGCAP) && (GameBoard.searchHistory[GameBoard.pieces[FROMSQ(j)] * BRD_SQ_NUM + TOSQ(j)] += c * c), a = e, i = j
            }
        } return 0 == g ? d == BOOL.TRUE ? -MATE + GameBoard.ply : 0 : (a != h && StorePvMove(i), a)
}

function ClearForSearch() {
    var a = 0;
    for (a = 0; a < 14 * BRD_SQ_NUM; ++a) GameBoard.searchHistory[a] = 0;
    for (a = 0; a < 3 * MAXDEPTH; ++a) GameBoard.searchKillers[a] = 0;
    ClearPvTable(), GameBoard.ply = 0, SearchController.nodes = 0, SearchController.fh = 0, SearchController.fhf = 0, SearchController.start = $.now(), SearchController.stop = BOOL.FALSE
}

function SearchPosition() {
    var a, b, d, e = NOMOVE,
        f = -INFINITE,
        g = -INFINITE,
        h = 0;
    for (ClearForSearch(), h = 1; h <= SearchController.depth && (g = AlphaBeta(-INFINITE, INFINITE, h), SearchController.stop != BOOL.TRUE); ++h) {
        for (f = g, e = ProbePvTable(), a = "D:" + h + " Best:" + PrMove(e) + " Score:" + f + " nodes:" + SearchController.nodes, b = GetPvLine(h), a += " Pv:", d = 0; d < b; ++d) a += " " + PrMove(GameBoard.PvArray[d]);
        1 != h && (a += " Ordering:" + (100 * (SearchController.fhf / SearchController.fh)).toFixed(2) + "%"), console.log(a)
    }
    SearchController.best = e, SearchController.thinking = BOOL.FALSE, UpdateDOMStats(f, h)
}

function UpdateDOMStats(a, b) {
    var c = "Score: " + (a / 100).toFixed(2);
    Math.abs(a) > MATE - MAXDEPTH && (c = "Score: Mate In " + (MATE - Math.abs(a) - 1) + " moves"), $("#OrderingOut").text("Ordering: " + (100 * (SearchController.fhf / SearchController.fh)).toFixed(2) + "%"), $("#DepthOut").text("Depth: " + b), $("#ScoreOut").text(c), $("#NodesOut").text("Nodes: " + SearchController.nodes), $("#TimeOut").text("Time: " + (($.now() - SearchController.start) / 1e3).toFixed(1) + "s"), $("#BestOut").text("BestMove: " + PrMove(SearchController.best))
}
var perft_leafNodes;

function Perft(a) {
    if (0 == a) return void perft_leafNodes++;
    GenerateMoves();
    var b, c;
    for (b = GameBoard.moveListStart[GameBoard.ply]; b < GameBoard.moveListStart[GameBoard.ply + 1]; ++b)(c = GameBoard.moveList[b], MakeMove(c) != BOOL.FALSE) && (Perft(a - 1), TakeMove())
}

function PerftTest(a) {
    PrintBoard(), console.log("Starting Test To Depth:" + a), perft_leafNodes = 0;
    var b, c, d = 0;
    for (b = GameBoard.moveListStart[GameBoard.ply]; b < GameBoard.moveListStart[GameBoard.ply + 1]; ++b)
        if (c = GameBoard.moveList[b], MakeMove(c) != BOOL.FALSE) {
            d++;
            var e = perft_leafNodes;
            Perft(a - 1), TakeMove();
            var f = perft_leafNodes - e;
            console.log("move:" + d + " " + PrMove(c) + " " + f)
        } console.log("Test Complete : " + perft_leafNodes + " leaf nodes visited")
}
$("#SetFen").click(function () {
    var a = $("#fenIn").val();
    NewGame(a)
}), $("#TakeButton").click(function () {
    0 < GameBoard.hisPly && (TakeMove(), GameBoard.ply = 0, SetInitialBoardPieces())
}), $("#NewGameButton").click(function () {
    NewGame(START_FEN)
});

function NewGame(a) {
    ParseFen(a), PrintBoard(), SetInitialBoardPieces(), CheckAndSet()
}

function ClearAllPieces() {
    $(".Piece").remove()
}

function SetInitialBoardPieces() {
    var a, b, c;
    for (ClearAllPieces(), a = 0; 64 > a; ++a) b = SQ120(a), c = GameBoard.pieces[b], c >= PIECES.wP && c <= PIECES.bK && AddGUIPiece(b, c)
}

function DeSelectSq(a) {
    $(".Square").each(function () {
        PieceIsOnSq(a, $(this).position().top, $(this).position().left) == BOOL.TRUE && $(this).removeClass("SqSelected")
    })
}

function SetSqSelected(a) {
    $(".Square").each(function () {
        PieceIsOnSq(a, $(this).position().top, $(this).position().left) == BOOL.TRUE && $(this).addClass("SqSelected")
    })
}

function ClickedSquare(a, b) {
    console.log("ClickedSquare() at " + a + "," + b);
    var c = $("#Board").position(),
        d = Math.floor(c.left),
        e = Math.floor(c.top);
    a = Math.floor(a), b = Math.floor(b);
    var f = Math.floor((a - d) / 60),
        g = 7 - Math.floor((b - e) / 60),
        h = FR2SQ(f, g);
    return console.log("Clicked sq:" + PrSq(h)), SetSqSelected(h), h
}
$(document).on("click", ".Piece", function (a) {
    console.log("Piece Click"), UserMove.from == SQUARES.NO_SQ ? UserMove.from = ClickedSquare(a.pageX, a.pageY) : UserMove.to = ClickedSquare(a.pageX, a.pageY), MakeUserMove()
}), $(document).on("click", ".Square", function (a) {
    console.log("Square Click"), UserMove.from != SQUARES.NO_SQ && (UserMove.to = ClickedSquare(a.pageX, a.pageY), MakeUserMove())
});

function MakeUserMove() {
    if (UserMove.from != SQUARES.NO_SQ && UserMove.to != SQUARES.NO_SQ) {
        console.log("User Move:" + PrSq(UserMove.from) + PrSq(UserMove.to));
        var a = ParseMove(UserMove.from, UserMove.to);
        a != NOMOVE && (MakeMove(a), PrintBoard(), MoveGUIPiece(a), CheckAndSet(), PreSearch()), DeSelectSq(UserMove.from), DeSelectSq(UserMove.to), UserMove.from = SQUARES.NO_SQ, UserMove.to = SQUARES.NO_SQ
    }
}

function PieceIsOnSq(a, b, c) {
    return RanksBrd[a] == 7 - Math.round(b / 60) && FilesBrd[a] == Math.round(c / 60) ? BOOL.TRUE : BOOL.FALSE
}

function RemoveGUIPiece(a) {
    $(".Piece").each(function () {
        PieceIsOnSq(a, $(this).position().top, $(this).position().left) == BOOL.TRUE && $(this).remove()
    })
}

function AddGUIPiece(a, b) {
    var c = FilesBrd[a],
        d = RanksBrd[a],
        e = "images/" + SideChar[PieceCol[b]] + PceChar[b].toUpperCase() + ".png";
    $("#Board").append("<image src=\"" + e + "\" class=\"Piece " + ("rank" + (d + 1)) + " " + ("file" + (c + 1)) + "\"/>")
}

function MoveGUIPiece(a) {
    var b = FROMSQ(a),
        c = TOSQ(a);
    if (a & MFLAGEP) {
        var d;
        d = GameBoard.side == COLOURS.BLACK ? c - 10 : c + 10, RemoveGUIPiece(d)
    } else CAPTURED(a) && RemoveGUIPiece(c);
    var e = FilesBrd[c],
        f = RanksBrd[c];
    $(".Piece").each(function () {
        PieceIsOnSq(b, $(this).position().top, $(this).position().left) == BOOL.TRUE && ($(this).removeClass(), $(this).addClass("Piece " + ("rank" + (f + 1)) + " " + ("file" + (e + 1))))
    });
    a & MFLAGCA ? c === SQUARES.G1 ? (RemoveGUIPiece(SQUARES.H1), AddGUIPiece(SQUARES.F1, PIECES.wR)) : c === SQUARES.C1 ? (RemoveGUIPiece(SQUARES.A1), AddGUIPiece(SQUARES.D1, PIECES.wR)) : c === SQUARES.G8 ? (RemoveGUIPiece(SQUARES.H8), AddGUIPiece(SQUARES.F8, PIECES.bR)) : c === SQUARES.C8 ? (RemoveGUIPiece(SQUARES.A8), AddGUIPiece(SQUARES.D8, PIECES.bR)) : void 0 : PROMOTED(a) && (RemoveGUIPiece(c), AddGUIPiece(c, PROMOTED(a)))
}

function DrawMaterial() {
    return 0 != GameBoard.pceNum[PIECES.wP] || 0 != GameBoard.pceNum[PIECES.bP] ? BOOL.FALSE : 0 != GameBoard.pceNum[PIECES.wQ] || 0 != GameBoard.pceNum[PIECES.bQ] || 0 != GameBoard.pceNum[PIECES.wR] || 0 != GameBoard.pceNum[PIECES.bR] ? BOOL.FALSE : 1 < GameBoard.pceNum[PIECES.wB] || 1 < GameBoard.pceNum[PIECES.bB] ? BOOL.FALSE : 1 < GameBoard.pceNum[PIECES.wN] || 1 < GameBoard.pceNum[PIECES.bN] ? BOOL.FALSE : 0 != GameBoard.pceNum[PIECES.wN] && 0 != GameBoard.pceNum[PIECES.wB] ? BOOL.FALSE : 0 != GameBoard.pceNum[PIECES.bN] && 0 != GameBoard.pceNum[PIECES.bB] ? BOOL.FALSE : BOOL.TRUE
}

function ThreeFoldRep() {
    var a = 0,
        b = 0;
    for (a = 0; a < GameBoard.hisPly; ++a) GameBoard.history[a].posKey == GameBoard.posKey && b++;
    return b
}

function CheckResult() {
    if (100 <= GameBoard.fiftyMove) return $("#GameStatus").text("GAME DRAWN {fifty move rule}"), BOOL.TRUE;
    if (2 <= ThreeFoldRep()) return $("#GameStatus").text("GAME DRAWN {3-fold repetition}"), BOOL.TRUE;
    if (DrawMaterial() == BOOL.TRUE) return $("#GameStatus").text("GAME DRAWN {insufficient material to mate}"), BOOL.TRUE;
    GenerateMoves();
    var a = 0,
        b = 0;
    for (a = GameBoard.moveListStart[GameBoard.ply]; a < GameBoard.moveListStart[GameBoard.ply + 1]; ++a)
        if (MakeMove(GameBoard.moveList[a]) != BOOL.FALSE) {
            b++, TakeMove();
            break
        } if (0 != b) return BOOL.FALSE;
    var c = SqAttacked(GameBoard.pList[PCEINDEX(Kings[GameBoard.side], 0)], 1 ^ GameBoard.side);
    return c == BOOL.TRUE ? GameBoard.side == COLOURS.WHITE ? ($("#GameStatus").text("GAME OVER {black mates}"), BOOL.TRUE) : ($("#GameStatus").text("GAME OVER {white mates}"), BOOL.TRUE) : ($("#GameStatus").text("GAME DRAWN {stalemate}"), BOOL.TRUE)
}

function CheckAndSet() {
    CheckResult() == BOOL.TRUE ? GameController.GameOver = BOOL.TRUE : (GameController.GameOver = BOOL.FALSE, $("#GameStatus").text(""))
}

function PreSearch() {
    GameController.GameOver == BOOL.FALSE && (SearchController.thinking = BOOL.TRUE, setTimeout(function () {
        StartSearch()
    }, 200))
}
$("#SearchButton").click(function () {
    GameController.PlayerSide = 1 ^ GameController.side, PreSearch()
});

function StartSearch() {
    SearchController.depth = MAXDEPTH;
    var a = $.now(),
        b = $("#ThinkTimeChoice").val();
    SearchController.time = 1e3 * parseInt(b), SearchPosition(), MakeMove(SearchController.best), MoveGUIPiece(SearchController.best), CheckAndSet()
}
$(function () {
    init(), console.log("©Jansher_Aquib"), NewGame(START_FEN)
});

function InitFilesRanksBrd() {
    var a = 0,
        b = FILES.FILE_A,
        c = RANKS.RANK_1,
        d = SQUARES.A1;
    for (a = 0; a < BRD_SQ_NUM; ++a) FilesBrd[a] = SQUARES.OFFBOARD, RanksBrd[a] = SQUARES.OFFBOARD;
    for (c = RANKS.RANK_1; c <= RANKS.RANK_8; ++c)
        for (b = FILES.FILE_A; b <= FILES.FILE_H; ++b) d = FR2SQ(b, c), FilesBrd[d] = b, RanksBrd[d] = c
}

function InitHashKeys() {
    var a = 0;
    for (a = 0; a < 1680; ++a) PieceKeys[a] = RAND_32();
    for (SideKey = RAND_32(), a = 0; 16 > a; ++a) CastleKeys[a] = RAND_32()
}

function InitSq120To64() {
    var a = 0,
        b = FILES.FILE_A,
        c = RANKS.RANK_1,
        d = SQUARES.A1,
        e = 0;
    for (a = 0; a < BRD_SQ_NUM; ++a) Sq120ToSq64[a] = 65;
    for (a = 0; 64 > a; ++a) Sq64ToSq120[a] = 120;
    for (c = RANKS.RANK_1; c <= RANKS.RANK_8; ++c)
        for (b = FILES.FILE_A; b <= FILES.FILE_H; ++b) d = FR2SQ(b, c), Sq64ToSq120[e] = d, Sq120ToSq64[d] = e, e++
}

function InitBoardVars() {
    var a = 0;
    for (a = 0; a < MAXGAMEMOVES; ++a) GameBoard.history.push({
        move: NOMOVE,
        castlePerm: 0,
        enPas: 0,
        fiftyMove: 0,
        posKey: 0
    });
    for (a = 0; a < PVENTRIES; ++a) GameBoard.PvTable.push({
        move: NOMOVE,
        posKey: 0
    })
}

function InitBoardSquares() {
    var a, b, c, d, e = 0,
        f = 0,
        g = 0,
        h = 0;
    for (g = RANKS.RANK_8; g >= RANKS.RANK_1; g--)
        for (e = 1 ^ f, f ^= 1, a = "rank" + (g + 1), h = FILES.FILE_A; h <= FILES.FILE_H; h++) b = "file" + (h + 1), d = 0 == e ? "Light" : "Dark", c = "<div class=\"Square " + a + " " + b + " " + d + "\"/>", e ^= 1, $("#Board").append(c)
}

function InitBoardSquares() {
    var a, b, c, d, e, f, g = 1;
    for (d = RANKS.RANK_8; d >= RANKS.RANK_1; d--)
        for (g ^= 1, a = "rank" + (d + 1), e = FILES.FILE_A; e <= FILES.FILE_H; e++) b = "file" + (e + 1), f = 0 == g ? "Light" : "Dark", g ^= 1, c = "<div class=\"Square " + a + " " + b + " " + f + "\"/>", $("#Board").append(c)
}

function init() {
    console.log("גם זה יעבור"), InitFilesRanksBrd(), InitHashKeys(), InitSq120To64(), InitBoardVars(), InitMvvLva(), InitBoardSquares()
}