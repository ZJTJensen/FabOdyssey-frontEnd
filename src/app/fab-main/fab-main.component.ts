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
import { RulesComponent } from '../rules/rules.component';

@Component({
  selector: 'app-fab-main',
  standalone: true,
  imports: [CommonModule, CardSelectComponent, UserInfoComponent, NgxMaskDirective, NgxMaskPipe, RulesComponent],
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
  public cardsNotOwned: any = [];
  public loginAttempt: boolean = false;
  public logingIn: boolean = false;
  public loginValue: string = "";
  public userName: string = "";
  public isLoggedIn: boolean = false;
  public displayRules = false;
  public loginUrl: string = "https://fabdb.net/decks/";
  public selectedHero: any;

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
    this.loginUrl = url;
    if (url.includes('fabdb.net/decks/') && url[url.length - 1] !== '/') {
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
  toggleRules() {
    this.displayRules = !this.displayRules;
}

  public checkValidity() {
    let userLevel = this.userInfo ? this.userInfo.userLevel : 0;
    let cardsInDeck: any = [];
    this.cardsNotOwned = [];
    let rareTotalCardCount = 0;
    let majesticTotalCount = 0;
    let rareCardCount = 0;
    let majesticCount = 0;
    for (let card of this.cardList){
      if(card.keywords.includes("hero")) {
        this.selectedHero = card;
      } else {
        if(card.type.toLowerCase().includes('weapon') && card.rarity === 'R') {
          console.log('valid weapon')
        } 
        // Check if the card is of rarity 'R', 'M', 'S', or 'L'
        else if (['R', 'M', 'S', 'L'].includes(card.rarity)) {
            // Check if the card is in the owned cards list
            if(this.owenedCards.some(ownedCard => ownedCard.identifier.includes(card.identifier))){
                // Add the card to the deck
                cardsInDeck.push(card);
    
                // Update the count based on the card rarity
                if (card.rarity === 'R'){
                    rareCardCount++;
                    rareTotalCardCount++;
                } else {
                    majesticCount++;
                    majesticTotalCount++;
                }
            } else {
              this.cardsNotOwned.push(card);
            }
        }
    }
    }
    let totalCount = rareTotalCardCount + majesticTotalCount;
    let cardCount = rareCardCount + majesticCount;
    if(this.cardsNotOwned.length > 0) {
      this.isDeckValid = false;
    } else if (cardCount <= userLevel) {
      this.isDeckValid = true;
      let validOwnedCards = []
      this.owenedCards.forEach(card => {
        !card.toBeSelected ? validOwnedCards.push(card) : null;
      });
      if ((cardCount +  (validOwnedCards.length - totalCount)) < userLevel) {
        this.userInfo.needsToSelectNewCard = this.isLoggedIn ? true : false;
      }
    }
  }

}
