import { Component, OnInit } from '@angular/core';
import {Http, Response} from '@angular/http';
import {Server} from "../../services/socket.service";
import {AuthenticateService} from '../../services/authenticate.service';
import {AppConfig} from "../../shared/AppConfig";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [Server]
})
export class HomeComponent implements OnInit {
  mostLikeUsers;
  mostLikedRecipes;
  api=AppConfig.API_ENDPOINT;
  follow:Boolean=false;
  connection;
  constructor(private http: Http,
              private auth: AuthenticateService,
              private server: Server) { }

  sendMessage(key) {
    console.log(key);
    this.server.sendMessage(key);

  }

  ngOnInit() {
    this.connection = this.server.getMessages('post').subscribe(message => {
      console.log("hptpost");
      //location.reload();
    });
    this.connection = this.server.getMessages('profile').subscribe(message => {
      //location.reload();
    });
    //check if the user is logged in
    if (this.auth.loggedIn()) {
      //for most Liked Recipes
      let send = {user_id: this.auth.getLogoedInUser()["_id"]};
      console.log("send", send);
      this.http
      //post the form data to the url defined above and map the response. Then subscribe //to initiate the post. if you don't subscribe, angular wont post.
        .post('http://127.0.0.1:3001/users/LikedPost/', send).map((res: Response) => res.json()).subscribe(
        //map the success function and alert the response
        (success) => {
          console.log(success.msg);
          this.mostLikedRecipes = success.msg;

        },
        (error) => alert(error));

      // for most Like Users
      let send2 = {user_id: this.auth.getLogoedInUser()["_id"]};
      console.log("send", send2);
      this.http
      //post the form data to the url defined above and map the response. Then subscribe //to initiate the post. if you don't subscribe, angular wont post.
        .post('http://127.0.0.1:3001/users/LikedUsers', send2).map((res: Response) => res.json()).subscribe(
        //map the success function and alert the response
        (success) => {
          console.log("hello", success.msg, typeof success.msg);
          this.mostLikeUsers = success.msg;

        },
        (error) => alert(error));

    }

  }



}
