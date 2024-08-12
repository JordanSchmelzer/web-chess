import { Component, inject } from '@angular/core';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink, RouterModule } from '@angular/router';
import { BoardComponent } from "../board/board.component";
import { RouterLinkActive } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PlayAgainstComputerDialogComponent } from '../play-against-computer-dialog/play-against-computer-dialog.component';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    RouterModule,
    BoardComponent,
    RouterLinkActive,
    RouterLink,
    MatDialogModule],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.css'
})
export class NavMenuComponent {

  constructor(private dialog: MatDialog) {

  }

  public playAgainstComputer(): void {
    console.log("clicked");
    this.dialog.open(PlayAgainstComputerDialogComponent);
  }
}
