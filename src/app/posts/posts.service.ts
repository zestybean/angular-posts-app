import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' }) // injectable at the root level
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>(); // Subject is an Observable

  constructor(private http: HttpClient, private router: Router) {}

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
              imagePath: post.imagePath,
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
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
    }>('http://localhost:3000/api/posts/' + id);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData(); // create a new FormData object
    postData.append('title', title); // append the title
    postData.append('content', content); // append the content
    postData.append('image', image, title); // append the image
    this.http
      .post<{ message: string; post: Post }>( // specify the type of the response data
        'http://localhost:3000/api/posts',
        postData
      ) // send a POST request
      .subscribe((responseData) => {
        const post: Post = {
          id: responseData.post.id,
          title: responseData.post.title,
          content: responseData.post.content,
          imagePath: responseData.post.imagePath,
        };
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]); // emit a new value
        this.router.navigate(['/']); // navigate to the root route
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;

    if (typeof image === 'object') {
      // if the image is a File
      postData = new FormData(); // create a new FormData object
      postData.append('id', id); // append the id
      postData.append('title', title); // append the title
      postData.append('content', content); // append the content
      postData.append('image', image, title); // append the image
    } else {
      // if the image is a string
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
      };
    }

    this.http
      .put('http://localhost:3000/api/posts/' + id, postData) // send a PUT request
      .subscribe((response) => {
        const updatedPosts = [...this.posts]; // copy the posts array
        const oldPostIndex = updatedPosts.findIndex((p) => p.id === id); // find the index of the post with the given id
        const post: Post = {
          id: id,
          title: title,
          content: content,
          imagePath: '',
        };
        updatedPosts[oldPostIndex] = post; // update the post
        this.posts = updatedPosts; // update the posts array
        this.postsUpdated.next([...this.posts]); // emit a new value
        this.router.navigate(['/']); // navigate to the root route
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
