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
        return this.http.post('http://localhost:8080/user/fetch', userRequest);
    }
    setUserInfo(userKey, phoneNumber, deck) {
        let userRequest = {
            user: userKey,
            phoneNumber: phoneNumber,
            deck: deck
        };
        return this.http.post('http://localhost:8080/user/create', userRequest);
    }
    addCard(userKey, card) {
        let userRequest = {
            slug: userKey,
            card: card
        };
        return this.http.post('http://localhost:8080/user/card', userRequest);
    }
    getUseresInBracked(userKey) {
        let userRequest = {
            user: userKey
        };
        return this.http.post('http://localhost:8080/user/usersInBracket', userRequest);
    }
    getUsers() {
        return this.http.get('http://localhost:8080/user/loggedInUsers');
    }
    addLevel(slug, newLevel) {
        let userRequest = {
            slug: slug,
            userLevel: newLevel
        };
        return this.http.post('http://localhost:8080/user/addLevel', userRequest);
    }
};
UserService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], UserService);
export { UserService };
//# sourceMappingURL=user.service.js.map