import {Component, OnInit, HostBinding, OnDestroy, ElementRef} from '@angular/core';
import {AuthenticateService} from '../../services/authenticate.service';
import {Router} from '@angular/router';
import {Http, Response} from '@angular/http';
import {Post} from '../../shared/post';
import {DateFormatPipe} from 'angular2-moment';
import {changeBG} from '../../services/changeBG.service'
import {ActivatedRoute} from '@angular/router';
import {FileUploader} from 'ng2-file-upload/ng2-file-upload';
import {AppConfig} from "../../shared/AppConfig";
import {FlashMessagesService} from 'angular2-flash-messages';
import {Server} from "../../services/socket.service";
import {getPostsService} from '../../services/getPosts.service'
import {userInfo} from "os";
import {User} from "../../shared/User";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [Server],
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: Object;
  currPost: Post;
  bgColor;
  connection;
  desiredUser: String;
  showInput: Boolean = false;
  api: string = AppConfig.API_ENDPOINT;
  uploader: FileUploader = new FileUploader({url: "add", itemAlias: 'myPicture'});
  edit: Boolean = false;
  follow: Boolean = false;
  myPosts: Array<Post>;
  showPst:Array<Post>;
  showFollowing:Boolean=false;
  UserFollowings:Array<User>;

  constructor(private auth: AuthenticateService,
              private router: Router,
              private http: Http,
              private changer: changeBG,
              private el: ElementRef,
              private flasher: FlashMessagesService,
              private server: Server,
              private route: ActivatedRoute,
              public flash : FlashMessagesService,
              private getPosts: getPostsService) {
  }

  sendMessage(key) {
    console.log(key);
    this.server.sendMessage(key);

  }


  ngOnInit() {



    ///subscribe to changes
    this.route.params.subscribe(params => {
          this.showFollowing=false;
          this.connection = this.server.getMessages('profile').subscribe(message => {
          //console.log("get emit from the server");
          this.auth.getProfile(this.desiredUser).subscribe(
            profile => {
              console.log(profile.user);
              this.user = profile.user;
              //this.sendMessage('profile');
              //let finalString = JSON.stringify(this.user);
                //localStorage.setItem('user', finalString);
            },
            err => {
              console.log(err);
            });
        });

        this.connection = this.server.getMessages('post').subscribe(message => {
          this.auth.getProfile(this.user["user_name"]).subscribe(
            profile => {
              console.log(profile.user);
              this.user = profile.user;
              //this.sendMessage('profile');
              //let finalString = JSON.stringify(this.user);
              //localStorage.setItem('user', finalString);
            },
            err => {
              console.log(err);
            });

        });

      this.connection = this.server.getMessages('profile').subscribe(message => {
        //console.log("get post");
        //location.reload();
        this.auth.getProfile(this.user["user_name"]).subscribe(
          profile => {
            console.log(profile.user);
            this.user = profile.user;
            //this.sendMessage('profile');
            //let finalString = JSON.stringify(this.user);
            //localStorage.setItem('user', finalString);
          },
          err => {
            console.log(err);
          });

      });
        this.uploader.onAfterAddingFile = (file) => {
          file.withCredentials = false;
        };
        this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
          console.log("ImageUpload:uploaded:", item, status, response);
        };
        this.bgColor = "#e8e8e8";




      this.desiredUser = params['username'];
          this.auth.getProfile(this.desiredUser).subscribe(
      profile => {
        console.log(profile.user);
        this.user = profile.user;
        this.getPosts.getUserPost(profile.user._id).subscribe(
            data=>{
              console.log("userPost",data.msg);
              this.myPosts=data.msg;
              this.myPosts.sort(function(postA:Post,postB:Post){
                if(postB.time>postA.time)
                return 1;
                else if(postB.time<postA.time)
                  return -1
                else
                  return 0;
              });

            },
            err=>{console.log(err);}
          );

      },
      err => {
        console.log(err);
      });


          this.changer.changeBackground('#e8e8e8');

      // let myjson=this.http.get('../assets/post.json')
      // .map(res=>res.json()).subscribe(
      //   (data)=>{
      //     this.currPost=JSON.parse(JSON.stringify(data));
      //     console.log(this.currPost);
      //   });


      console.log("check for edit",this.edit);
      //check if I follow the user
      console.log("in profile",this.desiredUser);
      if (!this.auth.checkLogoedInUser(this.desiredUser)) {
        console.log("the user is not me!");
        this.auth.getProfile(this.desiredUser).subscribe(
          profile => {
            console.log("the users",profile.user);
            console.log("me",this.auth.getLogoedInUser());
            if(this.auth.getLogoedInUser()["followings"]!=[]) {
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
          },
          err => {
            console.log(err);
          });
      }



    });//end of subscribe to param


  }  ///end of on init

  public changePic() {
    this.showInput = true;
  }

  ischildUpdate(isIt: Boolean) {
    this.edit = false;
  }

  upload() {
    //locate the file element meant for the file upload.
    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#myPicture');
    //get the total amount of files attached to the file input.
    let fileCount: number = inputEl.files.length;
    //create a new fromdata instance
    let formData = new FormData();
    //check if the filecount is greater than zero, to be sure a file was selected.
    if (fileCount > 0) { // a file was selected
      //append the key name 'photo' with the first file in the element
      formData.append('photos', inputEl.files.item(0));
      //call the angular http method
      this.http
      //post the form data to the url defined above and map the response. Then subscribe //to initiate the post. if you don't subscribe, angular wont post.
        .post(this.api+'users/upload/' + this.user["_id"], formData).map((res: Response) => res.json()).subscribe(
        //map the success function and alert the response
        (success) => {
          console.log(success.msg);
            this.sendMessage('profile');
          this.sendMessage('post');
          if(success.msg!=null) {
            localStorage.setItem('user', JSON.stringify(success.msg));
          }
          this.showInput = false;
        },
        (error) => alert(error))
    }
  }


  public addFollow() {
    let send = {"username": this.auth.getLogoedInUser()["user_name"],"following_email":this.user["email"]};
    console.log(send);
    this.http
    //post the form data to the url defined above and map the response. Then subscribe //to initiate the post. if you don't subscribe, angular wont post.
      .post(this.api+'users/addFollowing', send).map((res: Response) => res.json()).subscribe(
      //map the success function and alert the response
      (success) => {
        console.log(success);
        if(success.success) {
          this.follow = true;
          this.sendMessage('profile');
          localStorage.setItem('user', JSON.stringify(success.msg));
          this.follow = true;
        }
        else {
          this.flash.show(success.msg,{cssClass:'alert-danger',timeout:3000});
        }
      },
      (error) => alert(error))


  }

  public removeFollow(){
    let send = {"username": this.auth.getLogoedInUser()["user_name"],"following_email":this.user["email"]};
    console.log(send);
    this.http
    //post the form data to the url defined above and map the response. Then subscribe //to initiate the post. if you don't subscribe, angular wont post.
      .post(this.api+'users/removeFollowing', send).map((res: Response) => res.json()).subscribe(
      //map the success function and alert the response
      (success) => {
        console.log(success);
        this.sendMessage('profile');
        localStorage.setItem('user',JSON.stringify(success.msg));
        this.follow=false;
      },
      (error) => alert(error))

  }

  public showEdit(){
    this.edit=true;
    this.showFollowing=false;
    console.log("hello",this.edit,this.showFollowing);

  }

  public showFollowingButten(){
    this.edit=false;
    this.showFollowing=true;
    console.log("hello",this.edit,this.showFollowing, this.auth.getLogoedInUser()["followings"]);

    this.http
    //post the form data to the url defined above and map the response. Then subscribe //to initiate the post. if you don't subscribe, angular wont post.
      .post(this.api+'users/getMyFollowings', {ids:this.auth.getLogoedInUser()["followings"]}).map((res: Response) => res.json()).subscribe(
      //map the success function and alert the response
      (success) => {
        console.log(">>>>>",success);
        if( success.success){
          this.UserFollowings=success.msg;
        }



      },
      (error) => alert(error));

}


  ngOnDestroy() {
    this.changer.restoreolderVer();
    this.connection.unsubscribe();
  }

}
