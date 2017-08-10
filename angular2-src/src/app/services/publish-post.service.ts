import { Injectable } from '@angular/core';
import {Http,Headers} from '@angular/http'
import {AppConfig} from '../shared/AppConfig'

@Injectable()
export class PublishPostService {

  constructor(private http: Http) { }


   public publish(post){
      let headers = new Headers();
      console.log("sending");
      console.log(post);
      headers.append('Content-Type','application/json');
      return this.http.post(AppConfig.API_ENDPOINT+'posts/createPost',post,{headers: headers})
        .map(res=>res.json());
    }

  public addPhotos(formData,postId){
    return this.http.post(AppConfig.API_ENDPOINT+"posts/uploadMainImg/"+postId,
    formData).map((res) => res.json());

    }

  public removePic(ind,postId){
      let headers = new Headers();
      console.log("removing pic");
      headers.append('Content-Type','application/json');
      console.log(ind);
      console.log(postId);
      return this.http.post(AppConfig.API_ENDPOINT+'posts/removeImg',{imgInd:ind,post_id:postId},{headers: headers})
        .map(res=>res.json());
  }

    public editPost(post){
      let headers=new Headers();
      console.log("service",post);
      headers.append('Content-Type','application/json');
      return this.http.post(AppConfig.API_ENDPOINT+'posts/editPost',post,{headers: headers})
        .map(res=>res.json());
  }
    public addMorePhotos(formData,postId){
          return this.http.post(AppConfig.API_ENDPOINT+"posts/morePhotos/"+postId,
            formData).map((res) => res.json())
    }


  }


