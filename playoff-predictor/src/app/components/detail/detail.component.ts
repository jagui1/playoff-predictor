import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../entities/User';
import { Entry } from '../../entities/Entry';
import { ApiService } from 'src/app/api.service';
import { Game } from 'src/app/entities/Game';
import { PlayoffWeek } from 'src/app/entities/PlayoffWeek';

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

    this.week = 2;

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
    let curWeek: PlayoffWeek = entry.weeks[week];
    let resWeek: PlayoffWeek = this.results.weeks[week];

    if(curWeek.afcWinner === resWeek.afcWinner){
      this.afc = {
        "style": this.CORRECT,
        "answer": curWeek.afcWinner,
        "final": resWeek.afcWinner
      }
      total += 5;
    } else if (this.results.eliminated.includes(curWeek.afcWinner)){
      this.afc = {
        "style": this.INCORRECT,
        "answer": curWeek.afcWinner,
        "final": resWeek.afcWinner
      }
    } else {
      this.afc = {
        "style": this.UNANSWERED,
        "answer": curWeek.afcWinner,
        "final": resWeek.afcWinner
      }
    }

    if(curWeek.nfcWinner === resWeek.nfcWinner){
      this.nfc = {
        "style": this.CORRECT,
        "answer": curWeek.nfcWinner,
        "final": resWeek.nfcWinner
      }
      total += 5;
    } else if (this.results.eliminated.includes(curWeek.nfcWinner)){
      this.nfc = {
        "style": this.INCORRECT,
        "answer": curWeek.nfcWinner,
        "final": resWeek.nfcWinner
      }
    } else {
      this.nfc = {
        "style": this.UNANSWERED,
        "answer": curWeek.nfcWinner,
        "final": resWeek.nfcWinner
      }
    }

    if(curWeek.sbWinner === resWeek.sbWinner){
      this.sb = {
        "style": this.CORRECT,
        "answer": curWeek.sbWinner,
        "final": resWeek.sbWinner
      }
      total += 5;
    } else if (this.results.eliminated.includes(curWeek.sbWinner)){
      this.sb = {
        "style": this.INCORRECT,
        "answer": curWeek.sbWinner,
        "final": resWeek.afcWinner
      }
    } else {
      this.sb = {
        "style": this.UNANSWERED,
        "answer": curWeek.sbWinner,
        "final": resWeek.sbWinner
      }
    }

    let allGames : Game[] = [];
    let allResults : Game[] = [];

    for(let j in entry.weeks){
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
