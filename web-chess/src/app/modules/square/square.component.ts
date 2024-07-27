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
    if (this._isClicked == false &&
      this.gamePiece != "" &&
      this._informBoardService.startGamePiece == "") {

      this._isClicked = true;
      this._renderer.setStyle(this.myDiv?.nativeElement, 'background-color', 'red');
      this._informBoardService.startMove(this.rowLocation,
        this.columnLocation,
        this.gamePiece);

    } else if (this._isClicked == true && this.gamePiece != "") {
      this._isClicked = false;
      this._renderer.setStyle(this.myDiv?.nativeElement, 'background-color', this._backgroundColor);
      this._informBoardService.cancelMove();
    } else if (this._isClicked == false &&
      this._informBoardService.startGamePiece != ""
    ) {
      this.gamePiece = this._informBoardService.startGamePiece;
    }
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
    if (this.gamePiece == "P") { return "./whitepawn.png"; }
    if (this.gamePiece == "p") { return "./blackpawn.png"; }
    if (this.gamePiece == "K") { return "./whiteking.png"; }
    if (this.gamePiece == "k") { return "./blackking.png"; }
    if (this.gamePiece == "Q") { return "./whitequeen.png"; }
    if (this.gamePiece == "q") { return "./blackqueen.png"; }
    if (this.gamePiece == "N") { return "./whiteknight.png"; }
    if (this.gamePiece == "n") { return "./blackknight.png"; }
    if (this.gamePiece == "R") { return "./whiterook.png"; }
    if (this.gamePiece == "r") { return "./blackrook.png"; }
    if (this.gamePiece == "B") { return "./whitebishop.png"; }
    if (this.gamePiece == "b") { return "./blackbishop.png"; }
    if (this.gamePiece == "") { return "./Empty.png"; }
    return "";
  }
  getAlt() {
    if (this.gamePiece == "P") { return "White Pawn"; }
    if (this.gamePiece == "p") { return "Black Pawn"; }
    if (this.gamePiece == "K") { return "White King"; }
    if (this.gamePiece == "k") { return "Black King"; }
    if (this.gamePiece == "Q") { return "White Queen"; }
    if (this.gamePiece == "q") { return "Black Queen"; }
    if (this.gamePiece == "N") { return "White Knight"; }
    if (this.gamePiece == "n") { return "Black Knight"; }
    if (this.gamePiece == "R") { return "White Rook"; }
    if (this.gamePiece == "r") { return "Black Rook"; }
    if (this.gamePiece == "B") { return "White Bishop"; }
    if (this.gamePiece == "b") { return "Black Bishop"; }
    if (this.gamePiece == "") { return "Empty"; }
    return "Empty";
  }
}
