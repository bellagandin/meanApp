import { Component, OnInit } from '@angular/core';
import {AuthenticateService } from '../../services/authenticate.service'
import {AppConfig} from '../../shared/AppConfig'
import {getPostsService} from '../../services/getPosts.service'
import {Post} from '../../shared/Post'
import {changeBG} from '../../services/changeBG.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
   api: string = AppConfig.API_ENDPOINT;
     allPosts: Array<Post>;




  constructor( private auth: AuthenticateService,
               private getPosts: getPostsService,
               private changer: changeBG) { }

  ngOnInit() {
    this.getPosts.getAllPosts().subscribe(
      data=>{
        this.allPosts=data.msg;
        this.allPosts.sort(function(postA:Post,postB:Post){ 
                if(postB.time>postA.time)
                return 1;
                else if(postB.time<postA.time)
                  return -1
                else
                  return 0;
              });
      });
    this.changer.changeBackground('#e8e8e8');
  }



  ngOnDestroy() {
    this.changer.restoreolderVer();
  }

}
