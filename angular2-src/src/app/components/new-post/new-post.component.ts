import { Component, OnInit,ElementRef,Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import {AuthenticateService} from '../../services/authenticate.service'
import {PublishPostService} from '../../services/publish-post.service'
import {Server} from "../../services/socket.service";
import {AppConfig} from '../../shared/AppConfig'
import{Router} from '@angular/router'


@Component({
  moduleId: module.id,
  selector: 'my-NewPostComponent',
  templateUrl: 'new-post.component.html',
  providers: [Server],
})
export class NewPostComponent implements OnInit {
    public myForm: FormGroup;
    public pics=[];
    public ings=[];

    api=AppConfig.API_ENDPOINT;

    public serverPics=[];
    @Input()
    public edit=false;
    @Input()
    postToEdit;
  connection;

    constructor(private _fb: FormBuilder,
                private publisher:PublishPostService,
                private server: Server,
                private el: ElementRef,
                private router: Router) { }

  sendMessage(key) {
    console.log(key);
    this.server.sendMessage(key);

  }

    ngOnInit() {
      this.connection = this.server.getMessages('profile').subscribe(message => {

      });

        if(!this.edit){
            this.myForm = this._fb.group({
                recepie_title: ['',Validators.required],
                Category:['',Validators.required],
                description:['',Validators.required],
                coAuthors: this._fb.array([

                ]),
                ingridients: this._fb.array([
                    this.initIng(),
                ]),
                Steps:this._fb.array([
                    this.initStep(),
                ]),
                photos:this._fb.array([
                    this.initimage(),
                ])
            });
        }
        else{
            console.log(this.postToEdit);
            this.serverPics=this.postToEdit.photos;
            var ing=this.postToEdit.ingredients;
            console.log(ing);
            let ingTo=[];
            for(var y=0;y<ing.length;y++){
                var temp=ing[y].amount.split(' ');
                console.log(temp);
                ingTo.push(this._fb.group({name:ing[y].name,
                unit:temp[1],
                amount:temp[0]}));
            }


            this.myForm = this._fb.group({
                recepie_title: [this.postToEdit.recipe_title],
                Category:[this.postToEdit.category],
                description:[this.postToEdit.description],
                coAuthors: this._fb.array(this.initEditArray(this.postToEdit.co_author)),
                ingridients: this._fb.array(ingTo),
                Steps:this._fb.array(this.initEditArray(this.postToEdit.instructions)),
                photos:this._fb.array(this.initEditArray([]))
            });


        }
    }

    initEditArray(array){
        var ret=[];
        for(var f=0;f<array.length;f++){
            ret.push(this._fb.group(array[f]));
        }
        return ret;
    }

    initStep(){
        return this._fb.group({
            stepNumber:[''],
            description:['',Validators.required]
        })
    }
    initimage(){
        return this._fb.group({
            img:['']
        })
    }

    initCoauthor(){
        return this._fb.group({
            user_name:['']
        })
    }


    addCoauthor() {
        const control = <FormArray>this.myForm.controls['coAuthors'];
        control.push(this.initCoauthor());
    }

    removeCoauthor(i: number) {
        const control = <FormArray>this.myForm.controls['coAuthors'];
        control.removeAt(i);
    }


    initIng() {
        return this._fb.group({
            name: ['', Validators.required],
            amount: ['',Validators.required],
            unit:['',Validators.required]
        });
    }
    //remove pic from server
    removePic(i){
        var imgSrc=this.serverPics[i];
        this.serverPics.splice(i,1);
        this.publisher.removePic(i,this.postToEdit._id).subscribe(
            data=>{
                console.log(data);

            },
            (err)=>{

            }
        )
    }

    addIng() {
        const control = <FormArray>this.myForm.controls['ingridients'];
        control.push(this.initIng());
    }

    removeIng(i: number) {
        const control = <FormArray>this.myForm.controls['ingridients'];
        control.removeAt(i);
    }




    addImg() {
        const control = <FormArray>this.myForm.controls['photos'];
        control.push(this.initimage());
        this.pics.push({img:""});
    }

    removeImg(i: number) {
        const control = <FormArray>this.myForm.controls['photos'];
        control.removeAt(i);
        this.pics.splice(i,1);

    }



    addStep() {
        const control = <FormArray>this.myForm.controls['Steps'];
        control.push(this.initStep());
    }

    removeStep(i: number) {
        const control = <FormArray>this.myForm.controls['Steps'];
        control.removeAt(i);
    }
    setId(i){
        return "photo"+i;
    }
    publish(myForm) {
        if(this.pics.length<1 && !this.edit){
            alert("At least one picture is mandatory");
            return;
        }
        let formPost=myForm.value;


        let thisUser=JSON.parse(localStorage.getItem('user'));
        for(var i=0;i<formPost.Steps.length;i++){
            formPost.Steps[i].stepNumber=i+1;
        }
        for(var j=0;j<formPost.ingridients.length;j++){
            this.ings.push({name:formPost.ingridients[j].name,
            amount:formPost.ingridients[j].amount+' '+formPost.ingridients[j].unit})
        }

        console.log("thisUser",thisUser);
        let post={
            time:new Date(),
            first_name:thisUser.first_name,
            last_name:thisUser.last_name,
            user_id:thisUser._id,
            recipe_title:formPost.recepie_title,
            category:formPost.Category,
            main_img:"",
            user_img:thisUser.img_url,
            description:formPost.description,
            co_author: formPost.coAuthors,
            ingredients: this.ings,
            instructions: formPost.Steps,
            user_name : thisUser.user_name,

        };
        console.log(post);
        if(!this.edit){

            this.publisher.publish(post).subscribe(
                data=>{
                    console.log(data,data.msg.post_id);
                    this.addPhotos(data.msg.post_id);
                },
                err=>{
                    console.log(err);
                });
            }
        else{
            post['_id']=this.postToEdit._id;
            post.main_img=this.postToEdit.main_img;
            this.publisher.editPost(post).subscribe(
                data=>{
                    if(this.pics.length>0){
                        this.addMorePhotos(this.postToEdit._id);
                    }
                    else{
                        this.router.navigate(['/']);
                    }
                },
                err=>{
                    console.log(err);
                });

        }

    }

    onChange(e,i){
        if(e.target.files.length>0)
            console.log(i);
            this.pics[i]=e.target.files[0];

    }

    public addPhotos(postId:String){
        let formData = new FormData();
            for(var i=0;i<this.pics.length;i++){
                formData.append('photos',this.pics[i]);
            }
            this.publisher.addPhotos(formData,postId).subscribe( data=>{
                    console.log(data);
                    this.sendMessage('post');
                    this.router.navigate(['/']);
            },err=>{alert(err)});
    }



    public addMorePhotos(postId:String){
        let formData = new FormData();
            for(var i=0;i<this.pics.length;i++){
                formData.append('photos',this.pics[i]);
            }
            this.publisher.addMorePhotos(formData,postId).subscribe( data=>{
                console.log(data);
                this.sendMessage('post');
                this.router.navigate(['/']);
            },err=>{alert(err)});
    }






}
