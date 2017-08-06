import { Component, OnInit } from '@angular/core';
import {Ingridient} from '../../shared/Ingridient';
import {Step} from '../../shared/Step'

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {
  ingridients: Array<Ingridient>=[];
  steps: Array<Step>=[];
  images: Array<any>;
  stepN:number=1;
  constructor() { }

  ngOnInit() {
  }
  AddIngridient(){
    this.ingridients.push({amount:0 , name:""});
  }
    AddStep(){
    this.steps.push({stepNumber:this.stepN,description:""});
    this.stepN++;
  }
  

}
