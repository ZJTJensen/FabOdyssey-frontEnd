import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FabMainComponent } from './fab-main/fab-main.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FabMainComponent, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'fab-adventure-game';
}
