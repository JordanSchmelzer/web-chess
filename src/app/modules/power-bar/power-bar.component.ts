// This is a naive implementation of a balanfe of power bar
// Get inputs from the board component to set the height of 2 stacked and colored divs
// To make this better the board should calculate this using more detailed board state (FEN)

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-power-bar',
  standalone: true,
  imports: [],
  templateUrl: './power-bar.component.html',
  styleUrl: './power-bar.component.css'
})
export class PowerBarComponent {
  gradient: string = 'linear-gradient(to top, white, black)';

  // each piece is worth 20 pixels
  // 640 total pixels
  whitePercentage: number = 320;
  blackPercentage: number = 320;

  @Input() whitePiecesTaken: number = 0;
  @Input() blackPiecesTaken: number = 0;

  ngOnChanges() {
    //this.updateGradient();
    this.updatePowerBar();
  }

  updatePowerBar(): void {
    const barHeightPixels = 640;
    const pixelsPerPieceTaken = 20;

    let whitePixels = (barHeightPixels / 2) - (this.whitePiecesTaken * pixelsPerPieceTaken) + (this.blackPiecesTaken * pixelsPerPieceTaken);
    let blackPixels = (barHeightPixels / 2) - (this.blackPiecesTaken * pixelsPerPieceTaken) + (this.whitePiecesTaken * pixelsPerPieceTaken);

    this.whitePercentage = whitePixels;
    this.blackPercentage = blackPixels;
  }
}