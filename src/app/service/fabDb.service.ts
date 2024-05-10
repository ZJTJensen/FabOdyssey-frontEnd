import { Injectable } from '@angular/core';
import { Deck } from '../models/fabDbDecks';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Card } from 'fab-cards';

@Injectable({
  providedIn: 'root'
})
export class FabDbService {
  private http: HttpClient;
  constructor(http: HttpClient) { 
    this.http = http;
  }

  configUrl = 'https://api.fabdb.net/';

getDeck(deckUrl: string): Observable<Deck> {
  return this.http.get<Deck>(this.configUrl + "decks/"+ deckUrl);
}

getCardData(cardUrl: string): Observable<Card> {
  return this.http.get<Card>(this.configUrl + "cards/"+ cardUrl);
}

getImageUrl(imageString: string): String {
  let newImage = "https://fabdb2.imgix.net/cards/printings/" + imageString + ".png?w=400&fit=clip&auto=compress,format";
  return newImage
}

}
