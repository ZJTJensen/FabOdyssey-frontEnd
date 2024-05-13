import { __decorate } from "tslib";
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { cards } from "fab-cards";
let CardSelectComponent = class CardSelectComponent {
    constructor(fabDbService) {
        this.cardList = [];
        this.quit = new EventEmitter();
        this.selectedCard = new EventEmitter();
        this.validCards = new Array();
        this.validRareCards = new Array();
        this.validMajesticCards = new Array();
        this.cardsToShow = new Array();
        this.fabDbService = fabDbService;
    }
    ngOnInit() {
        this.cresteCardList();
        for (let i = 0; i < 3;) {
            let response = this.pullCard();
            if (this.cardList.some(card => card.identifier === response.identifier)) {
                console.log("Card already in deck");
            }
            else if ((response.types.includes("Equipment") && !response.types.includes("Action")) || response.types.includes('Weapon')) {
                console.log("Invalid card pulled");
            }
            else {
                i++;
                if (!response.defaultImage.includes('.png')) {
                    let cardLocation = response.defaultImage.split('.');
                    response.defaultImage = this.fabDbService.getImageUrl(cardLocation[0]);
                }
                else {
                    console.log("Image already in correct format");
                }
                this.cardsToShow.push(response);
            }
        }
    }
    cresteCardList() {
        cards.forEach(card => {
            card.keywords?.forEach(keyword => {
                const text = card.functionalText;
                let rarity = card.rarity;
                let isHeroType = false;
                let isClass = false;
                card.talents?.forEach(talents => {
                    if (this.cardLimiters.hero.keywords.includes(talents.toLowerCase())) {
                        isClass = true;
                    }
                });
                card.classes.find(cls => this.cardLimiters.hero.keywords.forEach((keyword) => {
                    if (cls.toLowerCase() === keyword.toLowerCase()) {
                        isHeroType = true;
                    }
                }));
                if ((card.rarity === "Majestic" || card.rarity === "Super Rare" ||
                    card.rarity === "Rare")) {
                    if (rarity === "Super Rare") {
                        rarity = "Majestic";
                    }
                    if ((isHeroType && !isClass) || (isHeroType || (isHeroType && isClass) || (isClass && card.classes.find(cls => cls === "Generic")))) {
                        if (text?.includes("Specialization")) {
                            let cardSpec = card.specializations;
                            if (cardSpec != undefined && this.cardLimiters.hero.name.includes(cardSpec[0])) {
                                this["valid" + rarity + "Cards"].push(card);
                            }
                        }
                        else {
                            this["valid" + rarity + "Cards"].push(card);
                        }
                    }
                    else if (card.classes.find(cls => cls === "Generic")) {
                        this["valid" + rarity + "Cards"].push(card);
                    }
                }
            });
        });
    }
    pullCard() {
        const randomNumber = Math.random();
        let card;
        if (randomNumber < 0.9 && this.validRareCards.length > 0) {
            card = this.validRareCards[Math.floor(Math.random() * this.validRareCards.length)];
        }
        else if (this.validMajesticCards.length > 0) {
            card = this.validMajesticCards[Math.floor(Math.random() * this.validMajesticCards.length)];
        }
        return card;
    }
    choseCard(card) {
        // this.fabDbService.getCardData(card.setIdentifiers[0]).subscribe((data: Card) => {
        this.selectedCard.emit(card);
        // });
    }
    returnHome() {
        this.quit.emit('quit');
    }
};
__decorate([
    Input()
], CardSelectComponent.prototype, "cardLimiters", void 0);
__decorate([
    Input()
], CardSelectComponent.prototype, "cardList", void 0);
__decorate([
    Output()
], CardSelectComponent.prototype, "quit", void 0);
__decorate([
    Output()
], CardSelectComponent.prototype, "selectedCard", void 0);
CardSelectComponent = __decorate([
    Component({
        selector: 'app-card-select',
        standalone: true,
        imports: [CommonModule],
        templateUrl: './card-select.component.html',
        styleUrl: './card-select.component.scss'
    })
], CardSelectComponent);
export { CardSelectComponent };
//# sourceMappingURL=card-select.component.js.map