import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator'; // import the mimeType validator

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  post: Post;
  private mode = 'create';
  private postId: string;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      }),
      content: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(1000),
        ],
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit'; // set the mode to edit
        this.postId = paramMap.get('postId'); // get the postId from the url
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe((postData) => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
          }; // set the post to the post returned by getPost()
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
          }); // set the value of the form
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0]; // get the file
    this.form.patchValue({ image: file }); // set the value of the image field to the file
    this.form.get('image').updateValueAndValidity(); // update the value and validity of the image field
    const reader = new FileReader(); // create a new FileReader
    reader.onload = () => {
      // set the onload event
      this.imagePreview = reader.result as string; // set the imagePreview to the result of the reader
    };

    reader.readAsDataURL(file); // read the file
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true; // set isLoading to true
    if (this.mode === 'create') {
      this.postsService.addPost(this.form.value.title, this.form.value.content);
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content
      );
    }
    this.form.reset();
  }
}
