import {Component, OnInit, Input} from '@angular/core';
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
  @Input()
  firstName: String;
  @Input()
  lastName: String;
  @Input()
  userName: String;
  password: String;
  @Input()
  email: String;
  @Input()
  birthDate: Date;
  @Input()
  gender: String;
  @Input()
  self_description: String;
  @Input()
  edit: boolean = false;


  constructor(private validator: ValidateService,
              private flasher: FlashMessagesService,
              private auth: AuthenticateService,
              private router: Router) {

  }

  ngOnInit() {
  }

  onRegisterSubmit() {
    var user = {
      first_name: this.firstName,
      last_name: this.lastName,
      user_name: this.userName,
      email: this.email,
      password: this.password,
      birthday: this.birthDate,
      gender: this.gender,
      self_description: this.self_description
    };

    if (this.edit) {
      console.log("edit!!!!");
      this.auth.update(user).subscribe(
        data => {
          if (data.success) {
            this.flasher.show("You are now update you profile", {cssClass: 'alert-success', timeout: 3000});
            this.edit=false;
            this.router.navigate(['/']);

          }
          else {
            this.flasher.show("Something went wrong", {cssClass: 'alert-danger', timeout: 3000});
            console.log(data);

          }

        });
    }//edit post functionality

    else {
      //validating fields
      if (!this.validator.validateRegister(user)) {
        this.flasher.show("Please fill all fields", {cssClass: 'alert-danger', timeout: 3000});
        return false;
      }

      //validating email
      if (!this.validator.validateEmail(user.email)) {
        this.flasher.show("Please enter a valid email", {cssClass: 'alert-danger', timeout: 3000});
        return false;
      }
      this.auth.registerUser(user).subscribe(
        data => {
          if (data.success) {
            this.flasher.show("You are now Registered for RecipeMe", {cssClass: 'alert-success', timeout: 3000});
            this.router.navigate(['/login']);
          }
          else {
            this.flasher.show("Something went wrong", {cssClass: 'alert-danger', timeout: 3000});
            console.log(data);

          }

        });

    }
  }


}
