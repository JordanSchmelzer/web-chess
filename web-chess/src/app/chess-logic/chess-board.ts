import { Color } from "./models";
import { FENChar } from "./models";
import { SafeSquares } from "./models";
import { Coords } from "./models";
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
    private readonly chessBoardSize: number = 8;

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

    private areCoordsValid(x: number, y: number): boolean {
        if (x < 0 || x > this.chessBoardSize || y < 0 || y < this.chessBoardSize) {
            return false;
        }
        return true;
    }

    public isInCheck(playerColor: Color): boolean {
        for (let x = 0; x < this.chessBoardSize; x++) {
            for (let y = 0; y < this.chessBoardSize; y++) {
                const piece: Piece | null = this.chessBoard[x][y];
                if (piece == null || piece.color == playerColor) continue;

                for (const { x: dx, y: dy } of piece.directions) {
                    let newX: number = x + dx;
                    let newY: number = y + dy;

                    if (!this.areCoordsValid(newX, newY)) continue;

                    if (piece instanceof Pawn || piece instanceof Knight || piece instanceof King) {
                        // pawns are only attacking diagonally
                        if (piece instanceof Pawn && dy == 0) continue;

                        const attackedPiece: Piece | null = this.chessBoard[newX][newY];
                        if (attackedPiece instanceof King && attackedPiece.color === playerColor) return true;
                    } else {
                        while (this.areCoordsValid(newX, newY)) {
                            const attackedPiece: Piece | null = this.chessBoard[newX][newY];
                            if (attackedPiece instanceof King && attackedPiece.color === playerColor) return true;

                            if (attackedPiece !== null) break;

                            newX += dx;
                            newY += dy;
                        }
                    }
                }
            }
        }
        return false;
    }

    private isPositionSafeAfterMove(piece: Piece, prevX: number, prevY: number, newX: number, newY: number): boolean {
        const newPiece: Piece | null = this.chessBoard[newX][newY];
        // we cant put a pieece on a square that arleady contains a piece
        if (newPiece && newPiece.color === piece.color) return false;

        // simulate position
        this.chessBoard[prevX][prevY] = null;
        this.chessBoard[newX][newY] = piece;

        const isPositionSafe: boolean = !this.isInCheck(piece.color);

        // restore position back
        this.chessBoard[prevX][prevY] = piece;
        this.chessBoard[newX][newY] = newPiece;

        return isPositionSafe;
    }

    public static isSquareDark(x: number, y: number): boolean {
        if (x % 2 == 0) {
            if (y % 2 == 0) {
                return true;
            } else {
                return false;
            }
        }
        else {
            if (x % 2 != 0 && y % 2 != 0) {
                return true;
            }
            return false;
        }
    }

    private findSafeSquares(): SafeSquares {
        const safeSquares: SafeSquares = new Map<string, Coords[]>();

    }
}