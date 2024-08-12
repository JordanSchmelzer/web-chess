import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, switchMap, BehaviorSubject } from 'rxjs';
import { ChessMove, StockfishQueryParams, StockfishResponse, stockfishLevels, ComputerConfiguration } from './models';
import { FENChar, Color } from '../../chess-logic/models';

@Injectable({
  providedIn: 'root'
})
export class StockfishService {
  private readonly api: string = "https://stockfish.online/api/s/v2.php";

  public computerConfiguration$ = new BehaviorSubject<ComputerConfiguration>({ color: Color.Black, level: 1 });

  constructor(private http: HttpClient) { }

  private convertColumnLetterToYCoord(string: string): number {
    return string.charCodeAt(0) - "a".charCodeAt(0);
  }

  private promotedPiece(piece: string | undefined): FENChar | null {
    if (!piece) return null;
    const computerColor: Color = this.computerConfiguration$.value.color;
    if (piece === "n") return FENChar.BlackKnight;
    if (piece === "b") return FENChar.BlackBishop;
    if (piece === "b") return FENChar.BlackRook;
    return FENChar.BlackQueen;
  }

  private moveFromStockfishString(move: string): ChessMove {
    const prevY: number = this.convertColumnLetterToYCoord(move[0]);
    const prevX: number = Number(move[1]) - 1;
    const newY: number = this.convertColumnLetterToYCoord(move[2]);
    const newX: number = Number(move[3]) - 1;
    const promotedPiece = this.promotedPiece(move[4]);
    return { prevX, prevY, newX, newY, promotedPiece };
  }

  public getBestMove(fen: string): Observable<ChessMove> {
    const queryParams: StockfishQueryParams = {
      fen,
      depth: stockfishLevels[this.computerConfiguration$.value.level],
    };

    let params = new HttpParams().appendAll(queryParams);

    console.info("sending stockfish http get");
    return this.http.get<StockfishResponse>(this.api, { params })
      .pipe(
        switchMap(response => {
          console.info(response.bestmove);
          const bestMove = response.bestmove.split(" ")[1];
          return of(this.moveFromStockfishString(bestMove));
        })
      );
  }
}
