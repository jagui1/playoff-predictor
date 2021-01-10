import { Game } from "./Game";

export interface Entry {
    afcWinner: string,
    nfcWinner: string,
    sbWinner: string,
    wildcards: Game[]
}