import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InformBoardOfClickService {
  public boardState: string[][];
  public startGamePiece: string;
  public startRow: number;
  public startCol: number;
  public destGamePiece: string;
  public endRow: number;
  public endCol: number;

  constructor() {
    this.boardState = [];
    this.startRow = 0;
    this.startCol = 0;
    this.endRow = 0;
    this.endCol = 0;
    this.startGamePiece = "";
    this.destGamePiece = "";
  }

  startMove(rowSourcePiece: number,
    colSourcePiece: number,
    sourcePiece: string) {
    this.startRow = rowSourcePiece;
    this.startCol = colSourcePiece;
    this.startGamePiece = sourcePiece;
    console.log('Starting a move');
  }

  cancelMove() {
    this.startRow = 0;
    this.startCol = 0;
    this.startGamePiece = "";
    console.log('The move has been canceled');
  }

  selectDestSquare() {
    this.endCol = 0;
    this.endRow = 0;
    this.destGamePiece = "";
    console.log("targeting this square: ");
  }

  commitMove() {

  }

}
