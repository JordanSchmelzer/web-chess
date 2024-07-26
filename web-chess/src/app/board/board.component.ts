import { Component, Input } from '@angular/core';
import { RowComponent } from "../row/row.component";
import { InformBoardOfClickService } from '../square/inform-board-of-click.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [RowComponent],
  template: `
    <div class="grid-container">
      <app-row [gameState]="getBoardState(0)" [boardRow]="getRowNumber(0)" />
      <app-row [gameState]="getBoardState(1)" [boardRow]="getRowNumber(1)" />
      <app-row [gameState]="getBoardState(2)" [boardRow]="getRowNumber(2)" />
      <app-row [gameState]="getBoardState(3)" [boardRow]="getRowNumber(3)" />
      <app-row [gameState]="getBoardState(4)" [boardRow]="getRowNumber(4)" />
      <app-row [gameState]="getBoardState(5)" [boardRow]="getRowNumber(5)" />
      <app-row [gameState]="getBoardState(6)" [boardRow]="getRowNumber(6)" />
      <app-row [gameState]="getBoardState(7)" [boardRow]="getRowNumber(7)" />
    </div>
    <p>{{_informBoardOfClick.sourcePosition}}</p>
    <p>{{_informBoardOfClick.sourceGamePiece}}</p>
  `,
  styleUrl: './board.component.css'
})
export class BoardComponent {
  @Input() boardState: string[][];

  constructor(public _informBoardOfClick: InformBoardOfClickService) {
    this.boardState = [];
  }

  getRowNumber(i: number) {
    return i;
  }

  getBoardState(i: number) {
    //console.info(this.boardState[i], i);
    return this.boardState[i];
  }
}
