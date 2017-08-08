import { Component, OnInit,ElementRef } from '@angular/core';
import {Ingridient} from '../../shared/Ingridient';
import {Step} from '../../shared/Step'
import {  FileUploader } from 'ng2-file-upload/ng2-file-upload';
import {AppConfig} from '../../shared/AppConfig'
import {Http,Response} from '@angular/http'
import {PublishPostService} from '../../services/publish-post.service'



@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {
  ingridients: Array<Ingridient>=[];
  steps: Array<Step>=[];
  images: Array<FileUploader>=[];
  imageId: Array<String>=[];
  stepN:number=1;
  stepsN: Array<number>=[];
  imageN: number = 1;
  
  //post details
  recipe_title: String;
  category: String;
  co_author: Array<any>;   //array containing all co-authors
  description: string;


  constructor(private http: Http,private el: ElementRef,private publisher: PublishPostService ) { }

  ngOnInit(  ) {
  }


  public AddIngridient(){
    this.ingridients.push({amount:0 , name:""});
  }
    public AddStep(){
    this.steps.push({stepNumber:this.stepN,description:""});
    this.stepN++;
  }


  public removeStep(st){
    var temp = this.ingridients.indexOf(st);
    this.steps.splice(temp,1);
    this.stepN--;
    for(var i=0;i<this.steps.length;i++){
      this.steps[i].stepNumber=i+1;
    }
}

  public removeIng(ing){
  var temp = this.ingridients.indexOf(ing);
  this.ingridients.splice(temp,1);
  
}
  public removeImg(img){
    var temp = this.images.indexOf(img);
    this.images.splice(temp,1);

    for(var i=0;i < this.images.length;i++){
      this.imageId[i]="photo"+(i+1);
    }
    
  }

    public addPhoto(){
      this.imageId.push("photo"+this.imageN);
      this.imageN++;
      this.images.push(new FileUploader({url:AppConfig.UPLOADS_PATH,itemAlias:"photo"}));
      this.images[this.images.length-1].onAfterAddingFile = (file)=> { file.withCredentials = false; };
      this.images[this.images.length-1].onCompleteItem =(item:any, response:any, status:any, headers:any) => {
              console.log("ImageUpload:uploaded:", item, status, response);
    }
  }

  getimageID(img){

    return this.images.indexOf(img);
  }
  
  
  public publishPost(){
    let thisUser=JSON.parse(localStorage.getItem('user'));
    
    let post={
      time:new Date(),
      first_name:thisUser.first_name,
      last_name:thisUser.last_name,
      user_id:thisUser.id,
      recipe_title:this.recipe_title,
      category:"desserts",
      main_img:"",
      user_img:thisUser.img_url,
      description:this.description,
      co_author: [],
      ingredients: this.ingridients,
      instructions: this.steps
    }
    console.log(post);
    this.publisher.publish(post).subscribe(
      data=>{
        console.log(data.msg.post_id);
        this.addPhotos(data.msg.post_id);
      },
      err=>{
        console.log(err);
      });

  }

trackByFn(index: any, item: any) {
   return index;
}
  
  
  
  public addPhotos(postId:String){

    let formData = new FormData();
    let mainphEl: HTMLInputElement = this.el.nativeElement.querySelector('#mainImage');
    if(mainphEl.files.length>0)
      formData.append('photos',mainphEl.files.item(0),mainphEl.files.item(0).name);
    for(var i=1;i<=this.imageId.length;i++){
    //locate the file element meant for the file upload.
        let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#photo'+i);
    //get the total amount of files attached to the file input.
        let fileCount: number = inputEl.files.length;
    //create a new fromdata instance

    //check if the filecount is greater than zero, to be sure a file was selected.
        if (fileCount > 0) { // a file was selected
            //append the key name 'photo' with the first file in the element
                formData.append('photos', inputEl.files.item(0),inputEl.files.item(0).name);
            //call the angular http method
          }
        }
        this.publisher.addPhotos(formData,postId).subscribe( sucssess=>{
          alert(sucssess);
        },err=>{alert(err)});
    }

}
