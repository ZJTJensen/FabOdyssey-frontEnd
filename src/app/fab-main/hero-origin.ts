import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
  })
export class HeroOrigin {
  constructor() {
  }


  private heros = [
    {"hero": "arakni", "origin": "thepits"},
    {"hero": "azalea", "origin": "thepits"},
    {"hero": "betsy", "origin": "solana"},
    {"hero": "bravo", "origin": "aria"},
    {"hero": "dash", "origin": "metrix"},
    {"hero": "dorinthea", "origin": "solana"},
    {"hero": "enigma", "origin": "misteria"},
    {"hero": "fai", "origin": "volcor"},
    {"hero": "kano", "origin": "volcor"},
    {"hero": "kassai", "origin": "volcor"},
    {"hero": "katsu", "origin": "misteria"},
    {"hero": "kayo", "origin": "savagelands"},
    {"hero": "levia", "origin": "demonastery"},
    {"hero": "maxx", "origin": "metrix"},
    {"hero": "Nuu", "origin": "misteria"},
    {"hero": "olympia", "origin": "solana"},
    {"hero": "prism", "origin": "solana"},
    {"hero": "rhinar", "origin": "savageLands"},
    {"hero": "riptide", "origin": "thepits"},
    {"hero": "boltyn", "origin": "solana"},
    {"hero": "teklovossen", "origin": "metrix"},
    {"hero": "uzuri", "origin": "thepits"},
    {"hero": "victor", "origin": "solana"},
    {"hero": "visserai", "origin": "demontastery"},
    {"hero": "vynnset", "origin": "demontastery"},
    {"hero": "zen", "origin": "misteria"},
    {"hero": "aurora", "origin": "aria"},
    {"hero": "benji", "origin": "misteria"},
    {"hero": "blaze", "origin": "volcor"},
    {"hero": "brevant", "origin": "solana"},
    {"hero": "briar", "origin": "aria"},
    {"hero": "data doll", "origin": "metrix"},
    {"hero": "dromai", "origin": "volcor"},
    {"hero": "oldhim", "origin": "aria"},
    {"hero": "emperor", "origin": "volcor"},
    {"hero": "florian", "origin": "aria"},
    {"hero": "genis", "origin": "solana"},
    {"hero": "kavdaen", "origin": "thepits"},
    {"hero": "lexi", "origin": "aria"},
    {"hero": "melody", "origin": "solana"},
    {"hero": "shiyana", "origin": "solana"},
    {"hero": "valda", "origin": "solana"},
    {"hero": "yoji", "origin": "volcor"},
    {"hero": "brutus", "origin": "solana"},
    {"hero": "squizzy", "origin": "solana"},
    {"hero": "taipanis", "origin": "volcor"},
    {"hero": "taylor", "origin": "solana"},
    {"hero": "theryon", "origin": "solana"},
    {"hero": "ruu'di", "origin": "solana"},
    {"hero": "yorick", "origin": "solana"}
  ];
  public getOrigin(hero: any): string {
    let origin='';
    for (let i = 0; i < this.heros.length; i++) {
      if (hero && hero.identifier.includes(this.heros[i].hero)) {
        origin =  this.heros[i].origin;
      }
    }
    return origin;
  }

}