export enum Color {
    White,
    Black
}

export type Coords = {
    x: number;
    y: number;
}

export enum FENChar {
    WhitePawn = "P",
    WhiteKnight = "N",
    WhiteBishop = "B",
    WhiteRook = "R",
    WhiteQueen = "Q",
    WhiteKing = "K",
    BlackPawn = "p",
    BlackKnight = "n",
    BlackBishop = "b",
    BlackRook = "r",
    BlackQueen = "q",
    BlackKing = "k"
}
// web-chess\src\app\assets\pieces\blackbishop.png
export const pieceImagePaths: Readonly<Record<FENChar, string>> = {
    [FENChar.WhitePawn]: "./pieces/whitepawn.png",
    [FENChar.WhiteBishop]: "./pieces/whitebishop.png",
    [FENChar.WhiteKnight]: "./pieces/whiteknight.png",
    [FENChar.WhiteKing]: "./pieces/whiteking.png",
    [FENChar.WhiteQueen]: "./pieces/whitequeen.png",
    [FENChar.WhiteRook]: "./pieces/whiterook.png",
    [FENChar.BlackPawn]: "./pieces/blackpawn.png",
    [FENChar.BlackBishop]: "./pieces/blackbishop.png",
    [FENChar.BlackKnight]: "./pieces/blackknight.png",
    [FENChar.BlackKing]: "./pieces/blackking.png",
    [FENChar.BlackQueen]: "./pieces/blackqueen.png",
    [FENChar.BlackRook]: "./pieces/blackrook.png"
}

export type SafeSquares = Map<string, Coords[]>;