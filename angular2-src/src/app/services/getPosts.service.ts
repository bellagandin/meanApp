import { Injectable } from '@angular/core';
import {Http,Headers} from '@angular/http';
import {AppConfig} from '../shared/AppConfig';



@Injectable()
export class getPostsService {

  constructor(private http:Http) {}

  public getLogedUsersPosts(){
          let headers=new Headers();
      headers.append('Content-Type','application/json');
      let userid=JSON.parse(localStorage.getItem('user')).id;

      return this.http.post(AppConfig.API_ENDPOINT+'users/getMyPost',{user_id: userid},{headers: headers})
      .map(res=>res.json());
  }
  public getLogedInUserFollowingPosts(){
    let headers=new Headers();
      headers.append('Content-Type','application/json');
      let userid=JSON.parse(localStorage.getItem('user')).id;
      return this.http.post(AppConfig.API_ENDPOINT+'users/getFollowingsPosts',{user_id: userid},{headers: headers})
      .map(res=>res.json());

  }
  public getUserPost(uid){
    let headers=new Headers();
    headers.append('Content-Type','application/json');
    console.log("testddddddd",uid);
    return this.http.post(AppConfig.API_ENDPOINT+'users/getMyPost',{user_id: uid},{headers: headers})
      .map(res=>res.json());
  }

    public getAllPosts(){
    let headers=new Headers();
    headers.append('Content-Type','application/json');
    return this.http.get(AppConfig.API_ENDPOINT+'posts/getAllPosts',{headers: headers})
      .map(res=>res.json());
  }


  public addComment(comment){
    let headers=new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(AppConfig.API_ENDPOINT+'posts/addComment',comment,{headers: headers})
      .map(res=>res.json());
  }
  public getSinglePostByID(postId){
    let headers=new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(AppConfig.API_ENDPOINT+'posts/getSinglePost',{post_id: postId},{headers: headers})
      .map(res=>res.json());
  }





}
