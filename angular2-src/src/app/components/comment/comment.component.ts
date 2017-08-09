import { Component, OnInit,Input } from '@angular/core';
import {Comment} from '../../shared/Comment'
import {AppConfig} from '../../shared/AppConfig'

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input()
  thisComment: Comment;
  api=AppConfig.API_ENDPOINT;
  

  constructor() { }

  ngOnInit() {
    console.log(this.thisComment);
  }



}
