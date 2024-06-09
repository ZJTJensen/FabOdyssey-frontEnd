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
      let clickableAreas = document.querySelectorAll('.clickable-area');
      this.makeImageDraggable(img, clickableAreas);
    }
  }

  makeImageDraggable(img: any, clickableAreas: any) {
    let shiftX: number, shiftY: number, isMoving = false;
    let prevLeft: number = img.getBoundingClientRect().left;
    let prevTop: number = img.getBoundingClientRect().top;  

    img.onmousedown = (event: MouseEvent) => {
      isMoving = true;
      shiftX = event.clientX - img.getBoundingClientRect().left;
      shiftY = event.clientY - img.getBoundingClientRect().top;

      img.style.position = 'absolute';
      img.style.zIndex = '1000';
    };

    document.onmousemove = (event: MouseEvent) => {
      if (!isMoving) return;
      let newLeft = event.pageX - shiftX;
      let newTop = event.pageY - shiftY;
      let diffLeft = newLeft - prevLeft;
      let diffTop = newTop - prevTop;
  
      img.style.left = newLeft + 'px';
      img.style.top = newTop + 'px';  
      clickableAreas.forEach((clickableArea: any) => {
        let areaLeft = parseFloat(clickableArea.style.left || '0');
        let areaTop = parseFloat(clickableArea.style.top || '0');
  
        clickableArea.style.left = (areaLeft + diffLeft) + 'px';
        clickableArea.style.top = (areaTop + diffTop) + 'px';
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