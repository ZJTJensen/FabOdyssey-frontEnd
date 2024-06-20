import { Component, Inject, OnInit } from '@angular/core';
import { FabDbService } from '../service/fabDb.service';
import { UserService } from '../service/user.service';
import { HeroOrigin } from './hero-origin';
import { Deck, Card } from '../models/fabDbDecks'; 
import { Card as FabCard } from "fab-cards";
import { CommonModule } from '@angular/common';
import { Observable, mergeMap, switchMap, tap } from 'rxjs';
import { CardSelectComponent } from '../card-select/card-select.component';
import { WorldMapComponent } from '../world-map/world-map.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { UserInfoComponent } from '../user-info/user-info.component';
import { RulesComponent } from '../rules/rules.component';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Renderer2, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';




@Component({
  selector: 'app-fab-main',
  standalone: true,
  imports: [CommonModule, CardSelectComponent, UserInfoComponent,
    WorldMapComponent, NgxMaskDirective, NgxMaskPipe, RulesComponent,],
  providers: [provideNgxMask()],
  templateUrl: './fab-main.component.html',
  styleUrl: './fab-main.component.scss'
})
export class FabMainComponent implements OnInit{

  public deckService: FabDbService;
  public userService: UserService;
  public heroOrigin: HeroOrigin;

  constructor(deckService: FabDbService, userService: UserService,
    heroOrigin: HeroOrigin,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document, private renderer: Renderer2, private el: ElementRef){
    this.deckService = deckService,
    this.userService = userService;
    this.heroOrigin = heroOrigin;
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
  public showNav = false;
  public showMap = false;

  public ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if(localStorage.getItem('isLoggedIn')){
        this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' ? true : false;
        if(this.isLoggedIn) {
          this.userInfo = localStorage.getItem('userInfo');
          let cards = localStorage.getItem('owenedCards');
          if (cards) { 
            this.owenedCards = JSON.parse(cards) === "" ? [] : JSON.parse(cards);
          }
          if(this.userInfo) {
            this.userInfo = JSON.parse(this.userInfo);
            this.deckUrl = this.userInfo.slug;
            if(this.userInfo.originlocation) {
              this.changeImage(this.userInfo.originlocation);
            }
            this.getDeck().subscribe();
          }
        }
      }
    }

  }

  public login() {
    this.getUser().pipe(
      tap(userAndDeck => {
        this.userInfo = userAndDeck.user.slug ? userAndDeck.user : undefined;
        localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
        if(this.userInfo) {
          this.loginSession();
        } 
        this.owenedCards = userAndDeck.cards.length > 0 ? userAndDeck.cards : this.owenedCards;
        localStorage.setItem('owenedCards', JSON.stringify(this.owenedCards));
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
    let area = this.heroOrigin.getOrigin(this.selectedHero);
    this.userService.setUserInfo(this.userName, this.phone, this.response, area).subscribe(
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

  toggleNav() {
    this.showNav = !this.showNav;
  }

  toggleMap() {
    this.showMap = !this.showMap;
    if(this.showNav) {
      this.toggleNav();
    }
  }
  changeMap(area: string){
    if(area){
      // this.userService.setLocation(this.userInfo.slug, area).subscribe();
      this.changeImage(area);
    }
  }
  changeImage(area: string) {
    // Assuming you have a method to get the image URL based on the area
    const imageUrl = 'assets/world-imgs/'+area.toLowerCase()+'.jpg';

    // Get a reference to the body element
    const body = this.document.body;
    // Change the background image of the body
    this.renderer.setStyle(body, 'backgroundImage', `url(${imageUrl})`);
     // Set the height of the background image to 100%
    this.renderer.setStyle(body, 'height', '100%');
    this.renderer.setStyle(body, 'backgroundPosition', 'center');
    this.renderer.listen(body, 'mousemove', (event) => {
      // Calculate the background position based on the mouse coordinates
      const xPos = (event.clientX / window.innerWidth - 0.5) * 40; // 40 instead of 50 to limit to 20px
      const yPos = (event.clientY / window.innerHeight - 0.5) * 40; // 40 instead of 50 to limit to 20px
    
      // Limit the movement to 20px in either direction
      const limitedXPos = Math.max(-20, Math.min(20, xPos));
      const limitedYPos = Math.max(-20, Math.min(20, yPos));
    
      // Update the background position
      this.renderer.setStyle(body, 'backgroundPosition', `calc(50% + ${limitedXPos}px) calc(50% + ${limitedYPos}px)`);
    });

}
  
  loginSession() {
    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedIn = true;
      localStorage.setItem('isLoggedIn', this.isLoggedIn.toString());
    }
  }
  logoutSession() {
    if (isPlatformBrowser(this.platformId)) {
      this.clearBackgroundImage();
      this.isLoggedIn = false;
      localStorage.clear();
      location.reload();
    }
  }

  clearBackgroundImage() {
    // Get a reference to the body element
    const body = this.document.body;
  
    // Remove the background image
    this.renderer.removeStyle(body, 'backgroundImage');
  
    // Remove the mousemove event listener
    this.renderer.listen(body, 'mousemove', () => {});
  }


  handleAreaClicked(area: string) {
    switch(area) {
      case 'exit':
        this.toggleMap();
        break;
      case 'solana':
        this.toggleMap();
        this.changeMap(area);
        break;
      case 'thePitts':
        this.toggleMap();
        this.changeMap(area);
        break;
      case 'metrix':
        this.toggleMap();
        this.changeMap(area);
        break;
      case 'savageLands':
        this.toggleMap();
        this.changeMap(area);
        break;
      case 'aria':
        this.toggleMap();
        this.changeMap(area);
        break;
      case 'misteria':
        this.toggleMap();
        this.changeMap(area);
        break;
      case 'volcor':
        this.toggleMap();
        this.changeMap(area);
        break;
      case 'demonastery':
        this.toggleMap();
        this.changeMap(area);
        break;
      default:
        break;
    }
  }

}
