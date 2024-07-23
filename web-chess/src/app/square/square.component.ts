import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'app-square',
  standalone: true,
  imports: [],
  templateUrl: './square.component.html',
  styleUrl: './square.component.css'
})

export class SquareComponent {
  @Output() canMoveEvent = new EventEmitter<boolean>();
  canMove() {
    this.canMoveEvent.emit(true);
  }

  constructor() {
    this.white = true;
    this.gamePiece = "bp";
    this.position = "";
  }

  @Input() position: string;
  getPosition() {
    return "";
  }

  @Input() white: boolean;
  getStyle() {
    if (this.white == false) {
      return {
        backgroundColor: 'green',
        color: 'white'
      }
    } else {
      return {
        backgroundColor: 'lightgrey',
        color: 'black',
      }
    }
  }

  @Input() gamePiece: string;
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
