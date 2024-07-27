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
  whiteTurn: boolean;
  gameState: string[][];
  winner: string;

  constructor() {
    this.whiteTurn = true;
    this.gameState = [];
    this.winner = "";
  }

  getBoardState() {
    console.info(this.gameState[0]);
    return this.gameState;
  }

  get player() {
    if (this.whiteTurn == true) {
      return "white"
    } else {
      return "black"
    }
  }

  ngOnInit() {
    this.newGame();
  }

  newGame() {
    this.whiteTurn = true;
    this.gameState = [
      ["r", "n", "b", "q", "k", "b", "n", "r"],
      ["p", "p", "p", "p", "p", "p", "p", "p"],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["P", "P", "P", "P", "P", "P", "P", "P"],
      ["R", "N", "B", "Q", "K", "B", "N", "R"]
    ];
  }



}
