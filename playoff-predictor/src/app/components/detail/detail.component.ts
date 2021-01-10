import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../entities/User';
import { Entry } from '../../entities/Entry';
import { ApiService } from 'src/app/api.service';
import { Game } from 'src/app/entities/Game';

type Champion = {style: string, answer: string, final: string};
type PredictGame = Array<{teams: string, winner: string, style: string}>;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  
  week: number;
  user: User;
  name: string;
  results: Entry;
  games: PredictGame = [];
  afc: Champion;
  nfc: Champion;
  sb: Champion;

  constructor(private route: ActivatedRoute, private data: ApiService) { 
    this.route.params.subscribe( params => this.name = params.id );
  }

  ngOnInit() {
    this.data.getResults().subscribe(res => this.results = res);

    this.week = 0;

    this.data.getUsers().subscribe(
      res => {
        let tmp = res.find(tmp => tmp.name === this.name);
        this.user = tmp;

        this.user.score = this.calcScoreVerbose(this.user.entry, this.week);
      } 
    );
  }

  calcScoreVerbose(entry: Entry, week: number) : number{
    let wildcards : Game[] = entry.wildcards;
    let actualWC : Game[] = this.results.wildcards;
    this.games = [];
    let total : number = 0;

    if(entry.afcWinner === this.results.afcWinner){
      this.afc = {
        "style": "correct",
        "answer": entry.afcWinner,
        "final": this.results.afcWinner
      }
      total += 5;
    } else {
      this.afc = {
        "style": "unanswered",
        "answer": entry.afcWinner,
        "final": this.results.afcWinner
      }
    }

    if(entry.nfcWinner === this.results.nfcWinner){
      this.nfc = {
        "style": "correct",
        "answer": entry.nfcWinner,
        "final": this.results.nfcWinner
      }
      total += 5;
    } else {
      this.nfc = {
        "style": "unanswered",
        "answer": entry.nfcWinner,
        "final": this.results.nfcWinner
      }
    }

    if(entry.sbWinner === this.results.sbWinner){
      this.sb = {
        "style": "correct",
        "answer": entry.sbWinner,
        "final": this.results.sbWinner
      }
      total += 5;
    } else {
      this.sb = {
        "style": "unanswered",
        "answer": entry.sbWinner,
        "final": this.results.sbWinner
      }
    }

    for(let i=0; i < actualWC.length; i++){
      if(wildcards[i].winner === actualWC[i].winner){
        total += 1;
        this.games.push(
          { 
            "teams": actualWC[i].away + " @ " + actualWC[i].home,
            "winner": wildcards[i].winner,
            "style": "correct"
          }
        );

      } else {
        this.games.push(
          {
            "teams": wildcards[i].away + " @ " + actualWC[i].home,
            "winner": wildcards[i].winner,
            "style": "incorrect"
          }
        );
      }
    }
    return total;
  }

}
