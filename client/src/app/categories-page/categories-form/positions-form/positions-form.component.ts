import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MaterialInstance, MaterialService } from 'src/app/shared/classes/material.service';
import { Position } from 'src/app/shared/interfaces';
import { PositionsService } from 'src/app/shared/services/positions.service';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input("categoryId") categoryId: string;
  @ViewChild("modal") modalRef: ElementRef;
  positions: Position[] = [];
  loading = false;
  modal: MaterialInstance;
  form: FormGroup;
  positionId = null;

  constructor(private positionsService: PositionsService) { }

  ngOnInit(): void {
      this.form = new FormGroup({
        name: new FormControl(null, Validators.required),
        cost: new FormControl(0, [Validators.required, Validators.min(1)])
      })
      this.loading = true;
      this.positionsService.fetch(this.categoryId)
        .subscribe(positions => {
            this.positions = positions;
            this.loading = false;
        }) 
  }
  
  ngOnDestroy() {
    this.modal.destroy()
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  onSelectPosition(position: Position) {
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    })
    this.modal.open();
    MaterialService.updateTextInputs();
    this.positionId = position._id;
  }

  onDeletePosition(event: Event, position: Position) {
    event.stopPropagation();
    const decision = window.confirm(`You are going to remove position ${position.name}. Are you sure?`);

    if (decision) {
      this.positionsService.delete(position).subscribe(
        response => { 
          const index = this.positions.findIndex(p => p._id === position._id);
          this.positions.splice(index, 1);
          MaterialService.toast(response.message);
        },
        error => MaterialService.toast(error.error.message)
      )
    }
  }

  onAddPosition() {    
    this.positionId = null;            
    this.form.patchValue({             // Change to patchValue for BUG - old values on new position - Backchange to 'reset'
      name: null,                   
      cost: 0
    })
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onCancel() {
    this.modal.close();
  }

  onSubmit() {
    this.form.disable();
    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    }

    const completed = ()  => {
      this.modal.close()
      this.form.reset({name: null, cost: 0})
      this.form.enable()
    }

    if (this.positionId) {
      newPosition._id = this.positionId;
      this.positionsService.update(newPosition).subscribe(
        position => {
          const index = this.positions.findIndex(p => p._id === position._id); // Commit for BUG - positions dont update after changes
          this.positions[index] = position;
          MaterialService.toast('Position have been updated');
        },
        error => {
          this.form.enable();
          MaterialService.toast(error.error.message);
        },
        completed
      );
    }
    else {
      this.positionsService.create(newPosition).subscribe(
        position => {
          MaterialService.toast('Position have been created');
          this.positions.push(position);
        },
        error => {
          this.form.enable();
          MaterialService.toast(error.error.message);
        },
        completed
      );
    }
  }
}
