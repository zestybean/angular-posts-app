import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  //   totalPosts = 10;
  //   postsPerPage = 2;
  //   pageSizeOptions = [1, 2, 5, 10];
  dropdownOpen = false;

  @Input() public totalPosts: number;
  @Input() public postsPerPage: number;
  @Input() public pageSizeOptions: number[];

  ngOnInit() {
    // Check if required properties are provided, throw an error if not
    if (!this.totalPosts || !this.postsPerPage || !this.pageSizeOptions) {
      throw new Error(
        'totalPosts | postsPerPage | pageSizeOptions are required!'
      );
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
}
