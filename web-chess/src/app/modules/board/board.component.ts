import { Component } from '@angular/core';
import { InformBoardOfClickService } from '../square/inform-board-of-click.service';
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

  private chessBoard = new ChessBoard();
  public chessBoardView: (FENChar | null)[][] = this.chessBoard.ChessBoardView;
  public get playerColor(): Color { return this.chessBoard.playerColor }
  public get safeSquares(): SafeSquares { return this.chessBoard.safeSquares; };
  private selectedSquare: SelectedSquare = { piece: null };
  private pieceSafeSquares: Coords[] = [];

  public isSquareDark(x: number, y: number): boolean {
    return ChessBoard.isSquareDark(x, y);
  }

  public isSquareSelected(x: number, y: number): boolean {
    if (!this.selectedSquare.piece) return false;
    return this.selectedSquare.x === x && this.selectedSquare.y === y;
  }

  public isSquareSafeForSelectedPiece(x: number, y: number): boolean {
    return this.pieceSafeSquares.some(coords => coords.x === x && coords.y === y);
  }

  public selectingPiece(x: number, y: number): void {
    const piece: FENChar | null = this.chessBoardView[x][y];
    if (!piece) return;

    this.selectedSquare = { piece, x, y };
    this.pieceSafeSquares = this.safeSquares.get(x + "," + y) || [];
  }

  private placingPiece(newX: number, newY: number): void {
    // if(!this.selectedSquare.piece) return;
    // if() return;
  }
}
