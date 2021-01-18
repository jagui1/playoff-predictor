import { PlayoffWeek } from "./PlayoffWeek";

export interface Entry {
    afcWinner: string,
    nfcWinner: string,
    sbWinner: string,
    weeks: PlayoffWeek[]
}