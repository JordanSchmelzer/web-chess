import { Component, inject } from '@angular/core';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink, RouterModule } from '@angular/router';
import { BoardComponent } from "../board/board.component";
import { RouterLinkActive } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PlayAgainstComputerDialogComponent } from '../play-against-computer-dialog/play-against-computer-dialog.component';
import { ClickedButton } from './modules';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    NgClass,
    RouterModule,
    BoardComponent,
    RouterLinkActive,
    RouterLink,
    MatDialogModule],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.css'
})
export class NavMenuComponent {
  public clickedButton: ClickedButton = { button: 'PvP' };

  constructor(private dialog: MatDialog) {

  }


  public playAgainstPlayer(): void {
    this.clickedButton = { button: "PvP" };
  }

  public playAgainstComputer(): void {
    this.clickedButton = { button: "PvE" };
    this.dialog.open(PlayAgainstComputerDialogComponent);
  }
}
