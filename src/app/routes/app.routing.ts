import { NgModule } from "@angular/core";
import { BoardComponent } from "../modules/board/board.component";
import { ComputerModeComponent } from "../modules/computer-mode/computer-mode.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    { path: "against-friend", component: BoardComponent, title: "Play against friend" },
    { path: "against-computer", component: ComputerModeComponent, title: "Play against computer" }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }