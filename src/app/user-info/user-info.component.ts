import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FabDbService } from '../service/fabDb.service';
import { UserService } from '../service/user.service';
import { CardSelectComponent } from '../card-select/card-select.component';
import { Card, cards } from 'fab-cards';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CommonModule, CardSelectComponent],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss'
})
export class UserInfoComponent implements OnInit {
  @Input() userInfo: any;
  @Input() isDeckValid: any;
  @Input() logingIn: any;
  @Input() limiters: any;
  @Input() owenedCards: any;
  @Input() cardList: Array<any> = [];
  @Input() cardsNotOwned: Array<any> = [];
  @Output() quit = new EventEmitter<string>();
  @Output() selectedCard = new EventEmitter<Card>();
  @Output() increaseLevel = new EventEmitter<Card>();

  public deckService: FabDbService;
  public userService: UserService;
  public listOfUsersInBracket: Array<any> = [];
  public displayOwnedCards: boolean = false;
  public displayCardsNotOwned: boolean = false;
  constructor(deckService: FabDbService, userService: UserService) {
    this.deckService = deckService,
    this.userService = userService
  }
  public ngOnInit(): void {
    // this.getUsersInBracket(this.userInfo.user);
  }
  increaseUserLevel() {
    this.increaseLevel.emit();
  }
  public quitFunc(event: string) {
    this.quit.emit(event);
  }
  public saveSelectedCardFunc(event: Card) {
    this.selectedCard.emit(event)
  }
  public getUsersInBracket(users: any) {
    this.listOfUsersInBracket = [0, 2]
    return true;
  }

  public getCardImage(cardIdentifier: any) {
    let cardUrl: any;
    cards.forEach(card => { 
      if (card.cardIdentifier.includes(cardIdentifier)) {
          if(!card.defaultImage.includes('.png')) {
              let cardLocation = card.defaultImage.split('.');
              cardUrl = this.deckService.getImageUrl(cardLocation[0]);
          } else {
              cardUrl = card.defaultImage;
          }
      }
    });
    return cardUrl || '';
  }

}
