import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InformBoardOfClickService {
  public data: string = "";
  public sourcePosition: string = "";
  public startLocation: string;
  public endLocation: string;
  public boardState: string[][];
  public sourceGamePiece: string = "";

  constructor() {
    this.data = "";
    this.sourcePosition = "";
    this.startLocation = "";
    this.endLocation = "";
    this.boardState = [];
  }

  informBoardComponent(): void {

  }
}
