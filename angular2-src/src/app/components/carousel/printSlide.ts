import { DomSanitizer } from '@angular/platform-browser'
import {Component,Pipe,PipeTransform,Input} from '@angular/core'

@Component({
    selector:"printSlide",
    template:`
        <div *ngIf="meta.sType=='div'" [innerHtml]="meta.content">

        </div>
        <img [src]="meta.imgSrc" *ngIf="meta.sType=='img'" />
    `
})
export class printSlide{
    @Input("meta") meta:any;
    constructor(){

    }
}