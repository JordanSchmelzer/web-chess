import { Directive, Host, HostListener } from '@angular/core';
import { cursorTo } from 'readline';

@Directive({
  selector: '[appDragAndDropPieces]',
  standalone: true
})
export class DragAndDropPiecesDirective {

  constructor() { }

  @HostListener('drag')
  onDrag() {

  }

  @HostListener('dragstart')
  onDragStart() {
    console.warn("piece being dragged");
  }

  @HostListener('drop')
  onDrop() {
    console.warn("piece was dropped over target");
  }

  @HostListener('dragover')
  onDragOver() {
    console.warn("piece dragged over element");
  }

  @HostListener('dragenter')
  onDragEnter() {
    console.warn("piece entered an element");
  }

  @HostListener('dragleave')
  onDragLeave() {
    console.warn("piece left an element");
  }

  @HostListener('dragend')
  onDragEnd() {
    console.warn("the drag has ended");
  }

}
