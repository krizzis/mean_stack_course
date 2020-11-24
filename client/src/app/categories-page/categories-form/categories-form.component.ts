import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { Category, Message } from 'src/app/shared/interfaces';
import { CategoriesService } from 'src/app/shared/services/categories.service';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css']
})
export class CategoriesFormComponent implements OnInit {

  @ViewChild('fileUpload') uploadRef: ElementRef
  form: FormGroup;
  image: File;
  imagePreview: any;
  isNew = true; 
  category: Category;

  constructor(private route: ActivatedRoute,
              private categoriesService: CategoriesService,
              private router: Router) { }

  ngOnInit(): void {
    
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    })

    // this.form.disable(); // Comment for BUG - form editing while loaded

    this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            if (params['id']) {
              // this.isNew = false; // Comment for BUG - Breadcrums title
              return this.categoriesService.getById(params['id'])
            }

            return of(null)
          }
        )
      )
      .subscribe(
        (category: Category) => {
          if (category) {
            this.category = category;
            this.form.patchValue({
              name: category.name
            })
            // this.imagePreview = category.imageSrc;  // Comment for BUG - not load image preview on edit
            // MaterialService.updateTextInputs() // Comment for BUG - name over placeholder
          }

          this.form.enable()
        },
        error => MaterialService.toast(error.error.message)
      )
  }

  triggerClick() {
    this.uploadRef.nativeElement.click();
  }

  deleteCategory() {
    const decision = window.confirm(`You are going to deleted category ${this.category.name}. Are you sure?`)

    if (decision) {
      this.categoriesService.delete(this.category._id)
        .subscribe(
          response => MaterialService.toast(response.message),
          error => MaterialService.toast(error.error.message),
          () => this.router.navigate(['/categories'])
          )
    }
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    this.image = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result;
    }

    reader.readAsDataURL(file)
  }

  onSubmit() {
    let obs$;
    this.form.disable();
    
    if (this.isNew) {
      // create
      obs$ = this.categoriesService.create(this.form.value.name, this.image);
    }
    else {
      obs$ = this.categoriesService.update(this.category._id, this.form.value.name, this.image);
      // update
    }

    obs$.subscribe(
      (category: Category) => {
        this.category = category;
        MaterialService.toast('Changes have been saved');
        this.form.enable();
      },
      error => {
        MaterialService.toast(error.error.message);
        this.form.enable();
      }
    )
  }
  

}
