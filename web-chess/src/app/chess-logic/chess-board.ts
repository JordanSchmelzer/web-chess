import { Color } from "./models";
import { FENChar } from "./models";
import { Piece } from "./pieces/piece";
import { Rook } from "./pieces/rook";
import { Pawn } from "./pieces/pawn";
import { King } from "./pieces/king";
import { Queen } from "./pieces/queen";
import { Bishop } from "./pieces/bishop";
import { Knight } from "./pieces/knight";

export class ChessBoard {
    private chessBoard: (Piece | null)[][];
    private _playerColor = Color.White;

    constructor() {
        this.chessBoard = [
            [
                new Rook(Color.White), new Knight(Color.White), new Bishop(Color.White), new Queen(Color.White),
                new King(Color.White), new Bishop(Color.White), new Knight(Color.White), new Rook(Color.White)
            ],
            [
                new Pawn(Color.White), new Pawn(Color.White), new Pawn(Color.White), new Pawn(Color.White),
                new Pawn(Color.White), new Pawn(Color.White), new Pawn(Color.White), new Pawn(Color.White)
            ],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [
                new Pawn(Color.Black), new Pawn(Color.Black), new Pawn(Color.Black), new Pawn(Color.Black),
                new Pawn(Color.Black), new Pawn(Color.Black), new Pawn(Color.Black), new Pawn(Color.Black)
            ],
            [
                new Rook(Color.Black), new Knight(Color.Black), new Bishop(Color.Black), new Queen(Color.Black),
                new King(Color.Black), new Bishop(Color.Black), new Knight(Color.Black), new Rook(Color.Black)
            ]
        ]
    }

    public get playerColor(): Color {
        return this._playerColor;
    }

    // an array of arrays, map loops through top level of array which is rows
    // rows has another map where it looks through each square position
    // maps return each element in the array and we do some logic to transform it
    // for each row, look at each piece and convert it to FENChar or null
    public get ChessBoardView(): (FENChar | null)[][] {
        return this.chessBoard.map(row => {
            return row.map(piece => piece instanceof Piece ? piece.FENChar : null);
        })
    }
}