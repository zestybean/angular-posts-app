import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

import { FooterComponent } from 'src/app/footer/footer.component';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
})
export class PostListComponent implements OnInit {
  // posts = [
  //   { title: 'First Post', content: "This is the first post's content" },
  //   { title: 'Second Post', content: "This is the second post's content" },
  //   { title: 'Third Post', content: "This is the third post's content" },
  // ];
  posts: Post[] = [];
  private postsSub: Subscription;
  isLoading = false;
  totalPosts = 10;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  dropdownOpen = false;

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.isLoading = true; // set isLoading to true
    this.postsService.getPosts();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
        this.isLoading = false; // set isLoading to false
      }); // subscribe to the Observable returned by getPostUpdateListener()
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe(); // prevent memory leaks
  }
}
