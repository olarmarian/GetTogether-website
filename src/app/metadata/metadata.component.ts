import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-metadata',
  templateUrl: './metadata.component.html',
  styleUrls: ['./metadata.component.css']
})
export class MetadataComponent implements OnInit {

  constructor() {}

  @Input("title") public title:string;
  @Input("elements") public elements:string[];

  public isClosed: boolean = false;
  
  ngOnInit() {
    console.log(window.innerWidth)
    window.innerWidth < 1100 ? this.isClosed = true : this.isClosed = false
  }

  handleMenuSection(){
    this.isClosed = !this.isClosed;
  }

}
