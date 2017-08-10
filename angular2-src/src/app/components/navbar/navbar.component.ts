import { Component, OnInit } from '@angular/core';
import {FlashMessagesService} from 'angular2-flash-messages';
import { AuthenticateService } from '../../services/authenticate.service';
import {Router } from '@angular/router';
import {Http,Response} from '@angular/http'


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  searchQuery: String;
  selectedValue:String;



  constructor(private http: Http,
              private auth: AuthenticateService,
              private flash: FlashMessagesService,
              private router: Router) { }

  ngOnInit() {
  }

  logOutClick(){
    this.auth.logout();
    this.flash.show("Loged out from RecipeMe",{cssClass:'alert-success',timeout:3000});
    this.router.navigate(['/login']);
    return false;
  }
  getLoggedInUSer(){
    return JSON.parse(localStorage.getItem('user'));
  }
  search(){

    this.router.navigate(['searchResault',this.searchQuery,this.selectedValue]);
  }

}
