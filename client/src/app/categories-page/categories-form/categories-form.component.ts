import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css']
})
export class CategoriesFormComponent implements OnInit {

  isNew = true;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      console.log('isnew: ', this.isNew)
      if (params['id']) {
        // edit
        this.isNew = false;
      }
      else
      {
        // create
      }
    })
  }
  

}
