import { columns, LastMove } from "./models";
import { Piece } from "./pieces/piece";
import { Color } from "./models";
import { King } from "./pieces/king";
import { Rook } from "./pieces/rook";
import { Pawn } from "./pieces/pawn";

export class FENConverter {
    public static readonly initalPosition: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    public convertBoardToFen(
        board: (Piece | null)[][],
        playerColor: Color,
        lastMove: LastMove | undefined,
        fiftyMoveRuleCounter: number,
        numberOfFullMoves: number
    ): string {
        let FEN: string = "";

        for (let i = 7; i >= 0; i--) {
            let FENRow: string = "";
            let consecutiveEmptySquareCounter = 0;

            for (const piece of board[i]) {
                if (!piece) {
                    consecutiveEmptySquareCounter++;
                    continue;
                }

                if (consecutiveEmptySquareCounter !== 0) {
                    FENRow += String(consecutiveEmptySquareCounter);
                }

                consecutiveEmptySquareCounter = 0;
                FENRow += piece.FENChar;
            }

            if (consecutiveEmptySquareCounter !== 0)
                FENRow += String(consecutiveEmptySquareCounter);

            FEN += (i === 0) ? FENRow : FENRow + "/";
        }

        const player: string = playerColor === Color.White ? "w" : "b";
        FEN += " " + player;
        FEN += " " + this.castlingAvailablility(board);
        FEN += " " + this.enPassantPossibility(lastMove, playerColor);
        FEN += " " + fiftyMoveRuleCounter * 2;
        FEN += " " + numberOfFullMoves;
        return FEN;
    }

    private castlingAvailablility(board: (Piece | null)[][]): string {
        const castlingPossibilities = (color: Color): string => {
            let castlingAvailablity: string = "";

            const kingPositionX: number = color === Color.White ? 0 : 7;
            const king: Piece | null = board[kingPositionX][4]

            if (king instanceof King && !king.hasMoved) {
                const rookPositionX: number = kingPositionX;
                const kingSideRook = board[rookPositionX][7];
                const queenSideRook = board[rookPositionX][0];

                if (kingSideRook instanceof Rook && !kingSideRook.hasMoved)
                    castlingAvailablity += "k";

                if (queenSideRook instanceof Rook && !queenSideRook.hasMoved)
                    castlingAvailablity += "q";

                if (kingSideRook instanceof Rook && !kingSideRook.hasMoved)
                    castlingAvailablity = castlingAvailablity.toUpperCase();
            }
            return castlingAvailablity;
        }

        const castlingAvailablility: string = castlingPossibilities(Color.White) + castlingPossibilities(Color.Black);
        return castlingAvailablility !== "" ? castlingAvailablility : "-";
    }

    private enPassantPossibility(lastMove: LastMove | undefined, color: Color): string {
        if (!lastMove) return "-";
        const { piece, currX: newX, prevX, prevY } = lastMove;

        if (piece instanceof Pawn && Math.abs(newX - prevX) === 2) {
            const row: number = color === Color.White ? 6 : 3;
            return columns[prevY] + String(row);
        }
        return "-";
    }
}