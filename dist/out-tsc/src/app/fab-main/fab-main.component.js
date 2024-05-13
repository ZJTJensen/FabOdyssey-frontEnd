import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { switchMap, tap } from 'rxjs';
import { CardSelectComponent } from '../card-select/card-select.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { UserInfoComponent } from '../user-info/user-info.component';
let FabMainComponent = class FabMainComponent {
    constructor(deckService, userService) {
        this.response = new Object();
        this.deckUrl = "";
        this.cardList = new Array();
        this.owenedCards = new Array();
        this.cardSelected = new Object();
        this.limiters = new Object();
        this.isDeckValid = false;
        this.phone = "";
        this.loginAttempt = false;
        this.logingIn = false;
        this.loginValue = "";
        this.userName = "";
        this.isLoggedIn = false;
        this.deckService = deckService,
            this.userService = userService;
    }
    login() {
        this.logingIn = true;
        this.getUser().pipe(tap(userAndDeck => {
            this.userInfo = userAndDeck.user.slug ? userAndDeck.user : undefined;
            this.isLoggedIn = this.userInfo ? true : false;
            this.owenedCards = userAndDeck.cards.length > 0 ? userAndDeck.cards : this.owenedCards;
        }), switchMap(() => {
            this.logingIn = false;
            return this.getDeck();
        })).subscribe(() => {
            this.loginAttempt = true;
            this.logingIn = false;
        }, error => {
            this.loginAttempt = true;
            this.logingIn = false;
        });
    }
    getUser() {
        return this.userService.getUserInfo(this.deckUrl);
    }
    getDeck() {
        return this.deckService.getDeck(this.deckUrl).pipe(tap((data) => {
            this.response = data;
            this.cardList = this.response.cards;
            this.limiters = {
                hero: this.response.cards.find((card) => card.keywords.includes('hero'))
            };
            this.checkValidity();
        }));
    }
    onKey(event) {
        const url = event.target.value;
        if (url.includes('fabdb.net/decks/') && url[url.length - 1] !== '/') {
            this.loginValue = url;
            this.deckUrl = url.substring(url.lastIndexOf('/') + 1);
        }
        else {
            this.loginValue = "";
            this.deckUrl = "";
        }
    }
    setUserName(event) {
        this.userName = event.target.value;
    }
    setPhone(event) {
        let phoneToCheck = event.target.value.replace(/\D/g, '');
        this.phone = phoneToCheck.length > 9 ? phoneToCheck : "";
    }
    quit(event) {
        this.response = new Object();
        this.isDeckValid = false;
    }
    saveSelectedCard(event) {
        this.cardSelected = event;
        this.userService.addCard(this.response.slug, this.cardSelected).subscribe(response => {
            console.log(response);
            this.login();
        }, error => {
            console.error(error);
        });
    }
    increaseLevel() {
        this.userService.addLevel(this.response.slug, this.userInfo.userLevel + 1)
            .subscribe(response => {
            console.log(response);
            this.login();
        }, error => {
            console.error(error);
        });
    }
    signUp() {
        this.userService.setUserInfo(this.userName, this.phone, this.response).subscribe(response => {
            console.log(response);
            this.login();
        }, error => {
            console.error(error);
        });
    }
    checkValidity() {
        let userLevel = this.userInfo ? this.userInfo.userLevel : 0;
        let cardsInDeck = [];
        let cardsOwned = [];
        let rareTotalCardCount = 0;
        let majesticTotalCount = 0;
        let rareCardCount = 0;
        let majesticCount = 0;
        for (let card of this.cardList) {
            if (!card.keywords.includes("hero")) {
                // Allows users to have up to 2 coppies of the slected card.
                if (!cardsInDeck.includes(card)) {
                    if (card.rarity === 'R') {
                        cardsInDeck.push(card);
                        rareCardCount++;
                    }
                    else if (card.rarity === 'M' || card.rarity === 'S' || card.rarity === 'L') {
                        cardsInDeck.push(card);
                        rareCardCount++;
                    }
                }
            }
            if (this.owenedCards.some(ownedCard => ownedCard.identifier.includes(card.identifier))) {
                if (card.rarity === 'R') {
                    cardsOwned.push(card);
                    rareTotalCardCount++;
                }
                else if (card.rarity === 'M' || card.rarity === 'S' || card.rarity === 'L') {
                    cardsOwned.push(card);
                    majesticTotalCount++;
                }
            }
        }
        let totalCount = rareTotalCardCount + majesticTotalCount;
        let cardCount = rareCardCount + majesticCount;
        if (cardCount <= userLevel) {
            this.isDeckValid = true;
            if ((cardCount + (this.owenedCards.length - totalCount)) < userLevel) {
                this.userInfo.needsToSelectNewCard = this.isLoggedIn ? true : false;
            }
        }
    }
};
FabMainComponent = __decorate([
    Component({
        selector: 'app-fab-main',
        standalone: true,
        imports: [CommonModule, CardSelectComponent, UserInfoComponent, NgxMaskDirective, NgxMaskPipe],
        providers: [provideNgxMask()],
        templateUrl: './fab-main.component.html',
        styleUrl: './fab-main.component.scss'
    })
], FabMainComponent);
export { FabMainComponent };
//# sourceMappingURL=fab-main.component.js.map