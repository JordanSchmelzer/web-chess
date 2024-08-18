import { Color, FENChar, SafeSquares, Coords, LastMove, CheckState, MoveType, MoveList, GameHistory, columns } from "./models";
import { Piece } from "./pieces/piece";
import { Rook } from "./pieces/rook";
import { Pawn } from "./pieces/pawn";
import { King } from "./pieces/king";
import { Queen } from "./pieces/queen";
import { Bishop } from "./pieces/bishop";
import { Knight } from "./pieces/knight";
import { FENConverter } from "./FENConverter";

export class ChessBoard {
    private chessBoard: (Piece | null)[][];
    private _playerColor: Color;
    private readonly chessBoardSize: number = 8;
    private _safeSquares: SafeSquares;
    private _lastMove: LastMove | undefined;
    private _checkedState: CheckState = { isInCheck: false }
    private fiftyMoveRuleCounter: number = 0;

    private _isGameOver: boolean = false;
    private _gameOverMessage: string | undefined;

    private fullNumberOfMoves: number = 1;
    private threeFoldRepititionDictionary = new Map<string, number>();
    private threeFoldRepetitionFlag: boolean = false;

    private _boardAsFEN: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    private FENConverter = new FENConverter();

    private _moveList: MoveList = [];
    private _gameHistory: GameHistory;

    constructor() {
        this.chessBoard = this.initializeChessBoard();
        this._playerColor = Color.White;
        this._safeSquares = this.findSafeSquares();
        this._gameHistory = [{ board: this.ChessBoardView, lastMove: this._lastMove, checkState: this._checkedState }];
    }

    public get whitePoints(): number {
        return 1;
    }

    public get blackPoints(): number {
        return 1;
    }

    public get whitePiecesRemaining(): number {
        let whitePiecesCount = 0;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                let boardPositionColor = this.chessBoard[row][col]?.color;
                if (boardPositionColor != undefined)
                    if (boardPositionColor == Color.White)
                        whitePiecesCount++;
            }
        }
        return whitePiecesCount;
    }

    public get blackPiecesRemaining(): number {
        let blackPiecesCount = 0;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                let boardPositionColor = this.chessBoard[row][col]?.color;
                if (boardPositionColor != undefined)
                    if (boardPositionColor == Color.Black)
                        blackPiecesCount++;
            }
        }
        return blackPiecesCount;
    }

    public get checkedState(): CheckState {
        return this._checkedState;
    }

    public get isGameOver(): boolean {
        return this._isGameOver;
    }

    public get moveList(): MoveList {
        return this._moveList;
    }

    public get gameHistory(): GameHistory {
        return this._gameHistory;
    }

    public get gameOverMesage(): string | undefined {
        return this._gameOverMessage;
    }

    public get lastMove(): LastMove | undefined {
        return this._lastMove;
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

    public get boardAsFEN(): string {
        return this._boardAsFEN;
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

    public isInCheck(playerColor: Color, checkingCurrentPosition: boolean): boolean {
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
                        if (attackedPiece instanceof King && attackedPiece.color === playerColor) {
                            if (checkingCurrentPosition) this._checkedState = { isInCheck: true, x: newX, y: newY }
                            return true;
                        }
                    } else {
                        // if piece is rook, bishop or queen
                        // if the coords are valid, we need to loop since these pieces slide around
                        while (this.areCoordsValid(newX, newY)) {
                            const attackedPiece: Piece | null = this.chessBoard[newX][newY];
                            if (attackedPiece instanceof King && attackedPiece.color === playerColor) {
                                if (checkingCurrentPosition) this._checkedState = { isInCheck: true, x: newX, y: newY }
                                return true;
                            }

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
        if (checkingCurrentPosition) this._checkedState = { isInCheck: false }
        return false;
    }

    private isPositionSafeAfterMove(prevX: number, prevY: number, newX: number, newY: number): boolean {
        const piece: Piece | null = this.chessBoard[prevX][prevY];
        if (!piece) return false;
        const newPiece: Piece | null = this.chessBoard[newX][newY];
        // we cant put a pieece on a square that arleady contains a piece
        if (newPiece && newPiece.color === piece.color) return false;

        // simulate position
        this.chessBoard[prevX][prevY] = null;
        this.chessBoard[newX][newY] = piece;

        const isPositionSafe: boolean = !this.isInCheck(piece.color, false);

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
                        if (this.isPositionSafeAfterMove(x, y, newX, newY)) {
                            pieceSafeSquares.push({ x: newX, y: newY });
                        }
                    } else {
                        // bishops rooks queens slide, so look all pieces
                        while (this.areCoordsValid(newX, newY)) {
                            newPiece = this.chessBoard[newX][newY];
                            if (newPiece && newPiece.color === piece.color) break;

                            if (this.isPositionSafeAfterMove(x, y, newX, newY))
                                pieceSafeSquares.push({ x: newX, y: newY });

                            if (newPiece !== null) break;

                            newX += dx;
                            newY += dy;
                        }
                    }

                    if (piece instanceof King) {
                        if (this.canCastle(piece, true))
                            pieceSafeSquares.push({ x, y: 6 });

                        if (this.canCastle(piece, false))
                            pieceSafeSquares.push({ x, y: 2 });
                    }
                    else if (piece instanceof Pawn && this.canCaptureEnPassant(piece, x, y)) {
                        pieceSafeSquares.push({ x: x + (piece.color === Color.White ? 1 : -1), y: this._lastMove!.prevY })

                    }

                }

                if (pieceSafeSquares.length)
                    safeSquares.set(x + "," + y, pieceSafeSquares);

            }
        }
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

    private canCaptureEnPassant(pawn: Pawn, pawnX: number, pawnY: number): boolean {
        if (!this._lastMove) return false;
        const { piece, prevX, prevY, currX, currY } = this._lastMove;

        if (
            !(piece instanceof Pawn) ||
            pawn.color !== this._playerColor ||
            Math.abs(currX - prevX) !== 2 ||
            pawnX !== currX ||
            Math.abs(pawnY - currY) !== 1
        ) {
            return false;
        }

        const pawnNewPositionX: number = pawnX + (pawn.color === Color.White ? 1 : -1);
        const pawnNewPositionY: number = currY;

        this.chessBoard[currX][currY] = null;
        const isPositionSafe: boolean = this.isPositionSafeAfterMove(pawnX, pawnY, pawnNewPositionX, pawnNewPositionY);
        this.chessBoard[currX][currY] = piece;

        return isPositionSafe;
    }

    private canCastle(king: King, kingSideCastle: boolean): boolean {
        if (king.hasMoved) return false;

        const kingPositionX: number = king.color === Color.White ? 0 : 7;
        const kingPositionY: number = 4;
        const rookPositionX: number = kingPositionX;
        const rookPositionY: number = kingSideCastle ? 7 : 0;
        const rook: Piece | null = this.chessBoard[rookPositionX][rookPositionY];

        if (!(rook instanceof Rook) || rook.hasMoved || this._checkedState.isInCheck) return false;

        const firstSquareNextToKingY = kingSideCastle ? -1 : 1;
        const secondSquareNextToKingY = kingSideCastle ? -2 : 2;

        // if the square immediatly to the side has a piece, return false
        if (this.chessBoard[kingPositionX][kingPositionY - firstSquareNextToKingY]) return false;
        // if the second square immediatly to the side has a piece, return false
        if (this.chessBoard[kingPositionX][kingPositionY - secondSquareNextToKingY]) return false;

        // if queenside, is the 3rd square furhtest from King empty?
        if (!kingSideCastle && this.chessBoard[kingPositionX][1]) return false;

        return this.isPositionSafeAfterMove(kingPositionX, kingPositionY, kingPositionX, firstSquareNextToKingY) &&
            this.isPositionSafeAfterMove(kingPositionX, kingPositionY, kingPositionX, secondSquareNextToKingY);
    }

    public move(prevX: number, prevY: number, newX: number, newY: number, promotedPieceType: FENChar | null): void {
        if (this._isGameOver) throw new Error("Game is over, you cant play move");
        if (!this.areCoordsValid(prevX, prevY) || !this.areCoordsValid(prevX, prevY)) return;
        const piece: Piece | null = this.chessBoard[prevX][prevY];
        if (!piece || piece.color !== this._playerColor) return;

        const pieceSafeSquare: Coords[] | undefined = this._safeSquares.get(prevX + "," + prevY);
        if (!pieceSafeSquare || !pieceSafeSquare.find(coords => coords.x === newX && coords.y === newY))
            throw new Error("Square is not safe");

        if ((piece instanceof Pawn || piece instanceof Rook || piece instanceof King) && !piece.hasMoved)
            piece.hasMoved = true;


        const moveType = new Set<MoveType>();


        const isPieceTaken: boolean = this.chessBoard[newX][newY] !== null;
        if (isPieceTaken) moveType.add(MoveType.Capture);
        if (piece instanceof Pawn || isPieceTaken) this.fiftyMoveRuleCounter = 0;
        else this.fiftyMoveRuleCounter += 0.5;

        this.handlingSpecialMoves(piece, prevX, prevY, newX, newY, moveType);
        // update the board;
        if (promotedPieceType) {
            this.chessBoard[newX][newY] = this.promotedPiece(promotedPieceType);
            moveType.add(MoveType.Promotion);
        } else {
            this.chessBoard[newX][newY] = piece;
        }

        this.chessBoard[prevX][prevY] = null;

        // switch players;
        this._playerColor = this._playerColor === Color.White ? Color.Black : Color.White;
        this.isInCheck(this._playerColor, true);


        this._lastMove = { prevX, prevY: prevY, currX: newX, currY: newY, piece: piece, moveType };
        this._safeSquares = this.findSafeSquares();

        if (this._checkedState.isInCheck)
            moveType.add(!this._safeSquares.size ? MoveType.CheckMate : MoveType.Check);
        else if (!moveType.size)
            moveType.add(MoveType.BasicMove);

        this.storeMove(promotedPieceType);
        this.updateGameHistory();

        if (this._playerColor === Color.White) this.fullNumberOfMoves++;
        this._boardAsFEN = this.FENConverter.convertBoardToFen(this.chessBoard, this._playerColor, this._lastMove, this.fiftyMoveRuleCounter, this.fullNumberOfMoves);
        this.updateThreeFoldRepititionDictionary(this._boardAsFEN);

        this._isGameOver = this.isGameFinished();
    }

    private handlingSpecialMoves(piece: Piece, prevX: number, prevY: number, newX: number, newY: number, moveType: Set<MoveType>): void {
        if (piece instanceof King && Math.abs(newY - prevY) === 2) {
            // newY > prevY === king side castle

            const rookPositionX: number = prevX;
            const rookPositionY: number = newY > prevY ? 7 : 0;
            const rook = this.chessBoard[rookPositionX][rookPositionY] as Rook;
            const rookNewPositionY: number = newY > prevY ? 5 : 3;
            this.chessBoard[rookPositionX][rookPositionY] = null;
            this.chessBoard[rookPositionX][rookNewPositionY] = rook;
            rook.hasMoved = true;
            moveType.add(MoveType.Castling);
        } else if (
            piece instanceof Pawn &&
            this._lastMove &&
            this._lastMove.piece instanceof Pawn &&
            Math.abs(this._lastMove.currX - this._lastMove.prevX) == 2 &&
            prevX === this._lastMove.currX &&
            newY === this._lastMove.currY
        ) {
            this.chessBoard[this._lastMove.currX][this._lastMove.currY] = null;
            moveType.add(MoveType.Capture);
        }
    }

    private promotedPiece(promotedPieceType: FENChar): Knight | Bishop | Rook | Queen {
        if (promotedPieceType === FENChar.WhiteKnight || promotedPieceType === FENChar.BlackKnight) {
            return new Knight(this._playerColor);
        }


        if (promotedPieceType === FENChar.WhiteBishop || promotedPieceType === FENChar.BlackBishop) {
            return new Bishop(this._playerColor);
        }

        if (promotedPieceType === FENChar.WhiteRook || promotedPieceType === FENChar.BlackRook) {
            return new Rook(this._playerColor);
        }

        return new Queen(this._playerColor);
    }

    private isGameFinished(): boolean {
        if (this.insufficientMaterial()) {
            this._gameOverMessage = "Draw due insufficent material position";
            return true;
        }

        if (!this._safeSquares.size) {
            if (this._checkedState.isInCheck) {
                const prevPlayer: string = this._playerColor === Color.White ? "Black" : "White";
                this._gameOverMessage = prevPlayer + " won by checkmate";
            }
            else this._gameOverMessage = "Stalemate";

            return true;
        }

        if (this.threeFoldRepetitionFlag) {
            this._gameOverMessage = "Draw due to three fold repitition rule";
            return true;
        }

        if (this.fiftyMoveRuleCounter === 50) {
            this._gameOverMessage = "Draw due to fifty move rule";
            return true;
        }

        return false;
    }

    private playerHasOnlyTwoKnightsAndKing(pieces: { piece: Piece, x: number, y: number }[]): boolean {
        return pieces.filter(piece => piece.piece instanceof Knight).length === 2;
    }

    private playerHasOnlyBishopsWithSameColorAndKing(pieces: { piece: Piece, x: number, y: number }[]): boolean {
        const bishops = pieces.filter(piece => piece.piece instanceof Bishop);
        const areAllBishopsOfSameColor = new Set(bishops.map(bishop => ChessBoard.isSquareDark(bishop.x, bishop.y))).size === 1;
        return bishops.length === pieces.length - 1 && areAllBishopsOfSameColor;
    }

    private insufficientMaterial(): boolean {
        const whitePieces: { piece: Piece, x: number, y: number }[] = [];
        const blackPieces: { piece: Piece, x: number, y: number }[] = [];

        for (let x = 0; x < this.chessBoardSize; x++) {
            for (let y = 0; y < this.chessBoardSize; y++) {
                const piece: Piece | null = this.chessBoard[x][y];
                if (!piece) continue;

                if (piece.color === Color.White) whitePieces.push({ piece, x, y });
                else blackPieces.push({ piece, x, y });
            }
        }

        // King vs King
        if (whitePieces.length === 1 && blackPieces.length === 1)
            return true;

        // King and Minor Piece vs King
        if (whitePieces.length === 1 && blackPieces.length === 2)
            return blackPieces.some(piece => piece.piece instanceof Knight || piece.piece instanceof Bishop);

        else if (whitePieces.length === 2 && blackPieces.length === 1)
            return whitePieces.some(piece => piece.piece instanceof Knight || piece.piece instanceof Bishop);

        // both sides have bishop of same color
        else if (whitePieces.length === 2 && blackPieces.length === 2) {
            const whiteBishop = whitePieces.find(piece => piece.piece instanceof Bishop);
            const blackBishop = blackPieces.find(piece => piece.piece instanceof Bishop);

            if (whiteBishop && blackBishop) {
                const areBishopsOfSameColor: boolean = ChessBoard.isSquareDark(whiteBishop.x, whiteBishop.y) && ChessBoard.isSquareDark(blackBishop.x, blackBishop.y) || !ChessBoard.isSquareDark(whiteBishop.x, whiteBishop.y) && !ChessBoard.isSquareDark(blackBishop.x, blackBishop.y);

                return areBishopsOfSameColor;
            }
        }

        if (whitePieces.length === 3 && blackPieces.length === 1 && this.playerHasOnlyTwoKnightsAndKing(whitePieces) ||
            whitePieces.length === 1 && blackPieces.length === 3 && this.playerHasOnlyTwoKnightsAndKing(blackPieces)
        ) return true;

        if (whitePieces.length >= 3 && blackPieces.length === 1 && this.playerHasOnlyBishopsWithSameColorAndKing(whitePieces) ||
            whitePieces.length === 1 && blackPieces.length >= 3 && this.playerHasOnlyBishopsWithSameColorAndKing(blackPieces)
        ) return true;

        return false;
    }

    private updateThreeFoldRepititionDictionary(FEN: string): void {
        const threeFoldRepetitionFENKey: string = FEN.split(" ").slice(0, 4).join("");
        const threeFoldRepetitionValue: number | undefined = this.threeFoldRepititionDictionary.get(threeFoldRepetitionFENKey);

        if (threeFoldRepetitionValue === undefined)
            this.threeFoldRepititionDictionary.set(threeFoldRepetitionFENKey, 1);
        else {
            if (threeFoldRepetitionValue === 2) {
                this.threeFoldRepetitionFlag = true;
                return;
            }
            this.threeFoldRepititionDictionary.set(threeFoldRepetitionFENKey, 2);
        }
    }

    private storeMove(promotedPiece: FENChar | null): void {
        const { piece, currX, currY, prevX, prevY, moveType } = this._lastMove!;
        let pieceName: string = !(piece instanceof Pawn) ? piece.FENChar.toUpperCase() : "";
        let move: string;

        if (moveType.has(MoveType.Castling))
            move = currY - prevY === 2 ? "O-O" : "O-O-O";
        else {
            move = pieceName + this.startingPieceCoordsNotation();
            if (moveType.has(MoveType.Capture))
                move += (piece instanceof Pawn) ? columns[prevY] + "x" : "x";
            move += columns[currY] + String(currX + 1);

            if (promotedPiece)
                move += "=" + promotedPiece.toUpperCase();
        }

        if (moveType.has(MoveType.Check)) move += "+";
        else if (moveType.has(MoveType.CheckMate)) move += "#";

        if (!this._moveList[this.fullNumberOfMoves - 1])
            this._moveList[this.fullNumberOfMoves - 1] = [move];
        else
            this._moveList[this.fullNumberOfMoves - 1].push(move);
    }

    private startingPieceCoordsNotation(): string {
        const { piece: currPiece, prevX, prevY, currX, currY } = this._lastMove!;
        if (currPiece instanceof Pawn || currPiece instanceof King) return "";

        const samePiecesCoords: Coords[] = [{ x: prevX, y: prevY }];

        for (let x = 0; x < this.chessBoardSize; x++) {
            for (let y = 0; y < this.chessBoardSize; y++) {
                const piece: Piece | null = this.chessBoard[x][y];
                if (!piece || (currX === x && currY === y)) continue;

                if (piece.FENChar === currPiece.FENChar) {
                    const safeSquares: Coords[] = this._safeSquares.get(x + "," + y) || [];
                    const pieceHasSameTargetSquare: boolean = safeSquares.some(coords => coords.x === currX && coords.y === currY);
                    if (pieceHasSameTargetSquare) samePiecesCoords.push({ x, y });
                }
            }
        }

        if (samePiecesCoords.length === 1) return "";

        const piecesFile = new Set(samePiecesCoords.map(coords => coords.y));
        const piecesRank = new Set(samePiecesCoords.map(coords => coords.x));

        // means that all of the pieces are on different files (a, b, c, ...)
        if (piecesFile.size === samePiecesCoords.length)
            return columns[prevY];

        // means that all of the pieces are on different rank (1, 2, 3, ...)
        if (piecesRank.size === samePiecesCoords.length)
            return String(prevX + 1);

        // in case that there are pieces that shares both rank and a file with multiple or one piece
        return columns[prevY] + String(prevX + 1);
    }

    private updateGameHistory(): void {
        this._gameHistory.push({
            board: [...this.ChessBoardView.map(row => [...row])],
            checkState: { ...this._checkedState },
            lastMove: this._lastMove ? { ...this._lastMove } : undefined
        });
    }
}
