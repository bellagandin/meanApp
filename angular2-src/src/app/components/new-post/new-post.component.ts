import {Ingridient} from '../../shared/Ingridient';
import {Step} from '../../shared/Step'
import {  FileUploader } from 'ng2-file-upload/ng2-file-upload'
import { Http, Response } from '@angular/http';
import { Component, OnInit, ElementRef, Input } from '@angular/core';
const URL = 'http://localhost:3001/posts/uploadMainImg';
@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {
  public uploader:FileUploader = new FileUploader({url: URL, itemAlias: 'photo'});

  ingridients: Array<Ingridient>=[];
  steps: Array<Step>=[];
  images: Array<any>;
  stepN:number=1;
  constructor(private http: Http, private el: ElementRef) { }

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file)=> { file.withCredentials = false; };
    //overide the onCompleteItem property of the uploader so we are
    //able to deal with the server response.
    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
      console.log("ImageUpload:uploaded:", item, status, response);
    }


  }
  AddIngridient(){
    this.ingridients.push({amount:0 , name:""});
  }
    AddStep(){
    this.steps.push({stepNumber:this.stepN,description:""});
    this.stepN++;
  }
  //the function which handles the file upload without using a plugin.
  upload() {
    //locate the file element meant for the file upload.
    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#photo');
    //get the total amount of files attached to the file input.
    let fileCount: number = inputEl.files.length;
    //create a new fromdata instance
    let formData = new FormData();
    //check if the filecount is greater than zero, to be sure a file was selected.
    if (fileCount > 0) { // a file was selected
      //append the key name 'photo' with the first file in the element
      formData.append('photo', inputEl.files.item(0));
      formData.append('postnumber','289328u19hudnjk');
      //call the angular http method
      this.http
      //post the form data to the url defined above and map the response. Then subscribe //to initiate the post. if you don't subscribe, angular wont post.
        .post(URL,formData).map((res:Response) => res.json()).subscribe(
        //map the success function and alert the response
        (success) => {
          alert(success.msg);
        },
        (error) => alert(error))
    }
  }


}
