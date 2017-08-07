import { Component, OnInit,HostBinding,OnDestroy,ElementRef} from '@angular/core';
import { AuthenticateService} from '../../services/authenticate.service';
import {Router} from '@angular/router';
import {Http,Response} from '@angular/http';
import {Post} from '../../shared/post';
import {DateFormatPipe} from 'angular2-moment';
import {changeBG} from '../../services/changeBG.service'
import { ActivatedRoute } from '@angular/router';
import {  FileUploader } from 'ng2-file-upload/ng2-file-upload';
import {AppConfig} from "../../shared/AppConfig";


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
  showInput : Boolean= false;
  uploader:FileUploader = new FileUploader({url: "add", itemAlias: 'myPicture'});



  constructor(private auth : AuthenticateService,
              private router : Router,
              private http: Http,
              private changer : changeBG,
              private el: ElementRef,
            private route: ActivatedRoute) { }

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file)=> { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
      console.log("ImageUpload:uploaded:", item, status, response);
    };
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
  public changePic(){
    this.showInput=true;
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
      formData.append('phothos', inputEl.files.item(0));
      //call the angular http method
      this.http
      //post the form data to the url defined above and map the response. Then subscribe //to initiate the post. if you don't subscribe, angular wont post.
        .post(AppConfig.API_ENDPOINT+'profilepic', formData).map((res:Response) => res.json()).subscribe(
        //map the success function and alert the response
        (success) => {
          alert(success._body);
        },
        (error) => alert(error))
    }
  }


  ngOnDestroy(){
    this.changer.restoreolderVer();
  }

}
