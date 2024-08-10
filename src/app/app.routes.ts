import { Routes } from '@angular/router';
import { BoardComponent } from './modules/board/board.component';
import { ComputerModeComponent } from './modules/computer-mode/computer-mode.component';


export const routes: Routes = [
    { path: 'against-friend', component: BoardComponent, title: "Play against friend" },
    { path: 'against-computer', component: ComputerModeComponent, title: "Play against computer" }
]