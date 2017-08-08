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
    console.log(this.selectedValue,this.searchQuery);
    let send = {type:this.selectedValue, value:this.searchQuery};
    this.http
    //post the form data to the url defined above and map the response. Then subscribe //to initiate the post. if you don't subscribe, angular wont post.
      .post('http://127.0.0.1:3001/users/search', send).map((res: Response) => res.json()).subscribe(
      //map the success function and alert the response
      (success) => {
        console.log(success);
       // this.sendMessage('profile');
      },
      (error) => alert(error))
    this.router.navigate(['searchResault']);
  }

}
