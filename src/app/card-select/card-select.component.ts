import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Card, cards } from "fab-cards";
import { FabDbService } from '../service/fabDb.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-card-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-select.component.html',
  styleUrl: './card-select.component.scss'
})
export class CardSelectComponent implements OnInit{
  @Input() cardLimiters: any;
  @Input() cardList: Array<any> = [];
  @Input() selectedHero: any;
  @Input() userInfo: any;
  @Input() owenedCards: any;
  @Output() quit = new EventEmitter<string>();
  @Output() selectedCard = new EventEmitter<Card>();
  public selectedHeroTrue: any;
  public userService: UserService;
  private fabDbService: FabDbService;
  constructor(fabDbService: FabDbService, userService: UserService){
    this.fabDbService = fabDbService;
    this.userService = userService;
  }
  public validCards: any = new Array();
  public validRareCards: any = new Array();
  public validMajesticCards: any = new Array();
  public cardsToShow: any = new Array();
  ngOnInit(): void{
   cards.forEach(card => {
      if(card.cardIdentifier === this.selectedHero.identifier) {
        this.selectedHeroTrue = card;
      }
    });
    if(!this.userInfo.selectCard) {
      this.createCardList();
      for (let i =0;i < 3;) {
        if(this.userInfo.userLevel % 5 === 0){
          let response = this.pullCard();
          if(this.owenedCards.some((card : any) => response.cardIdentifier.includes(card.identifier))){
            console.log("Card already in deck")
          }
          else if(( response.types.includes("Action")) ) {
            console.log("Invalid card pulled")
          } else if (response.types.includes('Weapon') && response.rarity === 'Rare') {
            console.log("Invalid weapon pulled")
          } else if(response.types.includes("Equipment") || response.types.includes("Weapon")){
            if(response.talents == null || response.talents.some((talent: any) => this.selectedHero.keywords.includes(talent))){
              if(!this.cardsToShow.includes(response)){
                i++;
                if(!response.defaultImage.includes('.png')) {
                  let cardLocation = response.defaultImage.split('.');
                  response.defaultImage = this.fabDbService.getImageUrl(cardLocation[0]);
                }else {
                  console.log("Image already in correct format")
                }
                this.cardsToShow.push(response);
              }
            }
          }

        } else {
          let response = this.pullCard();
          if(this.owenedCards.some((card : any) => response.cardIdentifier.includes(card.identifier))){
            console.log("Card already in deck")
          }
          else if((response.types.includes("Equipment") && !response.types.includes("Action")) || response.types.includes('Weapon')) {
            console.log("Invalid card pulled")
          } else {
            if(response.talents == null || (response.talents.some((talent: any) => this.selectedHeroTrue.talents.includes(talent)) || response)){
              if(!this.cardsToShow.includes(response)){
                i++;
                if(!response.defaultImage.includes('.png')) {
                  let cardLocation = response.defaultImage.split('.');
                  response.defaultImage = this.fabDbService.getImageUrl(cardLocation[0]);
                }else {
                  console.log("Image already in correct format")
                }
                this.cardsToShow.push(response);
              }
            } 
            // else if (response.) {

            // }
          }
        }
      }
      this.userService.addSelectCard(this.userInfo.slug, this.cardsToShow).subscribe();
    } else {
      this.userService.getSelectCard(this.userInfo.slug).subscribe((selectCard: any) => {
        selectCard.forEach((cardToSelect: any) => {
          cards.forEach(card =>{
            if (card.cardIdentifier.includes(cardToSelect.cardIdentifier)) {
              this.cardsToShow.push(card);
            }
          });
          console.log('test');
        });
        this.cardsToShow.forEach((card: any)  => {
          if(!card.defaultImage.includes('.png')) {
            let cardLocation = card.defaultImage.split('.');
            card.defaultImage = this.fabDbService.getImageUrl(cardLocation[0]);
          }
        });
      });
     
    }
  }

  public createCardList(){
    cards.forEach(card => {
      card.keywords?.forEach(keyword => {
        const text = card.functionalText;
        let rarity: String = card.rarity;
        let isHeroType = false
        let isClass = false;
        
        // card.talents?.forEach(talents => { 
        //   if(this.selectedHeroTrue.talents.includes(talents)) {
        //     isClass = true;
        //   }
        // });
        card.classes.find(cls => this.selectedHeroTrue.classes.forEach((keyword: string) => {
          if(cls === keyword) {
            isHeroType = true;
          }
        }));
        this.selectedHeroTrue.talents?.forEach((talents: any) => {
          if((card.talents?.includes(talents) || card.fusions?.includes(talents)) && (card.classes[0] == "NotClassed" || isHeroType)) {
            isClass = true;
          }
        });

        if((card.rarity === "Majestic" || card.rarity === "Super Rare" ||
            card.rarity === "Rare")){
          if(rarity === "Super Rare") {
            rarity = "Majestic";
          } 
          if((isHeroType && !isClass) || (isHeroType || (isHeroType && isClass) || (isClass && card.classes.find(cls => cls === "Generic")))){
            
            if(text?.includes("Specialization")) {
              let cardSpec= card.specializations;
              if(cardSpec != undefined && this.cardLimiters.hero.name.includes(cardSpec[0])) {
                (this as any)["valid" + rarity + "Cards"].push(card);
              }
            }else { 
              (this as any)["valid" + rarity + "Cards"].push(card);
            }
          } else if(card.classes.find(cls => cls === "Generic")) {
            (this as any)["valid" + rarity + "Cards"].push(card);
          } else if (isClass) {
            (this as any)["valid" + rarity + "Cards"].push(card);
          }
        }
        });
      });
  }

  public pullCard() {
    const randomNumber = Math.random(); 
    let card;
    if (randomNumber < 0.9 && this.validRareCards.length > 0) {
      card = this.validRareCards[Math.floor(Math.random() * this.validRareCards.length)];
    } else if (this.validMajesticCards.length > 0) {
      card = this.validMajesticCards[Math.floor(Math.random() * this.validMajesticCards.length)];
    }
    return card;
  }

  public choseCard(card: Card){
  // this.fabDbService.getCardData(card.setIdentifiers[0]).subscribe((data: Card) => {
    this.selectedCard.emit(card);
  // });
  }

  public returnHome(){
    this.quit.emit('quit');
  }
}
