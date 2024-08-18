import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom, Subscription } from 'rxjs';
import { BoardComponent } from '../board/board.component';
import { StockfishService } from './stockfish.service';
import { ChessBoardService } from '../board/chess-board.service';
import { Color } from '../../chess-logic/models';
import { MoveListComponent } from '../move-list/move-list.component';
import { PowerBarComponent } from '../power-bar/power-bar.component';


@Component({
  selector: 'app-computer-mode',
  standalone: true,
  imports: [CommonModule, MoveListComponent, PowerBarComponent],
  templateUrl: '../board/board.component.html',
  styleUrl: '../board/board.component.css',
})

export class ComputerModeComponent extends BoardComponent implements OnInit, OnDestroy {
  private computerSubscriptions$ = new Subscription();

  constructor(private stockfishService: StockfishService) {
    super(inject(ChessBoardService));
  }

  public override ngOnInit(): void {
    super.ngOnInit();
    const computerSubscriptions$: Subscription = this.stockfishService.computerConfiguration$.subscribe({
      next: (computerConfiguration) => {
        if (computerConfiguration.color === Color.White) this.flipBoard();
      }
    })
    const chessBoardStateSubscription$: Subscription = this.chessBoardService.chessBoardState$.subscribe({
      next: async (FEN: string) => {
        if (this.chessBoard.isGameOver) {
          chessBoardStateSubscription$.unsubscribe();
          return;
        }
        const player: Color = FEN.split(" ")[1] === "w" ? Color.White : Color.Black;
        if (player !== this.stockfishService.computerConfiguration$.value.color) return;

        const { prevX, prevY, newX, newY, promotedPiece } = await firstValueFrom(this.stockfishService.getBestMove(FEN));
        this.updateBoard(prevX, prevY, newX, newY, promotedPiece);
      }
    });

    this.computerSubscriptions$.add(chessBoardStateSubscription$);
    this.computerSubscriptions$.add(computerSubscriptions$);
  }

  public override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.computerSubscriptions$.unsubscribe();
  }
}
