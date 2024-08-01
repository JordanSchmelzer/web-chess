import { Component } from '@angular/core';
import { ChessBoard } from '../../chess-logic/chess-board';
import { Color, FENChar, pieceImagePaths, SafeSquares } from '../../chess-logic/models';
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
  private selectedSquare: SelectedSquare = { piece: null };
  private pieceSafeSquares: Coords[] = [];
  private chessBoard = new ChessBoard();
  public chessBoardView: (FENChar | null)[][] = this.chessBoard.ChessBoardView;
  public get playerColor(): Color { return this.chessBoard.playerColor }
  public get safeSquares(): SafeSquares { return this.chessBoard.safeSquares; };

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

    const { x: prevX, y: prevY } = this.selectedSquare;
    this.chessBoard.move(prevX, prevY, newX, newY);
    this.chessBoardView = this.chessBoard.ChessBoardView;

    // resets the selected chessboard square and clears safe move dots
    this.unmarkPreviouslySelectedAndSafeSquares();
  }

  public move(x: number, y: number): void {
    this.selectingPiece(x, y);
    this.placingPiece(x, y);
  }

  private unmarkPreviouslySelectedAndSafeSquares(): void {
    this.selectedSquare = { piece: null };
    this.pieceSafeSquares = [];
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
