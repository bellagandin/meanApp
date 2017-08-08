import { AppConfig } from '../shared/AppConfig';
import { Component, OnInit,Input } from '@angular/core';
import {Http,Headers} from '@angular/http'


@Component({
  selector: 'app-tester',
  templateUrl: './tester.component.html',
  styleUrls: ['./tester.component.css']
})
export class TesterComponent implements OnInit  {
    currPost:Object;

    constructor(private http: Http) {}

    ngOnInit(){
      let headers=new Headers();
      headers.append('Content-Type','application/json');
      let userid=JSON.parse(localStorage.getItem('user')).id;

      this.http.post(AppConfig.API_ENDPOINT+'users/getMyPost',{user_id: userid},{headers: headers})
      .map(res=>res.json()).subscribe(
        data=>{
          this.currPost=data.msg[0];
          console.log(data.msg[0]);
        },
        err=>{

        });
    }

   

 

 
}
