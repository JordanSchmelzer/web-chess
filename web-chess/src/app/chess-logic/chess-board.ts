import { Color, FENChar, SafeSquares, Coords } from "./models";
import { Piece } from "./pieces/piece";
import { Rook } from "./pieces/rook";
import { Pawn } from "./pieces/pawn";
import { King } from "./pieces/king";
import { Queen } from "./pieces/queen";
import { Bishop } from "./pieces/bishop";
import { Knight } from "./pieces/knight";

export class ChessBoard {
    private chessBoard: (Piece | null)[][];
    private _playerColor: Color;
    private readonly chessBoardSize: number = 8;
    private _safeSquares: SafeSquares;

    constructor() {
        this.chessBoard = this.initializeChessBoard();
        this._playerColor = Color.White;
        this._safeSquares = this.findSafeSquares();
    }

    public get safeSquares(): SafeSquares {
        return this._safeSquares;
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

    private areCoordsValid(x: number, y: number): boolean {
        return x >= 0 && y >= 0 && x < this.chessBoardSize && y < this.chessBoardSize;
    }

    public isInCheck(playerColor: Color): boolean {
        for (let x = 0; x < this.chessBoardSize; x++) {
            for (let y = 0; y < this.chessBoardSize; y++) {
                const piece: Piece | null = this.chessBoard[x][y];
                // empty square or current players piece, skip, cannot attack own king
                if (piece == null || piece.color == playerColor) continue;

                // enemy piece is found
                // loop thorugh moves until out of bounds
                for (const { x: dx, y: dy } of piece.directions) {
                    let newX: number = x + dx;
                    let newY: number = y + dy;

                    if (!this.areCoordsValid(newX, newY)) continue;

                    if (piece instanceof Pawn || piece instanceof Knight || piece instanceof King) {
                        // pawns are only attacking diagonally
                        if (piece instanceof Pawn && dy == 0) continue;

                        // this is the square targeted by enemy player's piece
                        const attackedPiece: Piece | null = this.chessBoard[newX][newY];
                        // if the attacked piece is the current players king, they are in check!
                        if (attackedPiece instanceof King && attackedPiece.color === playerColor) return true;
                    } else {
                        // if piece is rook, bishop or queen
                        // if the coords are valid, we need to loop since these pieces slide around
                        while (this.areCoordsValid(newX, newY)) {
                            const attackedPiece: Piece | null = this.chessBoard[newX][newY];
                            if (attackedPiece instanceof King && attackedPiece.color === playerColor) return true;

                            // if the attacked piece isn't a king, stop sliding along this direction
                            if (attackedPiece !== null) break;

                            // if piece hasnt hit anything, keep sliding
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

    private findSafeSquares(): SafeSquares {
        const safeSquares: SafeSquares = new Map<string, Coords[]>();

        // traverse through the board to find safe square
        for (let x = 0; x < this.chessBoardSize; x++) {
            for (let y = 0; y < this.chessBoardSize; y++) {
                const piece: Piece | null = this.chessBoard[x][y];
                if (!piece || piece.color !== this._playerColor) { continue; }

                const pieceSafeSquares: Coords[] = [];

                // for each direction of this players pieces, where can that piece move?
                for (const { x: dx, y: dy } of piece.directions) {
                    let newX: number = x + dx;
                    let newY: number = y + dy;

                    if (!this.areCoordsValid(newX, newY)) { continue; }

                    //  where we are going to move
                    let newPiece: Piece | null = this.chessBoard[newX][newY];
                    // cannot put piece on my own piece
                    if (newPiece && newPiece.color === piece.color) continue;

                    // need to restrict pawn movement in certain directions
                    if (piece instanceof Pawn) {
                        // cant move pawn two squares straight if there is a piece in front of it
                        if (dx === 2 || dx === -2) {
                            if (newPiece) continue;
                            if (this.chessBoard[newX + (dx === 2 ? -1 : 1)][newY]) continue;
                        }

                        // cant move pawn one square forward if piece is infront
                        if ((dx === 1 || dx === -1) && dy === 0 && newPiece) continue;

                        // cant move pawn diagonally if there is no piece or piece has same color;
                        if ((dy === 1 || dy === -1) && (!newPiece || piece.color === newPiece.color)) continue;
                    }

                    if (piece instanceof Pawn || piece instanceof Knight || piece instanceof King) {
                        if (this.isPositionSafeAfterMove(piece, x, y, newX, newY)) {
                            pieceSafeSquares.push({ x: newX, y: newY });
                        }
                    } else {
                        // bishops rooks queens slide, so look all pieces
                        while (this.areCoordsValid(newX, newY)) {
                            newPiece = this.chessBoard[newX][newY];
                            if (newPiece && newPiece.color === piece.color) break;

                            if (this.isPositionSafeAfterMove(piece, x, y, newX, newY))
                                pieceSafeSquares.push({ x: newX, y: newY });

                            if (newPiece !== null) break;

                            newX += dx;
                            newY += dy;
                        }
                    }
                }
                if (pieceSafeSquares.length)
                    safeSquares.set(x + "," + y, pieceSafeSquares);
            }
        }
        console.info(`found ${safeSquares.size} safe squares`);
        return safeSquares;
    }

    private initializeChessBoard(): (Piece | null)[][] {
        return [
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

    public move(prevX: number, prevY: number, newX: number, newY: number): void {
        if (!this.areCoordsValid(prevX, prevY) || !this.areCoordsValid(prevX, prevY)) return;
        const piece: Piece | null = this.chessBoard[prevX][prevY];
        if (!piece || piece.color !== this._playerColor) return;

        const pieceSafeSquare: Coords[] | undefined = this._safeSquares.get(prevX + "," + prevY);
        if (!pieceSafeSquare || !pieceSafeSquare.find(coords => coords.x === newX && coords.y === newY))
            throw new Error("Square is not safe");

        if ((piece instanceof Pawn || piece instanceof Rook || piece instanceof King) && !piece.hasMoved)
            piece.hasMoved = true;

        // update the board;
        this.chessBoard[prevX][prevY] = null;
        this.chessBoard[newX][newY] = piece;

        // switch players;
        this._playerColor = this._playerColor === Color.White ? Color.Black : Color.White;
        this._safeSquares = this.findSafeSquares();
    }
}