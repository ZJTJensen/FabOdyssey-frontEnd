import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FabMainComponent } from './fab-main/fab-main.component';
let AppComponent = class AppComponent {
    constructor() {
        this.title = 'fabodyssey-frontend';
    }
};
AppComponent = __decorate([
    Component({
        selector: 'app-root',
        standalone: true,
        imports: [RouterOutlet, FabMainComponent, RouterLink],
        templateUrl: './app.component.html',
        styleUrl: './app.component.scss'
    })
], AppComponent);
export { AppComponent };
//# sourceMappingURL=app.component.js.map