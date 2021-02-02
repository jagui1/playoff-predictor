import { Entry } from './Entry';

export interface User {
    name: string;
    nickname: string;
    score: number;
    scores: number[];
    positions: number[];
    entry: Entry;
}
