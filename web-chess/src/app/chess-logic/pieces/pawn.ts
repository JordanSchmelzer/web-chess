import { Piece } from "./piece";
import { FENChar, Coords, Color } from "../models";

export class Pawn extends Piece {
    private _hasMoved: boolean = false;
    protected override _FENChar: FENChar;
    protected override _directions: Coords[] = [
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: -1 }
    ]

    constructor(private pieceColor: Color) {
        super(pieceColor);
        if (pieceColor == Color.White) {
            this._FENChar = FENChar.WhitePawn;
        } else {
            this._FENChar = FENChar.BlackPawn;
        }
        if (pieceColor == Color.Black) {
            this.setBlackPawnDirections()
        };
    }

    get hasMoved(): boolean {
        return this._hasMoved;
    }

    set hasMoved(_) {
        this._hasMoved = true;
        this._directions = [
            { x: 1, y: 0 },
            { x: 1, y: 1 },
            { x: 1, y: -1 }
        ]
        if (this.pieceColor == Color.Black)
    }

    private setBlackPawnDirections(): void {
        this._directions = this._directions.map(({ x, y }) => ({ x: -1 * x, y }))
    }

}