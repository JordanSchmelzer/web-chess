import { Component } from '@angular/core';
import { BoardComponent } from '../board/board.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [BoardComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {
  constructor() {
    this.gameState = [
      ["br", "bkn", "bb", "bq", "bk", "bb", "bkn", "br"],
      ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
      ["wr", "wkn", "wb", "wq", "wk", "wb", "wkn", "wr"]
    ]
  }

  gameState: string[][];
  getBoardState() {
    console.info(this.gameState[0]);
    return this.gameState;
  }
}
