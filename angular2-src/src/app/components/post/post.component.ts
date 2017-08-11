import { AuthenticateService } from '../../services/authenticate.service';
import { Component, OnInit,Input } from '@angular/core';
import {Post} from '../../shared/post'
import {AppConfig} from '../../shared/AppConfig'
import {getPostsService} from '../../services/getPosts.service'
import {Server} from "../../services/socket.service";
import {Http, Response} from '@angular/http';
import{Router} from '@angular/router'
import {PostEditService} from '../../services/post-edit.service'

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
  providers: [Server],
})
export class PostComponent implements OnInit {
  @Input()
  thisPost: Post;
  @Input()
  edit;
  postDescription: Array<String>=[];
  api=AppConfig.API_ENDPOINT;
  myImg=this.auth.getLoggedInUser().img_url;
  commentIn: String;
  like:boolean=false;
  showComment: boolean=false;
  connection;

  description: Array<string>=[];
  showPost: boolean;
  constructor(private auth: AuthenticateService,
              private getP: getPostsService,
              private http: Http,
              private server: Server,
              private router: Router,
              private editP: PostEditService) {
              }

  sendMessage(key) {
    console.log(key);
    this.server.sendMessage(key);

  }

    ngOnInit() {

      this.connection = this.server.getMessages('profile').subscribe(message => {

      });
      this.connection = this.server.getMessages('post').subscribe(message => {
        //location.reload();
        //console.log("get emit from the server");
        let send = {post_id:this.thisPost["_id"]};
        this.http.post('http://127.0.0.1:3001/posts/getSinglePost', send).map((res: Response) => res.json()).subscribe(
          //map the success function and alert the response
          (success) => {
            console.log(success.msg);
            this.thisPost=success.msg;
            location.reload();
          },
          (error) => alert(error));


      });
      this.showPost = false;
      console.log("comment",this.thisPost.comments);
      console.log("like",this.auth.getLogoedInUser()["liked_posts"]);
       if (this.auth.getLogoedInUser()["liked_posts"] !== []) {
         let s = ""+this.thisPost["_id"];
         console.log("s",s);
         let temp = this.auth.getLogoedInUser()["liked_posts"].filter((item)=>{
           return item== this.thisPost["_id"];
           }
         );
         if (temp.length!==0){
        // if (s in this.auth.getLogoedInUser()["liked_posts"]) {
        // if (this.auth.getLogoedInUser()["liked_posts"].indexOf(this.thisPost["_id"])) {

          this.like = true;
          console.log(this.like);
        }
     }


    }
private showComments(){
  this.showComment=!this.showComments;
}

private editPost(){
  this.router.navigate(['/EditPost',this.thisPost._id]);
}


private showContent(){
  this.showPost=true;
}
private hideContent(){
  this.showPost=false;
}
public updateComment(){
  this.getP.getSinglePostByID(this.thisPost._id).subscribe(
    data=>{
      console.log("return post is");
      console.log(data);
      this.thisPost=data.msg;
      this.sendMessage('post');
    }
  )
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
      user_name:usr.user_name,
      time: new Date()
    };

    this.getP.addComment(comment).subscribe(
      data=>{
        if(data.success)
          this.updateComment();
      }
    )



  }
}

public editLike(){
  if (!this.like)
  {//addlike
    console.log("@#",this.thisPost );
    let send = {post_id:this.thisPost["_id"],user_name:this.auth.getLogoedInUser()["user_name"] };
    console.log("send",send);
    this.http.post('http://127.0.0.1:3001/posts/likedPost', send).map((res: Response) => res.json()).subscribe(
      //map the success function and alert the response
      (success) => {
       if(success.success) {
         localStorage.setItem('user', JSON.stringify(success.msg));
         console.log(success.msg);
         this.like = true;
         localStorage.setItem('user', JSON.stringify(success.msg));
         this.sendMessage('post');
         // this.http.get('http://127.0.0.1:3001/users/profile/:' + this.auth.getLogoedInUser()["user_name"]).map((res: Response) => res.json()).subscribe(
         //   //map the success function and alert the response
         //   (success) => {
         //     if (success.success) {
         //       console.log(success.msg);
         //
         //       localStorage.setItem('user', JSON.stringify(success.msg));
         //       console.log(success.msg);
         //       this.like = true;
         //       this.sendMessage('post');
         //     }
         //   });
       }

      });
  }
  else{//dislike
    console.log("@#",this.thisPost );
    let send = {post_id:this.thisPost["_id"],user_name:this.auth.getLogoedInUser()["user_name"]};
    console.log("send",send);
    this.http.post('http://127.0.0.1:3001/posts/disLike', send).map((res: Response) => res.json()).subscribe(
      //map the success function and alert the response
      (success) => {
        if(success.success) {
                localStorage.setItem('user', JSON.stringify(success.msg));
                console.log(success.msg);
                this.like = true;
                localStorage.setItem('user', JSON.stringify(success.msg));
                this.sendMessage('post');
          // this.http.get('http://127.0.0.1:3001/users/profile/:' + this.auth.getLogoedInUser()["user_name"]).map((res: Response) => res.json()).subscribe(
          //   //map the success function and alert the response
          //   (success) => {
          //     if (success.success) {
          //       console.log(success.msg);
          //
          //       localStorage.setItem('user', JSON.stringify(success.msg));
          //       console.log(success.msg);
          //       this.like = true;
          //       this.sendMessage('post');
          //     }
          //   });
        }
      },
      (error) => alert(error))
 }
}

public delPost(){
  let send = {post_id:this.thisPost["_id"],user_name:this.auth.getLogoedInUser()["user_name"]};
  console.log("delPost",send);
  this.http.post('http://127.0.0.1:3001/posts/removePost', send).map((res: Response) => res.json()).subscribe(
    //map the success function and alert the response
    (success) => {
      if(success.success) {
        console.log(success.msg);
        this.sendMessage('post');
      }
    },
    (error) => alert(error))
}
}
