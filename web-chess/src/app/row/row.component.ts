import { Component } from '@angular/core';
import { SquareComponent } from '../square/square.component';

@Component({
  selector: 'app-row',
  standalone: true,
  imports: [SquareComponent],
  templateUrl: './row.component.html',
  styleUrl: './row.component.css'
})
export class RowComponent {

}
