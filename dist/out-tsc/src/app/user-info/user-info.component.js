import { __decorate } from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardSelectComponent } from '../card-select/card-select.component';
import { cards } from 'fab-cards';
import { CommonModule } from '@angular/common';
let UserInfoComponent = class UserInfoComponent {
    constructor(deckService, userService) {
        this.cardList = [];
        this.quit = new EventEmitter();
        this.selectedCard = new EventEmitter();
        this.increaseLevel = new EventEmitter();
        this.listOfUsersInBracket = [];
        this.deckService = deckService,
            this.userService = userService;
    }
    ngOnInit() {
        // this.getUsersInBracket(this.userInfo.user);
    }
    increaseUserLevel() {
        this.increaseLevel.emit();
    }
    quitFunc(event) {
        this.quit.emit(event);
    }
    saveSelectedCardFunc(event) {
        this.selectedCard.emit(event);
    }
    getUsersInBracket(users) {
        this.listOfUsersInBracket = [0, 2];
        return true;
    }
    getCardImage(cardIdentifier) {
        let cardUrl;
        cards.forEach(card => {
            if (cardIdentifier === card.cardIdentifier) {
                if (!card.defaultImage.includes('.png')) {
                    let cardLocation = card.defaultImage.split('.');
                    cardUrl = this.deckService.getImageUrl(cardLocation[0]);
                }
                else {
                    cardUrl = card.defaultImage;
                }
            }
        });
        return cardUrl || '';
    }
};
__decorate([
    Input()
], UserInfoComponent.prototype, "userInfo", void 0);
__decorate([
    Input()
], UserInfoComponent.prototype, "isDeckValid", void 0);
__decorate([
    Input()
], UserInfoComponent.prototype, "logingIn", void 0);
__decorate([
    Input()
], UserInfoComponent.prototype, "limiters", void 0);
__decorate([
    Input()
], UserInfoComponent.prototype, "owenedCards", void 0);
__decorate([
    Input()
], UserInfoComponent.prototype, "cardList", void 0);
__decorate([
    Output()
], UserInfoComponent.prototype, "quit", void 0);
__decorate([
    Output()
], UserInfoComponent.prototype, "selectedCard", void 0);
__decorate([
    Output()
], UserInfoComponent.prototype, "increaseLevel", void 0);
UserInfoComponent = __decorate([
    Component({
        selector: 'app-user-info',
        standalone: true,
        imports: [CommonModule, CardSelectComponent],
        templateUrl: './user-info.component.html',
        styleUrl: './user-info.component.scss'
    })
], UserInfoComponent);
export { UserInfoComponent };
//# sourceMappingURL=user-info.component.js.map