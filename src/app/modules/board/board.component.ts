import { Component } from '@angular/core';
import { ChessBoard } from '../../chess-logic/chess-board';
import { Color, FENChar, LastMove, pieceImagePaths, SafeSquares, CheckState } from '../../chess-logic/models';
import { NgFor, NgClass, NgIf } from '@angular/common';
import { SelectedSquare } from './modules';
import { Coords } from '../../chess-logic/models';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [NgFor, NgClass, NgIf],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {
  public pieceImagePaths = pieceImagePaths;
  private chessBoard = new ChessBoard();
  public chessBoardView: (FENChar | null)[][] = this.chessBoard.ChessBoardView;
  public get playerColor(): Color { return this.chessBoard.playerColor; };
  public get safeSquares(): SafeSquares { return this.chessBoard.safeSquares; };
  public get gameOverMessage(): string | undefined { return this.chessBoard.gameOverMesage; };

  private selectedSquare: SelectedSquare = { piece: null };
  private pieceSafeSquares: Coords[] = [];
  private lastMove: LastMove | undefined = this.chessBoard.lastMove;
  private checkState: CheckState = this.chessBoard.checkedState;

  public isPromotionActive: boolean = false;
  private promotionCoords: Coords | null = null;
  private promotedPiece: FENChar | null = null;

  public flipMode: boolean = false;

  public flipBoard(): void {
    this.flipMode = !this.flipMode;
  }

  public promotionPieces(): FENChar[] {
    return this.playerColor === Color.White ?
      [FENChar.WhiteKnight, FENChar.WhiteBishop, FENChar.WhiteRook, FENChar.WhiteQueen] :
      [FENChar.BlackKnight, FENChar.BlackBishop, FENChar.BlackRook, FENChar.BlackQueen];
  }

  public isSquareLastMove(x: number, y: number): boolean {
    if (!this.lastMove) return false;
    const { prevX, prevY, currX, currY } = this.lastMove;
    return x === prevX && y === prevY || x === currX && y === currY;
  }

  public isSquareChecked(x: number, y: number): boolean {
    return this.checkState.isInCheck && this.checkState.x === x && this.checkState.y === y;
  }

  public isSquareDark(x: number, y: number): boolean {
    return ChessBoard.isSquareDark(x, y);
  }

  public isSquareSelected(x: number, y: number): boolean {
    if (!this.selectedSquare.piece) return false;
    return this.selectedSquare.x === x && this.selectedSquare.y === y;
  }

  public isSquareSafeForSelectedPiece(x: number, y: number): boolean {
    const piece: FENChar | null = this.chessBoardView[x][y];
    if (this.pieceSafeSquares.some(coords => coords.x === x && coords.y === y && !piece)) {
      return true;
    } else {
      return false;
    }
  }

  public selectingPiece(x: number, y: number): void {
    if (this.gameOverMessage !== undefined) return;
    const piece: FENChar | null = this.chessBoardView[x][y];
    if (!piece) return;
    if (this.isWrongPieceSelected(piece)) return;

    const isSafeSquareClicked: boolean =
      !!this.selectedSquare.piece &&
      this.selectedSquare.x === x &&
      this.selectedSquare.y === y;
    this.unmarkPreviouslySelectedAndSafeSquares();
    if (isSafeSquareClicked) return;

    this.selectedSquare = { piece, x, y };
    this.pieceSafeSquares = this.safeSquares.get(x + "," + y) || [];
  }

  private isWrongPieceSelected(piece: FENChar): boolean {
    const isWhitePieceSelected: boolean = piece === piece.toUpperCase();
    if (isWhitePieceSelected && this.playerColor === Color.Black) {
      return true;
    }
    if (!isWhitePieceSelected && this.playerColor === Color.White) {
      return true;
    }
    return false;
  }

  private placingPiece(newX: number, newY: number): void {
    if (!this.selectedSquare.piece) return;

    if (!this.isSquareSafeForSelectedPiece(newX, newY)) {
      if (!this.isMoveEnemyPieceCapture(newX, newY)) {
        return;
      }
    }

    // pawn promotion
    const isPawnSelected: boolean = this.selectedSquare.piece === FENChar.WhitePawn || this.selectedSquare.piece === FENChar.BlackPawn;
    const isPawnOnlastRank: boolean = isPawnSelected && (newX === 7 || newX === 0);
    const shouldOpenPromotionDialog: boolean = !this.isPromotionActive && isPawnOnlastRank;

    if (shouldOpenPromotionDialog) {
      this.pieceSafeSquares = [];
      this.isPromotionActive = true;
      this.promotionCoords = { x: newX, y: newY };
      // because now we wait for player to choose promoted piece
      return;
    }

    const { x: prevX, y: prevY } = this.selectedSquare;
    this.updateBoard(prevX, prevY, newX, newY);
  }

  public isSquarepromotionSquare(x: number, y: number): boolean {
    if (!this.promotionCoords) return false;
    return this.promotionCoords.x === x && this.promotionCoords.y === y;
  }

  private updateBoard(prevX: number, prevY: number, newX: number, newY: number): void {
    this.chessBoard.move(prevX, prevY, newX, newY, this.promotedPiece);
    if (this.promotedPiece) {
      console.info(`Promoted piece selected ${this.promotedPiece}`);
    }
    this.chessBoardView = this.chessBoard.ChessBoardView;
    this.checkState = this.chessBoard.checkedState;
    this.lastMove = this.chessBoard.lastMove;

    // resets the selected chessboard square and clears safe move dots
    this.unmarkPreviouslySelectedAndSafeSquares();
  }

  public promotePiece(piece: FENChar): void {
    if (!this.promotionCoords || !this.selectedSquare.piece) return;
    this.promotedPiece = piece;
    const { x: newX, y: newY } = this.promotionCoords;
    const { x: prevX, y: prevY } = this.selectedSquare;
    this.updateBoard(prevX, prevY, newX, newY);
  }

  public closePawnPromotionDialog(): void {
    console.info("closing promotion dialog");
    this.unmarkPreviouslySelectedAndSafeSquares();
  }

  public move(x: number, y: number): void {
    this.selectingPiece(x, y);
    this.placingPiece(x, y);
  }

  private unmarkPreviouslySelectedAndSafeSquares(): void {
    this.selectedSquare = { piece: null };
    this.pieceSafeSquares = [];

    if (this.isPromotionActive) {
      this.isPromotionActive = false;
      this.promotedPiece = null;
      this.promotionCoords = null;

    }
  }

  public isMoveEnemyPieceCapture(x: number, y: number): boolean {
    const piece: FENChar | null = this.chessBoardView[x][y];
    if (this.pieceSafeSquares.some(coords => coords.x === x && coords.y === y) && piece) {
      return true;
    } else {
      return false;
    }
  }
}
