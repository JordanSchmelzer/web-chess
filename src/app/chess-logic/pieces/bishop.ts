import { Piece } from "./piece";
import { FENChar, Coords, Color } from "../models";

export class Bishop extends Piece {
    protected override _FENChar: FENChar;
    protected override _directions: Coords[] = [
        { x: 1, y: 1 },
        { x: 1, y: -1 },
        { x: -1, y: -1 },
        { x: -1, y: 1 }
    ]

    constructor(private pieceColor: Color) {
        super(pieceColor);
        if (pieceColor == Color.White) {
            this._FENChar = FENChar.WhiteBishop;
        } else {
            this._FENChar = FENChar.BlackBishop;
        }
    }
}