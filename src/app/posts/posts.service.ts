import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' }) // injectable at the root level
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>(); // Subject is an Observable

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map((postData) => {
          return postData.posts.map((post) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
            };
          });
        })
      ) // transform the data
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts; // update the posts array
        this.postsUpdated.next([...this.posts]); // emit a new value
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable(); // return an Observable
  }

  getPost(id: string) {
    return { ...this.posts.find((p) => p.id === id) }; // return a copy of the post with the given id
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http
      .post<{ message: string; postId: string }>( // specify the type of the response data
        'http://localhost:3000/api/posts',
        post
      ) // send a POST request
      .subscribe((responseData) => {
        const postId = responseData.postId; // get the id of the post
        post.id = postId; // update the id of the post
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]); // emit a new value
      });
  }

  deletePost(postId: string) {
    this.http
      .delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter((post) => post.id !== postId); // filter out the post with the given id
        this.posts = updatedPosts; // update the posts array
        this.postsUpdated.next([...this.posts]); // emit a new value
      });
  }
}
