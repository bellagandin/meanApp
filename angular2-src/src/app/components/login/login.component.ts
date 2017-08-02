import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {FlashMessagesService} from 'angular2-flash-messages';
import { AuthenticateService } from '../../services/authenticate.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: String;
  password: String
  
  
  constructor(
    public auth: AuthenticateService,
    public router: Router,
    public flash : FlashMessagesService) { }

  ngOnInit() {
  }

  onLoginSubmit(){
    const user={
      email: this.email,
      password: this.password
    }

    this.auth.autheniticate(user).subscribe(
      data=> {
        if(data.success){
          this.auth.storeUserData(data.token,data.user);
          this.flash.show("Login sucsessfully",{cssClass:'alert-success',timeout:3000});
          this.router.navigate(['dashboard'])
          
        }
        else{
          this.flash.show(data.msg,{cssClass:'alert-danger',timeout:3000});
        }
      });
  }


}
