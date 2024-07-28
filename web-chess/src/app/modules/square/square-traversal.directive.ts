import {
  Directive,
  HostListener,
  Renderer2,
  ElementRef,
} from '@angular/core';

import { SquareComponent } from './square.component';

@Directive({
  selector: '[appSquareTraversal]',
  standalone: true
})
export class SquareTraversalDirective {

  constructor(
    private renderer: Renderer2,
    private element: ElementRef,
    private host: SquareComponent
  ) {
  }

  @HostListener('mouseover')
  onMouseOver() {
    if (this.host._isClicked == false) {
      this.renderer.setStyle(this.element.nativeElement, 'background-color', 'cyan');
      this.host._isHovered = true;
    }
  }

  @HostListener('mouseout')
  onMouseOut() {
    if (this.host._isClicked == false) {
      this.renderer.setStyle(this.element.nativeElement, 'background-color', this.host._backgroundColor);
      this.host._isHovered = false;
    }
  }
}
