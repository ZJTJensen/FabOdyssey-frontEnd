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
  @ViewChild('imageContainer') imageContainer!: ElementRef;


  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      let img = this.imageContainer.nativeElement;
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
    
    document.onmousemove = (event: MouseEvent) => {
      if (!isMoving) return;
    
      let newLeft = event.pageX - shiftX;
      let newTop = event.pageY - shiftY;
    
      img.style.left = newLeft + 'px';
      img.style.top = newTop + 'px';
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