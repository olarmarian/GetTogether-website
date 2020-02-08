import { ILocal } from 'src/utils/ILocal';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-local-card',
  templateUrl: './local-card.component.html',
  styleUrls: ['./local-card.component.css']
})
export class LocalCardComponent implements OnInit {

  constructor() { }

  @Input('local') local:ILocal;

  ngOnInit() {
  }

}
