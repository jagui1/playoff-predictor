import { Entry } from './Entry';

export interface User {
    name: string;
    nickname: string;
    score: number;
    scores: number[];
    entry: Entry;
}
