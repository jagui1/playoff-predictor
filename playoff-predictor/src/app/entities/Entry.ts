import { PlayoffWeek } from "./PlayoffWeek";

export interface Entry {
    eliminated: string[],
    weeks: PlayoffWeek[]
}