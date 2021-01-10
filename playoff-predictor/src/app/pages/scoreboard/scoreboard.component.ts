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

  users: User[];
  results: Entry;
  week: number;

  constructor(private data: ApiService) { }

  ngOnInit(): void {

    this.data.getResults().subscribe(res => this.results = res);

    this.week = 0;

    this.data.getUsers().subscribe(
      data => {
        this.users = data;
        for(let i=0; i<this.users.length; i++){
          for(let j=0; j<1; j++){
            this.users[i].scores.push(this.calcScore(this.users[i].entry, j));
          }
          this.users[i].score = this.calcScore(this.users[i].entry, this.week)
        }
      }
    )
  }

  calcScore(entry: Entry, week: number) : number{
    let wildcards : Game[] = entry.wildcards;
    let actualWC : Game[] = this.results.wildcards;
    let total : number = 0;

    if(entry.afcWinner === this.results.afcWinner){
      total += 5;
    }


    if(entry.nfcWinner === this.results.nfcWinner){
      total += 5;
    }


    if(entry.sbWinner === this.results.sbWinner){
      total += 10;
    }

    for(let i=0; i < wildcards.length; i++){
      if(wildcards[i].winner === actualWC[i].winner){
        total += 1;
      }
    }
    return total;
  }

}
