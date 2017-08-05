import { Component, OnInit } from '@angular/core';
import { AuthenticateService} from '../../services/authenticate.service';
import {Router} from '@angular/router';
import {Http} from '@angular/http';
import {Post} from '../../shared/post';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: Object
  currPost: Post;

  constructor(private auth : AuthenticateService,
              private router : Router,
              private http: Http) { }

  ngOnInit() {
    this.auth.getProfile().subscribe(
      profile=>{
        console.log(profile.user);
        this.user=profile.user;

      },
    err=>{
      console.log(err);
    });

    // let myjson=this.http.get('../assets/post.json')
    // .map(res=>res.json()).subscribe(
    //   (data)=>{
    //     this.currPost=JSON.parse(JSON.stringify(data));
    //     console.log(this.currPost);
    //   });

  }

}
