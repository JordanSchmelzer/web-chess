import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BoardComponent } from '../board/board.component';
import { StockfishService } from './stockfish.service';
import { ChessBoardService } from '../board/chess-board.service';
import { CommonModule } from '@angular/common';
import { firstValueFrom, Subscription } from 'rxjs';

@Component({
  selector: 'app-computer-mode',
  standalone: true,
  imports: [CommonModule],
  templateUrl: '../board/board.component.html',
  styleUrl: '../board/board.component.css'
})

export class ComputerModeComponent extends BoardComponent implements OnInit, OnDestroy {
  private computerSubscriptions$ = new Subscription();

  constructor(private stockfishService: StockfishService) {
    super(inject(ChessBoardService));
  }

  public ngOnInit(): void {
    const chessBoardStateSubscription$: Subscription = this.chessBoardService.chessBoardState$.subscribe({
      next: async (FEN: string) => {
        const player: string = FEN.split(" ")[1];
        if (player === "w") return;

        const { prevX, prevY, newX, newY, promotedPiece } = await firstValueFrom(this.stockfishService.getBestMove(FEN));
        this.updateBoard(prevX, prevY, newX, newY, promotedPiece);
      }
    });

    this.computerSubscriptions$.add(chessBoardStateSubscription$);
  }

  public override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.computerSubscriptions$.unsubscribe();
  }
}
