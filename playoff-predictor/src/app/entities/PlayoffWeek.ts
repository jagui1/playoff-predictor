import { Game } from "./Game";

export interface PlayoffWeek {
    weekName: string,
    afcWinner: string,
    nfcWinner: string,
    sbWinner: string,
    games: Game[]
}