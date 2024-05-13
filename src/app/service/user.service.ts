import { Injectable } from '@angular/core';
import { Deck } from '../models/fabDbDecks';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Card } from 'fab-cards';

@Injectable({
    providedIn: 'root'
  })
  export class UserService {
    private http: HttpClient;
    constructor(http: HttpClient) { 
      this.http = http;
    }

    public getUserInfo(userKey: string): Observable<any> {
      let userRequest = {
        slug: userKey
      }
      return this.http.post<any>('https://fabodyssey-backend-3878f5102434.herokuapp.com/user/fetch', userRequest)
    }
    public setUserInfo(userKey: string, phoneNumber: number, deck: Deck): Observable<any> {
      let userRequest = {
        user: userKey,
        phoneNumber: phoneNumber,
        deck: deck
      }
      return this.http.post<any>('https://fabodyssey-backend-3878f5102434.herokuapp.com/user/create', userRequest)
    }
    public addCard(userKey: string, card: Card): Observable<any> {
      let userRequest = {
        slug: userKey,
        card: card
      }
      return this.http.post<any>('https://fabodyssey-backend-3878f5102434.herokuapp.com/user/card', userRequest)
    }

    public getUseresInBracked(userKey: string): Observable<any> {
      let userRequest = {
        user: userKey
      }
      return this.http.post<any>('https://fabodyssey-backend-3878f5102434.herokuapp.com/user/usersInBracket', userRequest)
    }

    public getUsers(): Observable<any> {
      return this.http.get<any>('https://fabodyssey-backend-3878f5102434.herokuapp.com/user/loggedInUsers')
    }

    public addLevel(slug: string, newLevel: number): Observable<any> {
      let userRequest = {
          slug: slug,
          userLevel: newLevel
      }
      return this.http.post<any>('https://fabodyssey-backend-3878f5102434.herokuapp.com/user/addLevel', userRequest)
  }
}