import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';

import { TableModule } from 'primeng/table';

import { Entry } from 'src/app/entities/Entry';
import { User } from 'src/app/entities/User';
import { Game } from 'src/app/entities/Game';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css']
})
export class ScoreboardComponent implements OnInit {

  WILDCARD = 0;
  DIVISIONAL = 1;

  users: User[];
  results: Entry;
  week: number;

  constructor(private data: ApiService) { }

  ngOnInit(): void {

    this.data.getResults().subscribe(res => this.results = res);

    this.week = this.DIVISIONAL;

    this.data.getUsers().subscribe(
      data => {
        this.users = data;
        for(let i=0; i<this.users.length; i++){
          for(let j=0; j<=this.week; j++){
            this.users[i].scores.push(this.calcScore(this.users[i].entry, j));
          }
          this.users[i].score = this.calcScore(this.users[i].entry, this.week)
        }
      }
    )
  }

  calcScore(entry: Entry, week: number) : number{
    let total : number = 0;

    let allGames : Game[] = [];
    let allResults : Game[] = [];

    for(let i = 0; i <= week; i++){
      allGames = allGames.concat(entry.weeks[i].games);
      allResults = allResults.concat(this.results.weeks[i].games);
    }  

    if(entry.afcWinner === this.results.afcWinner){
      total += 5;
    }


    if(entry.nfcWinner === this.results.nfcWinner){
      total += 5;
    }


    if(entry.sbWinner === this.results.sbWinner){
      total += 10;
    }

    for(let i in allGames){
      if(allGames[i].winner === allResults[i].winner){
        total += 1;
      }
    }
    return total;
  }

}
