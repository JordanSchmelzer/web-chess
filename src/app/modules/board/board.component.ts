import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ChessBoard } from '../../chess-logic/chess-board';
import { Color, FENChar, LastMove, pieceImagePaths, SafeSquares, CheckState, MoveList, GameHistory, MoveType } from '../../chess-logic/models';
import { NgFor, NgClass, NgIf } from '@angular/common';
import { SelectedSquare } from './modules';
import { Coords } from '../../chess-logic/models';
import { ChessBoardService } from './chess-board.service';
import { filter, fromEvent, Subscription, tap } from 'rxjs';
import { FENConverter } from '../../chess-logic/FENConverter';
import { MoveListComponent } from "../move-list/move-list.component";
import { PowerBarComponent } from "../power-bar/power-bar.component";
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { Platform } from '@angular/cdk/platform';

@Component({
  selector: 'app-board',
  standalone: true,
  imports:
    [NgFor,
      NgClass,
      NgIf,
      MoveListComponent,
      PowerBarComponent
    ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})

export class BoardComponent implements OnInit, OnDestroy {
  public pieceImagePaths = pieceImagePaths;
  protected chessBoard = new ChessBoard();
  public chessBoardView: (FENChar | null)[][] = this.chessBoard.ChessBoardView;
  public get playerColor(): Color { return this.chessBoard.playerColor; };
  public get safeSquares(): SafeSquares { return this.chessBoard.safeSquares; };
  public get gameOverMessage(): string | undefined { return this.chessBoard.gameOverMesage; };

  public get whitePiecesTaken(): number {
    return 16 - this.chessBoard.whitePiecesRemaining;
  }
  public get blackPiecesTaken(): number {
    return 16 - this.chessBoard.blackPiecesRemaining;
  }

  private selectedSquare: SelectedSquare = { piece: null };
  private pieceSafeSquares: Coords[] = [];
  private lastMove: LastMove | undefined = this.chessBoard.lastMove;
  private checkState: CheckState = this.chessBoard.checkedState;

  public isPromotionActive: boolean = false;
  private promotionCoords: Coords | null = null;
  private promotedPiece: FENChar | null = null;

  public flipMode: boolean = false;
  private subscriptions$ = new Subscription();


  public ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const keyEventSubscription$: Subscription = fromEvent<KeyboardEvent>(window, "keyup")
        .pipe(
          filter(event => event.key === "ArrowRight" || event.key === "ArrowLeft"),
          tap(event => {
            switch (event.key) {
              case "ArrowRight":
                if (this.gameHistoryPointer === this.gameHistory.length - 1) return;
                this.gameHistoryPointer++;
                break;
              case "ArrowLeft":
                if (this.gameHistoryPointer === 0) return;
                this.gameHistoryPointer--;
                break;
              default:
                break;
            }

            this.showPreviousPosition(this.gameHistoryPointer);
          })
        )
        .subscribe();

      this.subscriptions$.add(keyEventSubscription$);
    }
  }


  private markLastMoveAndCheckState(lastMove: LastMove | undefined, checkState: CheckState) {
    this.lastMove = lastMove;
    this.checkState = checkState;

    if (this.lastMove)
      this.moveSound(this.lastMove.moveType);
    else
      this.moveSound(new Set<MoveType>([MoveType.BasicMove]));
  }

  public get gameHistory(): GameHistory { return this.chessBoard.gameHistory; }
  public get moveList(): MoveList { return this.chessBoard.moveList };
  public gameHistoryPointer: number = 0;

  constructor(protected chessBoardService: ChessBoardService, @Inject(PLATFORM_ID) private platformId: Object) { }

  public flipBoard(): void {
    this.flipMode = !this.flipMode;
  }

  public promotionPieces(): FENChar[] {
    return this.playerColor === Color.White ?
      [FENChar.WhiteKnight, FENChar.WhiteBishop, FENChar.WhiteRook, FENChar.WhiteQueen] :
      [FENChar.BlackKnight, FENChar.BlackBishop, FENChar.BlackRook, FENChar.BlackQueen];
  }

  public isSquareLastMove(x: number, y: number): boolean {
    if (!this.lastMove) return false;
    const { prevX, prevY, currX, currY } = this.lastMove;
    return x === prevX && y === prevY || x === currX && y === currY;
  }

  public isSquareChecked(x: number, y: number): boolean {
    return this.checkState.isInCheck && this.checkState.x === x && this.checkState.y === y;
  }

  public isSquareDark(x: number, y: number): boolean {
    return ChessBoard.isSquareDark(x, y);
  }

  public isSquareSelected(x: number, y: number): boolean {
    if (!this.selectedSquare.piece) return false;
    return this.selectedSquare.x === x && this.selectedSquare.y === y;
  }

  public isSquareSafeForSelectedPiece(x: number, y: number): boolean {
    const piece: FENChar | null = this.chessBoardView[x][y];
    if (this.pieceSafeSquares.some(coords => coords.x === x && coords.y === y && !piece)) {
      return true;
    } else {
      return false;
    }
  }

  public selectingPiece(x: number, y: number): void {
    if (this.gameOverMessage !== undefined) return;
    const piece: FENChar | null = this.chessBoardView[x][y];
    if (!piece) return;
    if (this.isWrongPieceSelected(piece)) return;

    const isSafeSquareClicked: boolean =
      !!this.selectedSquare.piece &&
      this.selectedSquare.x === x &&
      this.selectedSquare.y === y;
    this.unmarkPreviouslySelectedAndSafeSquares();
    if (isSafeSquareClicked) return;

    this.selectedSquare = { piece, x, y };
    this.pieceSafeSquares = this.safeSquares.get(x + "," + y) || [];
  }

  private isWrongPieceSelected(piece: FENChar): boolean {
    const isWhitePieceSelected: boolean = piece === piece.toUpperCase();
    if (isWhitePieceSelected && this.playerColor === Color.Black) {
      return true;
    }
    if (!isWhitePieceSelected && this.playerColor === Color.White) {
      return true;
    }
    return false;
  }

  private placingPiece(newX: number, newY: number): void {
    if (!this.selectedSquare.piece) return;

    if (!this.isSquareSafeForSelectedPiece(newX, newY)) {
      if (!this.isMoveEnemyPieceCapture(newX, newY)) {
        return;
      }
    }

    // pawn promotion
    const isPawnSelected: boolean = this.selectedSquare.piece === FENChar.WhitePawn || this.selectedSquare.piece === FENChar.BlackPawn;
    const isPawnOnlastRank: boolean = isPawnSelected && (newX === 7 || newX === 0);
    const shouldOpenPromotionDialog: boolean = !this.isPromotionActive && isPawnOnlastRank;

    if (shouldOpenPromotionDialog) {
      this.pieceSafeSquares = [];
      this.isPromotionActive = true;
      this.promotionCoords = { x: newX, y: newY };
      // because now we wait for player to choose promoted piece
      return;
    }

    const { x: prevX, y: prevY } = this.selectedSquare;
    this.updateBoard(prevX, prevY, newX, newY, this.promotedPiece);
  }

  public isSquarepromotionSquare(x: number, y: number): boolean {
    if (!this.promotionCoords) return false;
    return this.promotionCoords.x === x && this.promotionCoords.y === y;
  }

  protected updateBoard(prevX: number, prevY: number, newX: number, newY: number, promotedPiece: FENChar | null): void {
    this.chessBoard.move(prevX, prevY, newX, newY, promotedPiece);
    this.chessBoardView = this.chessBoard.ChessBoardView;
    this.markLastMoveAndCheckState(this.chessBoard.lastMove, this.chessBoard.checkedState);

    // resets the selected chessboard square and clears safe move dots
    this.unmarkPreviouslySelectedAndSafeSquares();
    this.chessBoardService.chessBoardState$.next(this.chessBoard.boardAsFEN)
    this.gameHistoryPointer++;
  }

  public promotePiece(piece: FENChar): void {
    if (!this.promotionCoords || !this.selectedSquare.piece) return;
    this.promotedPiece = piece;
    const { x: newX, y: newY } = this.promotionCoords;
    const { x: prevX, y: prevY } = this.selectedSquare;
    this.updateBoard(prevX, prevY, newX, newY, this.promotedPiece);
  }

  public closePawnPromotionDialog(): void {
    this.unmarkPreviouslySelectedAndSafeSquares();
  }

  public move(x: number, y: number): void {
    this.selectingPiece(x, y);
    this.placingPiece(x, y);
  }

  private unmarkPreviouslySelectedAndSafeSquares(): void {
    this.selectedSquare = { piece: null };
    this.pieceSafeSquares = [];

    if (this.isPromotionActive) {
      this.isPromotionActive = false;
      this.promotedPiece = null;
      this.promotionCoords = null;

    }
  }

  public isMoveEnemyPieceCapture(x: number, y: number): boolean {
    const piece: FENChar | null = this.chessBoardView[x][y];
    if (this.pieceSafeSquares.some(coords => coords.x === x && coords.y === y) && piece) {
      return true;
    } else {
      return false;
    }
  }

  public ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
    this.chessBoardService.chessBoardState$.next(FENConverter.initalPosition);
  }

  public showPreviousPosition(moveIndex: number): void {
    const { board, checkState, lastMove } = this.gameHistory[moveIndex];
    this.chessBoardView = board;
    this.markLastMoveAndCheckState(lastMove, checkState);
    this.gameHistoryPointer = moveIndex;
  }

  private moveSound(moveType: Set<MoveType>): void {
    const moveSound = new Audio("assets/sound/move.mp3");

    if (moveType.has(MoveType.Promotion)) moveSound.src = "assets/sound/promote.mp3";
    else if (moveType.has(MoveType.Capture)) moveSound.src = "assets/sound/capture.mp3";
    if (moveType.has(MoveType.Castling)) moveSound.src = "assets/sound/castling.mp3"

    if (moveType.has(MoveType.CheckMate)) moveSound.src = "assets/sound/mate.mp3";
    else if (moveType.has(MoveType.Check)) moveSound.src = "assets/sound/check.mp3";

    moveSound.play();
  }
}
