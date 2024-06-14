import { AfterViewInit, Component, ElementRef, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'world-map',
  standalone: true,
  imports: [],
  templateUrl: './world-map.component.html',
  styleUrl: './world-map.component.css'
})
export class WorldMapComponent implements AfterViewInit {
  @ViewChild('draggableImage') image!: ElementRef;


  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      let img = this.image.nativeElement;
      this.makeImageDraggable(img);
    }
  }

  makeImageDraggable(img: any) {
    let shiftX: number, shiftY: number, isMoving = false; 

    img.onmousedown = (event: MouseEvent) => {
      isMoving = true;
      shiftX = event.clientX - img.getBoundingClientRect().left;
      shiftY = event.clientY - img.getBoundingClientRect().top;
      img.style.position = 'absolute';
      img.style.zIndex = '1000';
    };
    
    let clickableAreas = Array.from(document.querySelectorAll('.clickable-area')).map(area => {
      return {
        element: area,
        prevLeft: area.getBoundingClientRect().left,
        prevTop: area.getBoundingClientRect().top
      };
    });
    
    document.onmousemove = (event: MouseEvent) => {
      if (!isMoving) return;
    
      let newLeft = event.pageX - shiftX;
      let newTop = event.pageY - shiftY;
    
      img.style.left = newLeft + 'px';
      img.style.top = newTop + 'px';
    
      clickableAreas.forEach((clickableArea: any) => {
        let diffLeft = clickableArea.prevLeft - newLeft;
        let diffTop = clickableArea.prevTop - newTop;
        let areaLeft = parseFloat(clickableArea.element.style.left || '0');
        let areaTop = parseFloat(clickableArea.element.style.top || '0');
        if( (newLeft < 0 || newTop < 0) && (clickableArea.prevLeft + newLeft < 0 || clickableArea.prevTop + newTop < 0)) {
          clickableArea.element.style.left = (areaLeft - diffLeft) + 'px';
          clickableArea.element.style.top = (areaTop - diffTop) + 'px';
        } else {
          clickableArea.element.style.left = ((areaLeft - diffLeft) > 0 ? areaLeft - diffLeft : diffLeft - areaLeft) + 'px';
          clickableArea.element.style.top = ((areaTop - diffTop) > 0 ? areaTop - diffTop : diffTop - areaTop) + 'px';
        }
        clickableArea.prevLeft = newLeft;
        clickableArea.prevTop = newTop;
       clickableArea.element.addEventListener('click', () => this.handleClick(clickableArea.element.id));
      });
    };

    img.onmouseup = () => {
      isMoving = false;
    };

    img.ondragstart = () => {
      return false;
    };
  }

  handleClick(area: string) {
    console.log(`Clicked on ${area}`);
  }
}