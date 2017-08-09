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

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.selectedValue = params['selectedValue'];
      this.searchQuery = params['searchQuery'];
      console.log(this.selectedValue,this.searchQuery);

      let send = {type:this.selectedValue, value:this.searchQuery};
      this.http
      //post the form data to the url defined above and map the response. Then subscribe //to initiate the post. if you don't subscribe, angular wont post.
        .post('http://127.0.0.1:3001/users/search', send).map((res: Response) => res.json()).subscribe(
        //map the success function and alert the response
        (success) => {
          console.log(success);
          this.users = success.msg;
        },
        (error) => alert(error));
    });

  }

}
