import { Component, OnInit,Input } from '@angular/core';
import {AppConfig} from '../../shared/AppConfig';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';



@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.css']
})
export class ImageSliderComponent implements OnInit {
  api=AppConfig.API_ENDPOINT;
  @Input()
  pics;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[]=[];


    ngOnInit(): void {     

        this.galleryOptions = [
            {
                width: '600px',
                height: '400px',
                thumbnailsColumns: 4,
                imageAnimation: NgxGalleryAnimation.Slide
            },
            // max-width 800
            {
                breakpoint: 800,
                width: '100%',
                height: '600px',
                imagePercent: 80,
                thumbnailsPercent: 20,
                thumbnailsMargin: 20,
                thumbnailMargin: 20
            },
            // max-width 400
            {
                breakpoint: 400,
                preview: false
            }
        ];

        for(var i=0;i<this.pics.length;i++){
            var picPat=this.api+this.pics[i];
            this.galleryImages.push({ small:picPat,medium:picPat,big:picPat});
        }
    }  constructor() { }


}
