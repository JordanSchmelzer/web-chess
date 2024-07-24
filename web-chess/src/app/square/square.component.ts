import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  Renderer2,
  ViewChild
} from '@angular/core';
import { elementAt } from 'rxjs';

@Component({
  selector: 'app-square',
  standalone: true,
  imports: [],
  template: `
    <div [style]="getStyle()" #myDiv (mouseover)="highlightSquare()" (mouseleave)="resetSquareHighlight()">
      <img [alt]="getAlt()" [src]="getPiece()" width="80" height="80" />
    </div>
  `,
  //templateUrl: './square.component.html',
  //styleUrl: './square.component.css'
})
export class SquareComponent {
  _backgroundColor: string = '';
  _isClicked: boolean;
  _isHovered: boolean;
  @Input() white: boolean;
  @Input() gamePiece: string;
  @Output() canMoveEvent = new EventEmitter<boolean>();

  constructor(private renderer: Renderer2) {
    this.white = true;
    this.gamePiece = "bp";
    this._isClicked = false;
    this._isHovered = false;
  }

  @ViewChild('myDiv', { static: true }) myDiv: ElementRef | undefined;

  highlightSquare() {
    this._isHovered = true;
    this.renderer.setStyle(this.myDiv?.nativeElement, 'background-color', 'cyan');
  }

  resetSquareHighlight() {
    this._isHovered = false;
    this.renderer.setStyle(this.myDiv?.nativeElement, 'background-color', this._backgroundColor);
  }

  canMove() {
    this.canMoveEvent.emit(true);
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
    if (this.gamePiece == "bkn") { return "./blackknight.png"; }
    if (this.gamePiece == "br") { return "./blackrook.png"; }
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
