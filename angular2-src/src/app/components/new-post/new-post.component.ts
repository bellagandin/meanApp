import { Component, OnInit,ElementRef } from '@angular/core';
import {Ingridient} from '../../shared/Ingridient';
import {Step} from '../../shared/Step'
import {  FileUploader } from 'ng2-file-upload/ng2-file-upload';
import {AppConfig} from '../../shared/AppConfig'
import {Http,Response} from '@angular/http'



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
  imageN: number = 1;
  constructor(private http: Http,private el: ElementRef ) { }

  ngOnInit( ) {
  }


  public AddIngridient(){
    this.ingridients.push({amount:0 , name:""});
  }
    public AddStep(){
    this.steps.push({stepNumber:this.stepN,description:""});
    this.stepN++;
  }
    public addPhoto(){
      this.imageId.push("photo "+this.imageN);
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
    
    let formData = new FormData();
    formData.append("postnumber","1q22e3eeer");

    for(var i=1;i<this.imageId.length-1;i++){
    //locate the file element meant for the file upload.
        let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#photo '+i);
    //get the total amount of files attached to the file input.
        let fileCount: number = inputEl.files.length;
    //create a new fromdata instance
      
    //check if the filecount is greater than zero, to be sure a file was selected.
        if (fileCount > 0) { // a file was selected
            //append the key name 'photo' with the first file in the element
                formData.append('photo '+i, inputEl.files.item(0));
            //call the angular http method
          }
        }
        this.http
        //post the form data to the url defined above and map the response. Then subscribe //to initiate the post. if you don't subscribe, angular wont post.
        .post(AppConfig.UPLOADS_PATH, formData).map((res:Response) => res.json()).subscribe(
                //map the success function and alert the response
                 (success) => {
                         alert(success._body);
                },
                (error) => alert(error))
    }

}
