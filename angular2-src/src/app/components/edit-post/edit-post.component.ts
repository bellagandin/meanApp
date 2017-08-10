import { Component, OnInit } from '@angular/core';
import {PostEditService} from '../../services/post-edit.service'
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';
import {getPostsService} from '../../services/getPosts.service'



@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {
  post_id:number;
  toEdit;
  constructor(private getPost: PostEditService,
              private route: ActivatedRoute,
              private router: Router,
              private getP:getPostsService,


) { }

  ngOnInit() {
   this.route.params.subscribe(params => {
      this.post_id= params['post_id'];
  });
    this.getP.getSinglePostByID(this.post_id).subscribe(
      data => {
        this.toEdit=data.msg
        console.log(this.toEdit);
      },
      err=>{console.log(err);
      
      });

    }

  }


