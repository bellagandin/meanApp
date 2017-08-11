import { Component, OnInit, Input} from '@angular/core';
import {AuthenticateService} from '../../services/authenticate.service'
import {AppConfig} from '../../shared/AppConfig'
import {Http, Response} from '@angular/http';
import {Server} from "../../services/socket.service";

@Component({
  selector: 'app-user-resault',
  templateUrl: './user-resault.component.html',
  styleUrls: ['./user-resault.component.css'],
  providers: [Server]
})
export class UserResaultComponent implements OnInit {
  @Input()
  user: Object;
  api=AppConfig.API_ENDPOINT;
  follow:Boolean=false;
  connection;
  constructor(private auth:AuthenticateService,private http: Http, private server: Server) { }

  sendMessage(key) {
    console.log(key);
    this.server.sendMessage(key);

  }

  ngOnInit() {
    //console.log("test231",this.auth.getLogoedInUser());

    this.connection = this.server.getMessages('profile').subscribe(message => {
      //location.reload();
    });
    this.connection = this.server.getMessages('post').subscribe(message => {
     //location.reload();
    });
//check if the user is logged in
    if (this.auth.loggedIn()) {
    //check if I follow the user
    let user = this.auth.getLogoedInUser();
    console.log("in profile", this.user, user);
    if (!this.auth.checkLogoedInUser(this.user["user_name"])) {
      console.log("the user is not me!");

      console.log("the users", this.user);
      console.log("me", this.auth.getLogoedInUser());
      if (this.auth.getLogoedInUser()["followings"] != []) {
        let item_id = this.user["_id"];
        console.log("this.user",this.user);
        // console.log("test23",this.auth.getLogoedInUser()["followings"]);
        let tempo = this.auth.getLogoedInUser()["followings"].filter((item)=>{return item===item_id});
        //console.log("tempo",tempo);
        if(tempo.length!==0){
        //if (this.auth.getLogoedInUser()["followings"].indexOf(this.user["_id"]) > -1) {
          this.follow = true;

        }
      }
      }
    }
  }



  public addFollow() {
    let send = {"username": this.auth.getLogoedInUser()["user_name"],"following_email":this.user["email"]};
    console.log(send);
    this.http
    //post the form data to the url defined above and map the response. Then subscribe //to initiate the post. if you don't subscribe, angular wont post.
      .post('http://127.0.0.1:3001/users/addFollowing', send).map((res: Response) => res.json()).subscribe(
      //map the success function and alert the response
      (success) => {
        if(success.success) {
          console.log(success);
          this.follow = true;
          this.sendMessage('profile');
          localStorage.setItem('user', JSON.stringify(success.msg));
          this.follow = true;
        }
      },
      (error) => alert(error))

  }

  public removeFollow(){
    let send = {"username": this.auth.getLogoedInUser()["user_name"],"following_email":this.user["email"]};
    console.log(send);
    this.http
    //post the form data to the url defined above and map the response. Then subscribe //to initiate the post. if you don't subscribe, angular wont post.
      .post('http://127.0.0.1:3001/users/removeFollowing', send).map((res: Response) => res.json()).subscribe(
      //map the success function and alert the response
      (success) => {
        console.log(success);
        this.sendMessage('profile');
        localStorage.setItem('user',JSON.stringify(success.msg));
        this.follow=false;
      },
      (error) => alert(error))

  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

}
