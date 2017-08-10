import { Component, OnInit } from '@angular/core';
import {Http, Response} from '@angular/http';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-search-resault',
  templateUrl: './search-resault.component.html',
  styleUrls: ['./search-resault.component.css']
})
export class SearchResaultComponent implements OnInit {

  constructor(private http: Http,private route: ActivatedRoute) { }

  selectedValue;
  searchQuery;
  users=[];
  posts=[];
  isUser:boolean=false;
  isPost:Boolean=false;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.selectedValue = params['selectedValue'];
      switch (this.selectedValue){
        case "user":
          this.isUser=true;
          this.isPost=false;
          break;
        case "title":
        case "text":
          this.isUser=false;
          this.isPost=true;
          break;
      }
      console.log("isUser",this.isUser,"isPost",this.isPost);
      this.searchQuery = params['searchQuery'];
      console.log(this.selectedValue,this.searchQuery);

      let send = {type:this.selectedValue, value:this.searchQuery};
      this.http
      //post the form data to the url defined above and map the response. Then subscribe //to initiate the post. if you don't subscribe, angular wont post.
        .post('http://127.0.0.1:3001/users/search', send).map((res: Response) => res.json()).subscribe(
        //map the success function and alert the response
        (success) => {
          console.log(success);
          if(this.isUser) {
            this.users = success.msg;
          }
          else {
            this.posts = success.msg;
          }
        },
        (error) => alert(error));
    });

  }

}
