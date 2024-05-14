import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let UserService = class UserService {
    constructor(http) {
        this.http = http;
    }
    getUserInfo(userKey) {
        let userRequest = {
            slug: userKey
        };
        return this.http.post('https://fabodyssey-backend-3878f5102434.herokuapp.com/user/fetch', userRequest);
    }
    setUserInfo(userKey, phoneNumber, deck) {
        let userRequest = {
            user: userKey,
            phoneNumber: phoneNumber,
            deck: deck
        };
        return this.http.post('https://fabodyssey-backend-3878f5102434.herokuapp.com/user/create', userRequest);
    }
    addCard(userKey, card) {
        let userRequest = {
            slug: userKey,
            card: card
        };
        return this.http.post('https://fabodyssey-backend-3878f5102434.herokuapp.com/user/card', userRequest);
    }
    getUseresInBracked(userKey) {
        let userRequest = {
            user: userKey
        };
        return this.http.post('https://fabodyssey-backend-3878f5102434.herokuapp.com/user/usersInBracket', userRequest);
    }
    getUsers() {
        return this.http.get('https://fabodyssey-backend-3878f5102434.herokuapp.com/user/loggedInUsers');
    }
    addLevel(slug, newLevel) {
        let userRequest = {
            slug: slug,
            userLevel: newLevel
        };
        return this.http.post('https://fabodyssey-backend-3878f5102434.herokuapp.com/user/addLevel', userRequest);
    }
};
UserService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], UserService);
export { UserService };
//# sourceMappingURL=user.service.js.map