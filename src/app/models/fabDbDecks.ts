export interface CardStats {
    cost: string;
    defense: string;
    resource: string;
}

export interface Card {
    identifier: string;
    name: string;
    rarity: string;
    stats: CardStats;
    text: string;
    keywords: string[];
    flavour: string;
    comments: string;
    image: string;
    total: number;
}

export interface Deck {
    slug: string;
    name: string;
    format: string;
    notes: string | null;
    visibility: string;
    cardBack: number;
    createdAt: string;
    totalVotes: number;
    myVote: number;
    cards: Card[];
    sideboard: Card[];
}