import { Component, Input } from '@angular/core';
import { SquareComponent } from '../square/square.component';

@Component({
  selector: 'app-row',
  standalone: true,
  imports: [SquareComponent],
  templateUrl: './row.component.html',
  styleUrl: './row.component.css'
})
export class RowComponent {
  constructor() {
    this.whiteStart = true;
    this.gameState = [];
    this.boardRow = 1;
  }

  @Input() whiteStart: boolean;
  @Input() gameState: string[];
  @Input() boardRow: number;

  getBackgroundColor(rowNumber: number, colNumber: number) {
    if (rowNumber % 2 == 0) {
      if (colNumber % 2 == 0) {
        return true;
      } else {
        return false;
      }
    } else {
      if (colNumber % 2 == 0) {
        return false;
      } else {
        return true;
      }
    }
  }

  getSquarePiece(i: number) {
    return this.gameState[i];
  }
  getSquareColor() {
    return
  }
}
