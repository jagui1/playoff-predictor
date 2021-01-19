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
  CORRECT: string = "correct";
  INCORRECT: string = "incorrect";
  UNANSWERED: string =  "unanswered";
  
  week: number;
  user: User;
  name: string;
  results: Entry;
  games: PredictGame[] = [];
  afc: Champion;
  nfc: Champion;
  sb: Champion;

  constructor(private route: ActivatedRoute, private data: ApiService) { 
    this.route.params.subscribe( params => this.name = params.id );
  }

  ngOnInit() {
    this.data.getResults().subscribe(res => this.results = res);

    this.week = 1;

    this.data.getUsers().subscribe(
      res => {
        let tmp = res.find(tmp => tmp.name === this.name);
        this.user = tmp;

        this.user.score = this.calcScoreVerbose(this.user.entry, this.week);
      } 
    );
  }

  calcScoreVerbose(entry: Entry, week: number) : number{   

    this.games = [];
    let total : number = 0;

    if(entry.afcWinner === this.results.afcWinner){
      this.afc = {
        "style": this.CORRECT,
        "answer": entry.afcWinner,
        "final": this.results.afcWinner
      }
      total += 5;
    } else if (this.results.eliminated.includes(entry.afcWinner)){
      this.afc = {
        "style": this.INCORRECT,
        "answer": entry.afcWinner,
        "final": this.results.afcWinner
      }
    } else {
      this.afc = {
        "style": this.UNANSWERED,
        "answer": entry.afcWinner,
        "final": this.results.afcWinner
      }
    }

    if(entry.nfcWinner === this.results.nfcWinner){
      this.nfc = {
        "style": this.CORRECT,
        "answer": entry.nfcWinner,
        "final": this.results.nfcWinner
      }
      total += 5;
    } else if (this.results.eliminated.includes(entry.nfcWinner)){
      this.nfc = {
        "style": this.INCORRECT,
        "answer": entry.nfcWinner,
        "final": this.results.nfcWinner
      }
    } else {
      this.nfc = {
        "style": this.UNANSWERED,
        "answer": entry.nfcWinner,
        "final": this.results.nfcWinner
      }
    }

    if(entry.sbWinner === this.results.sbWinner){
      this.sb = {
        "style": this.CORRECT,
        "answer": entry.sbWinner,
        "final": this.results.sbWinner
      }
      total += 5;
    } else if (this.results.eliminated.includes(entry.sbWinner)){
      this.sb = {
        "style": this.INCORRECT,
        "answer": entry.sbWinner,
        "final": this.results.afcWinner
      }
    } else {
      this.sb = {
        "style": this.UNANSWERED,
        "answer": entry.sbWinner,
        "final": this.results.sbWinner
      }
    }

    let allGames : Game[] = [];
    let allResults : Game[] = [];

    for(let j in this.results.weeks){
      allGames = entry.weeks[j].games;
      allResults = this.results.weeks[j].games;
      this.games.push([]);
      

      for(let i in allResults){
        if(allGames[i].winner === allResults[i].winner){
          total += 1;
          this.games[j].push(
            { 
              "teams": allResults[i].away + " @ " + allResults[i].home,
              "winner": allGames[i].winner,
              "style": this.CORRECT
            }
          );

        } else {
          this.games[j].push(
            {
              "teams": allGames[i].away + " @ " + allResults[i].home,
              "winner": allGames[i].winner,
              "style": this.INCORRECT
            }
          );
        }
      }
  }
    return total;
  }

}
