import { Component } from '@angular/core';
import { RowComponent } from "../row/row.component";

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [RowComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {

}
