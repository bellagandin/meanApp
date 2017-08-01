import { Component, OnInit } from '@angular/core';
import {User} from '../../shared/User';
import {ValidateService} from '../../services/Validate.service';
import {FlashMessagesService} from 'angular2-flash-messages';
import {AuthenticateService} from '../../services/authenticate.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  firstName: String;
  lastName: String;
  userName: String;
  password: String;
  email: String;
  birthDate: Date;
  gender: String;

  constructor(
    private validator: ValidateService,
    private flasher: FlashMessagesService,
    private auth: AuthenticateService,
    private router: Router) {

   }

  ngOnInit() {
  }

  onRegisterSubmit(){
    const user={
      first_name:this.firstName,
      last_name: this.lastName,
      user_name: this.userName,
      email: this.email,
      password: this.password,
      birthday: this.birthDate,
      gender: this.gender
    }

    //validating fields
    if(!this.validator.validateRegister(user)){
      this.flasher.show("Please fill all fields",{cssClass:'alert-danger',timeout:3000});
      return false;
    }

    //validating email
    if(!this.validator.validateEmail(user.email)){
      this.flasher.show("Please enter a valid email",{cssClass:'alert-danger',timeout:3000});
      return false;
    }
    this.auth.registerUser(user).subscribe(
      data => {
        if(data.success){
          this.flasher.show("You are now Registered for RecipeMe",{cssClass:'alert-success',timeout:3000});
          this.router.navigate(['/login']);
        }
        else{
          this.flasher.show("Something went wrong",{cssClass:'alert-danger',timeout:3000});
          console.log(data);

        }

      });
  }


}
