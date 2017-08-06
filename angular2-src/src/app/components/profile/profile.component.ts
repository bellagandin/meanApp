import { Component, OnInit,HostBinding,OnDestroy } from '@angular/core';
import { AuthenticateService} from '../../services/authenticate.service';
import {Router} from '@angular/router';
import {Http} from '@angular/http';
import {Post} from '../../shared/post';
import {DateFormatPipe} from 'angular2-moment';
import {changeBG} from '../../services/changeBG.service'
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit,OnDestroy {
  user: Object
  currPost: Post;
  @HostBinding('style.background-color')    
  bgColor;
  desiredUser: String;

  constructor(private auth : AuthenticateService,
              private router : Router,
              private http: Http,
              private changer : changeBG,
            private route: ActivatedRoute) { }

  ngOnInit() {
    this.bgColor= "#e8e8e8";
      this.route.params.subscribe(params => {
       this.desiredUser = params['username']; 
    });
    this.auth.getProfile(this.desiredUser).subscribe(
      profile=>{
        console.log(profile.user);
        this.user=profile.user;

      },
    err=>{
      console.log(err);
    });
    this.changer.changeBackground('#e8e8e8');

    // let myjson=this.http.get('../assets/post.json')
    // .map(res=>res.json()).subscribe(
    //   (data)=>{
    //     this.currPost=JSON.parse(JSON.stringify(data));
    //     console.log(this.currPost);
    //   });

  }
  ngOnDestroy(){
    this.changer.restoreolderVer();
  }

}
