import {
  Component,
  Input,
  ElementRef,
  Renderer2,
  ViewChild
} from '@angular/core';
import { SquareTraversalDirective } from './square-traversal.directive';
import { InformBoardOfClickService } from './inform-board-of-click.service';
import { DragAndDropPiecesDirective } from './drag-and-drop-pieces.directive';

@Component({
  selector: 'app-square',
  standalone: true,
  imports: [SquareTraversalDirective, DragAndDropPiecesDirective],
  template: `
    <div #myDiv [style]="getStyle()" (click)="handleClick()" appSquareTraversal>
      <img [alt]="getAlt()" [src]="getPiece()" width="80" height="80" />
    </div>
  `
})
export class SquareComponent {
  _backgroundColor: string = '';
  _isClicked: boolean;
  _isHovered: boolean;
  @Input() white: boolean;
  @Input() gamePiece: string;
  @Input() rowLocation: number;
  @Input() columnLocation: number;

  constructor(
    private _renderer: Renderer2,
    private _informBoardService: InformBoardOfClickService
  ) {
    this.white = true;
    this.gamePiece = "";
    this._isClicked = false;
    this._isHovered = false;
    this.rowLocation = 0;
    this.columnLocation = 0;
  }

  @ViewChild('myDiv', { static: true }) myDiv: ElementRef | undefined;
  handleClick() {
    // if this is active player's piece, let them select it
    if (this._isClicked == false && this.gamePiece != "") {
      this._isClicked = true;
      this._renderer.setStyle(this.myDiv?.nativeElement, 'background-color', 'red');
      // Let board know piece being moved
      this._informBoardService.sourcePosition = `Selected Row: ${this.rowLocation}, Selected Col: ${this.columnLocation}`;
      this._informBoardService.sourceGamePiece = `Selected Piece: ${this.gamePiece}`
      // TODO: highlight valid squares for the player to move
      // Un-select the selected piece
    } else if (this._isClicked == true && this.gamePiece != "") {
      this._isClicked = false;

      this._renderer.setStyle(this.myDiv?.nativeElement, 'background-color', this._backgroundColor);
      // Let the board know a piece is no longer being moved
      this._informBoardService
    }
    // TODO: handle move to new square
    // Need active selected piece location


    // how much of this should be handled by the service?
    // we have to check if the target is an empty board cell or an enemy cell
    // we have to check to see if another cell on the board is clicked
  }

  getStyle() {
    if (this.white == false) {
      this._backgroundColor = 'green';
      return { 'background-color': 'green' };
    } else {
      this._backgroundColor = 'lightgrey';
      return { 'background-color': 'lightgrey' };
    }
  }
  getPiece() {
    if (this.gamePiece == "bp") { return "./blackpawn.png"; }
    if (this.gamePiece == "wp") { return "./whitepawn.png"; }
    if (this.gamePiece == "wk") { return "./whiteking.png"; }
    if (this.gamePiece == "bk") { return "./blackking.png"; }
    if (this.gamePiece == "wq") { return "./whitequeen.png"; }
    if (this.gamePiece == "bq") { return "./blackqueen.png"; }
    if (this.gamePiece == "wkn") { return "./whiteknight.png"; }
    if (this.gamePiece == "br") { return "./blackrook.png"; }
    if (this.gamePiece == "bkn") { return "./blackknight.png"; }
    if (this.gamePiece == "wr") { return "./whiterook.png"; }
    if (this.gamePiece == "bb") { return "./blackbishop.png"; }
    if (this.gamePiece == "wb") { return "./whitebishop.png"; }
    if (this.gamePiece == "") { return "./Empty.png"; }
    return "";
  }
  getAlt() {
    if (this.gamePiece == "bp") { return "Black Pawn"; }
    if (this.gamePiece == "wp") { return "White Pawn"; }
    if (this.gamePiece == "wk") { return "White King"; }
    if (this.gamePiece == "bk") { return "Black King"; }
    if (this.gamePiece == "wq") { return "White Queen"; }
    if (this.gamePiece == "bq") { return "Black Queen"; }
    if (this.gamePiece == "wkn") { return "White Knight"; }
    if (this.gamePiece == "bkn") { return "Black Knight"; }
    if (this.gamePiece == "br") { return "Black Rook"; }
    if (this.gamePiece == "wr") { return "White Rook"; }
    if (this.gamePiece == "bb") { return "Black Bishop"; }
    if (this.gamePiece == "wb") { return "White Bishop"; }
    if (this.gamePiece == "") { return "Empty"; }
    return "Empty";
  }
}
