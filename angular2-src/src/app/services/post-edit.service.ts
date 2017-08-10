import { Injectable } from '@angular/core';

@Injectable()
export class PostEditService {
  postToEdit;

  
  constructor() { }

  public setToEdit(post){
    this.postToEdit=post;
  }

}
