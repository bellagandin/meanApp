import { Component, OnInit, Input} from '@angular/core';
import {AuthenticateService} from '../../services/authenticate.service'
import {AppConfig} from '../../shared/AppConfig'
@Component({
  selector: 'app-user-resault',
  templateUrl: './user-resault.component.html',
  styleUrls: ['./user-resault.component.css']
})
export class UserResaultComponent implements OnInit {
  @Input()
  user: Object;
  api=AppConfig.API_ENDPOINT;

  constructor(private auth:AuthenticateService) { }

  ngOnInit() {


  }

}
