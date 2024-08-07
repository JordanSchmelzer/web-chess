import { Piece } from "./piece";
import { FENChar, Coords, Color } from "../models";

export class King extends Piece {
    private _hasMoved: boolean = false;
    protected override _FENChar: FENChar;
    protected override _directions: Coords[] = [
        { x: 0, y: 1 },
        { x: 0, y: -1 },
        { x: 1, y: 0 },
        { x: 1, y: -1 },
        { x: 1, y: 1 },
        { x: -1, y: 0 },
        { x: -1, y: 1 },
        { x: -1, y: -1 }
    ]

    constructor(private pieceColor: Color) {
        super(pieceColor);
        if (pieceColor == Color.White) {
            this._FENChar = FENChar.WhiteKing;
        } else {
            this._FENChar = FENChar.BlackKing;
        }
    }

    get hasMoved(): boolean {
        return this._hasMoved;
    }

    set hasMoved(_) {
        this._hasMoved = true;
    }
}