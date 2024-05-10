import { Component } from '@angular/core';
import { FabDbService } from '../service/fabDb.service';
import { UserService } from '../service/user.service';
import { Deck, Card } from '../models/fabDbDecks'; 
import { Card as FabCard } from "fab-cards";
import { CommonModule } from '@angular/common';
import { Observable, mergeMap, switchMap, tap } from 'rxjs';
import { CardSelectComponent } from '../card-select/card-select.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { UserInfoComponent } from '../user-info/user-info.component';

@Component({
  selector: 'app-fab-main',
  standalone: true,
  imports: [CommonModule, CardSelectComponent, UserInfoComponent, NgxMaskDirective, NgxMaskPipe],
  providers: [provideNgxMask()],
  templateUrl: './fab-main.component.html',
  styleUrl: './fab-main.component.scss'
})
export class FabMainComponent {

  public deckService: FabDbService;
  public userService: UserService;
  constructor(deckService: FabDbService, userService: UserService){
    this.deckService = deckService,
    this.userService = userService;
  }
  public response: any = new Object() as Deck;
  public deckUrl: string = "";
  public cardList: Array<any> = new Array<any>();
  public owenedCards: Array<any> = new Array<any>();
  public cardSelected: FabCard = new Object() as FabCard;
  public limiters: any = new Object();
  public users: any;
  public isDeckValid: boolean = false;
  public userInfo: any;
  public phone: any = "";
  public loginAttempt: boolean = false;
  public logingIn: boolean = false;
  public loginValue: string = "";
  public userName: string = "";
  public isLoggedIn: boolean = false;

  public login() {
    this.logingIn = true;
    this.getUser().pipe(
      tap(userAndDeck => {
        this.userInfo = userAndDeck.user.slug ? userAndDeck.user : undefined;
        this.isLoggedIn = this.userInfo ? true : false;
        this.owenedCards = userAndDeck.cards.length > 0 ? userAndDeck.cards : this.owenedCards;
      }),
      switchMap(() => {
        this.logingIn = false;
        return this.getDeck();
      })
    ).subscribe(
      () => {
        this.loginAttempt = true;
        this.logingIn = false;
      },
      error => {
        this.loginAttempt = true;
        this.logingIn = false;
      }
    );
  }
  

  public getUser(): Observable<any>{
    return this.userService.getUserInfo(this.deckUrl);
  }

  public getDeck(): Observable<Deck> {
    return this.deckService.getDeck(this.deckUrl).pipe(
      tap((data: Deck) => {
        this.response = data;
        this.cardList = this.response.cards;
        this.limiters = {
          hero: this.response.cards.find((card: Card) => card.keywords.includes('hero'))
        }
        this.checkValidity();
      })
    );
  }
  
  public onKey(event: any){
    const url = (event.target as HTMLInputElement).value;
    if (url.includes('fabdb.net/decks/build/') && url[url.length - 1] !== '/') {
      this.loginValue = url;
      this.deckUrl = url.substring(url.lastIndexOf('/') + 1);
    } else {
      this.loginValue = "";
      this.deckUrl = "";
    }
  }

  public setUserName(event: any){
    this.userName = event.target.value;
  }

  public setPhone(event: any){
    let phoneToCheck = event.target.value.replace(/\D/g, '');
    this.phone = phoneToCheck.length > 9 ? phoneToCheck : "";
  }

  public quit(event: string){
    this.response = new Object() as Deck;
    this.isDeckValid = false;
  }
  public saveSelectedCard(event: FabCard){
    this.cardSelected = event;
    this.userService.addCard(this.response.slug, this.cardSelected).subscribe(
      response => {
          console.log(response);
          this.login();
      },
      error => {
          console.error(error);
      }
  );
  }

  public increaseLevel(){
    this.userService.addLevel(this.response.slug, this.userInfo.userLevel + 1)
    .subscribe(
        response => {
            console.log(response);
            this.login();
        },
        error => {
            console.error(error);
        }
    );
  }

  public signUp(){
    this.userService.setUserInfo(this.userName, this.phone, this.response).subscribe(
      response => {
          console.log(response);
          this.login();
      },
      error => {
          console.error(error);
      }
  );
  }

  public checkValidity() {
    let userLevel = this.userInfo ? this.userInfo.userLevel : 0;
    let cardsInDeck: any = [];
    let cardsOwned: any = [];
    let rareTotalCardCount = 0;
    let majesticTotalCount = 0;
    let rareCardCount = 0;
    let majesticCount = 0;
    for (let card of this.cardList){
      if(!card.keywords.includes("hero")) {
        // Allows users to have up to 2 coppies of the slected card.
        if (!cardsInDeck.includes(card)) {
          if (card.rarity === 'R'){
            cardsInDeck.push(card);
            rareCardCount++;
          } else if (card.rarity === 'M' || card.rarity === 'S'|| card.rarity === 'L'){
            cardsInDeck.push(card);
            rareCardCount++;
          }
       }
      }
      
      if(this.owenedCards.some(ownedCard => ownedCard.identifier.includes(card.identifier))){
        if (card.rarity === 'R'){
          cardsOwned.push(card);
          rareTotalCardCount++;
        } else if (card.rarity === 'M' || card.rarity === 'S'|| card.rarity === 'L') {
          cardsOwned.push(card);
          majesticTotalCount++;
        }
      }
    }
    let totalCount = rareTotalCardCount + majesticTotalCount;
    let cardCount = rareCardCount + majesticCount;
    if (cardCount <= userLevel) {
      this.isDeckValid = true;
      if ((cardCount +  (this.owenedCards.length - totalCount)) < userLevel) {
        this.userInfo.needsToSelectNewCard = this.isLoggedIn ? true : false;
      }
    }
  }

}
