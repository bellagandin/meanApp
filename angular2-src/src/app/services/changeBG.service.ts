import { Injectable } from "@angular/core";

 

 
@Injectable()
export class changeBG {
   prevColor: string;
    public changeBackground(color : string){
       this.prevColor=document.body.style.backgroundColor;
        document.body.style.backgroundColor = color;
    }

    public restoreolderVer(){
        document.body.style.backgroundColor=this.prevColor;
    }


};