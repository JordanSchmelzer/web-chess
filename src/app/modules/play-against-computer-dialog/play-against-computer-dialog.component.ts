import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-play-against-computer-dialog',
  standalone: true,
  imports: [MatDialogModule, CommonModule, MatButtonModule],
  templateUrl: './play-against-computer-dialog.component.html',
  styleUrl: './play-against-computer-dialog.component.css'
})
export class PlayAgainstComputerDialogComponent {
  public stockfishLevels: readonly number[] = [1, 2, 3, 4, 5];
  public stockfishLevel: number = 1;
}
