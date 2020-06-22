import { LocalsService } from "./../local-service/locals.service";
import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-metadata",
  templateUrl: "./metadata.component.html",
  styleUrls: ["./metadata.component.css"],
})
export class MetadataComponent implements OnInit {
  constructor(private localsService: LocalsService) {}

  @Input("title") public title: string;
  @Input("elements") public elements: string;

  public isClosed: boolean = false;

  ngOnInit() {
    window.innerWidth < 1100 ? (this.isClosed = true) : (this.isClosed = false);
  }

  handleMenuSection() {
    this.isClosed = !this.isClosed;
  }

  setTag(checked: boolean, tag: string) {
    if (checked) {
      this.localsService.filters.tag = tag.replace("#", "");
    } else {
      this.localsService.filters.tag = "all";
    }
    this.localsService.getFilteredLocals();
  }

  setSpecific(checked: boolean, specific: string) {
    if (checked) {
      this.localsService.filters.specific = specific;
    } else {
      this.localsService.filters.specific = "all";
    }
    this.localsService.getFilteredLocals();
  }

  isForTags() {
    return this.title === "Tags";
  }
}
