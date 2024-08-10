import { Component, inject, OnInit } from '@angular/core';
import { BoardComponent } from '../board/board.component';
import { StockfishService } from './stockfish.service';
import { ChessBoardService } from '../board/chess-board.service';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-computer-mode',
  standalone: true,
  imports: [CommonModule],
  templateUrl: '../board/board.component.html',
  styleUrl: '../board/board.component.css'
})

export class ComputerModeComponent extends BoardComponent implements OnInit {

  //constructor() {
  //  super();
  //}

  constructor(private stockfishService: StockfishService) {
    super();
    inject(ChessBoardService);
  }

  public ngOnInit(): void {
    //throw new Error('Method not implemented.');
  }
}
