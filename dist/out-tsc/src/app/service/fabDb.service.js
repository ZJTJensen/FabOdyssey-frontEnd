import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let FabDbService = class FabDbService {
    constructor(http) {
        this.configUrl = 'https://api.fabdb.net/';
        this.http = http;
    }
    getDeck(deckUrl) {
        return this.http.get(this.configUrl + "decks/" + deckUrl);
    }
    getCardData(cardUrl) {
        return this.http.get(this.configUrl + "cards/" + cardUrl);
    }
    getImageUrl(imageString) {
        let newImage = "https://fabdb2.imgix.net/cards/printings/" + imageString + ".png?w=400&fit=clip&auto=compress,format";
        return newImage;
    }
};
FabDbService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], FabDbService);
export { FabDbService };
//# sourceMappingURL=fabDb.service.js.map