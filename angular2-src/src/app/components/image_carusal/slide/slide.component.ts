import {Component, OnInit, OnDestroy, Input, HostBinding } from '@angular/core';

import {Carousel, Direction} from  '../carousel/carousel.component';
@Component({
  selector: 'slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.css']
})
export class Slide implements OnInit {

@Input() public index:number;
    @Input() public direction:Direction;

    @HostBinding('class.active')
    @Input() public active:boolean;

    @HostBinding('class.item')
    @HostBinding('class.carousel-item')
    private addClass:boolean = true;

    constructor(private carousel:Carousel) {
    }

    public ngOnInit() {
        this.carousel.addSlide(this);
    }

    public ngOnDestroy() {
        this.carousel.removeSlide(this);
    }

}
