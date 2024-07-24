import { Component, Input } from '@angular/core';
import { RowComponent } from "../row/row.component";

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [RowComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {

  @Input() boardState: string[][];
  constructor() {
    this.boardState = [];
  }

  getRowNumber(i: number) {
    return i;
  }

  getBoardState(i: number) {
    console.info(this.boardState[i], i);
    return this.boardState[i];
  }
}
