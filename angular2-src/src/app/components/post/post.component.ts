import { AuthenticateService } from '../../services/authenticate.service';
import { Component, OnInit,Input } from '@angular/core';
import {Post} from '../../shared/post'
import {AppConfig} from '../../shared/AppConfig'


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input()
  thisPost: Post;
  postDescription: Array<String>=[];
  api=AppConfig.API_ENDPOINT;
  myImg=this.auth.getLoggedInUser().img_url;
  
  
  description: Array<string>=[];
  showPost: boolean;
  constructor(private auth: AuthenticateService) {}  
    ngOnInit() {
      this.showPost=false;
      console.log(this.myImg)
    }

private showContent(){
  this.showPost=true;
}
private hideContent(){
  this.showPost=false;
}

  
}
