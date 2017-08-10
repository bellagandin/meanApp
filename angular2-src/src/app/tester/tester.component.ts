import { Component, OnInit,ElementRef } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import {AuthenticateService} from '../services/authenticate.service'
import {PublishPostService} from '../services/publish-post.service'
import {getPostsService} from '../services/getPosts.service'


@Component({
  moduleId: module.id,
  selector: 'my-TesterComponent',
  templateUrl: 'tester.component.html',
})
export class TesterComponent implements OnInit {
    public currPost={
        _id:"598b63a0900cb8b375ce0642",
        recipe_title: "asdsa",
        first_name : "Omer",
        last_name : "Regev",
        user_id : "5980d5894b5b36967c14a5ba",
        user_img : "\\img\\5980d5894b5b36967c14a5ba\\photos-1502201331154.jpeg",
        category : "desserts",
        main_img: "/uploads/598b5a77900cb8b375ce063a/photos-1502304888185.jpeg",
        description : "asdsadsa",
        id_generator : 0,
        comments : [ ],
        likes : [ ],
        photos : [
                "/uploads/598b5a77900cb8b375ce063a/photos-1502304888187.jpeg",
                "/uploads/598b5a77900cb8b375ce063a/photos-1502304888189.jpeg"
        ],
        instructions : [
                {
                        "description" : "322332",
                        "stepNumber" : 1
                }
        ],
        ingredients : [
                {
                        "amount" : "2 gr",
                        "name" : "aaas"
                }
        ],
        co_author: [ ],
        __v : 0,
        user_name:"royreg"
};

    constructor(private _fb: FormBuilder,
                private publisher:PublishPostService,
                private p: getPostsService,
                private auth: AuthenticateService) { }

    ngOnInit() {
        // console.log(this.auth.getLoggedInUserName());
        // this.p.getUserPost(this.auth.getLoggedInUserName()).subscribe(
        //     data=>{
        //       console.log("tttt",data.msg[0]);
        //       this.currPost=data.msg[0];

        //     },
        //     err=>{console.log(err);}
        //   );
        
    }




}