import { Comment } from '../shared/Comment';
import { Injectable } from '@angular/core';
import {Http,Headers} from '@angular/http';
import {AppConfig} from '../shared/AppConfig'

@Injectable()
export class PostEditService {
  postToEdit;

  
  constructor(private http: Http) { }

  public setToEdit(post){
    this.postToEdit=post;
  }


  removeComment(commentId,postId){
      let headers=new Headers();
      let body={comment_id: commentId,post_id:postId};
      console.log(body);
      headers.append('Content-Type','application/json');
      return this.http.post(AppConfig.API_ENDPOINT+'posts/removeComment',body,{headers: headers})
        .map(res=>res.json());

  }

}
