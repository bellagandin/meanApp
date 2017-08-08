import {Component, OnInit, Input,Output,EventEmitter} from '@angular/core';
import {User} from '../../shared/User';
import {ValidateService} from '../../services/Validate.service';
import {FlashMessagesService} from 'angular2-flash-messages';
import {AuthenticateService} from '../../services/authenticate.service';
import {Router} from '@angular/router';
import {Server} from "../../services/socket.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [Server],
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
  connection;
  @Output() updt: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor(private validator: ValidateService,
              private flasher: FlashMessagesService,
              private auth: AuthenticateService,
              private server: Server,
              private router: Router) { }


  sendMessage(key){
    console.log(key);
    this.server.sendMessage(key);

  }


  ngOnInit() {
    this.connection = this.server.getMessages('profile').subscribe(message => {
      console.log("registare: get emit from the server");

    });
      }

  toUpdate(){
    this.updt.next(true);
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
      console.log("user update ",user);
      this.auth.update(user).subscribe(
        data => {
          if (data.success) {
            console.log('send amit updateProfile ');
            this.sendMessage('profile');
            this.flasher.show("You are now update your profile", {cssClass: 'alert-success', timeout: 3000});
            // this.router.navigate(['/']);
            this.toUpdate();


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
