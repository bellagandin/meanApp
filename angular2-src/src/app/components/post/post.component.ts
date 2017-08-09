import { AuthenticateService } from '../../services/authenticate.service';
import { Component, OnInit,Input } from '@angular/core';
import {Post} from '../../shared/post'
import {AppConfig} from '../../shared/AppConfig'
import {getPostsService} from '../../services/getPosts.service'


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
  commentIn: String;
  like:boolean=false;


  description: Array<string>=[];
  showPost: boolean;
  constructor(private auth: AuthenticateService,
              private getP: getPostsService) {}
    ngOnInit() {
      this.showPost = false;
      console.log(this.thisPost.comments);
      console.log(this.auth.getLogoedInUser()["liked_posts"]);
       if (this.auth.getLogoedInUser()["liked_posts"] !== []) {
        if (this.auth.getLogoedInUser()["liked_posts"].indexOf(Post["id"]) > -1) {

          this.like = true;
          console.log(this.like);
        }
      }
    }

private showContent(){
  this.showPost=true;
}
private hideContent(){
  this.showPost=false;
}

addComment(){
  if(this.commentIn){
    let usr=this.auth.getLoggedInUser();
    let comment={
      post_id: this.thisPost._id,
      first_name:usr.first_name,
      last_name: usr.last_name,
      img_url:this.myImg,
      content:this.commentIn,
      user_name:usr.user_name
    }

    this.getP.addComment(comment).subscribe(
      data=>{
        console.log(data);
      }
    )



  }
}


}
