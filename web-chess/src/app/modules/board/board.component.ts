import { Component } from '@angular/core';
import { InformBoardOfClickService } from '../square/inform-board-of-click.service';
import { ChessBoard } from '../../chess-logic/chess-board';
import { Color, FENChar, pieceImagePaths } from '../../chess-logic/models';
import { NgFor, NgClass, NgIf } from '@angular/common';

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


  constructor(public _informBoardOfClick: InformBoardOfClickService) { }

  public isSquareDark(x: number, y: number): boolean {
    return ChessBoard.isSquareDark(x, y);
  }

  private placingPiece(newX: number, newY: number): void {
    // if(!this.selectedSquare.piece) return;
    // if() return;
  }
}
