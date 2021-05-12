import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Duty } from 'src/app/models/duty';
import { DutyService } from 'src/app/services/duty.service';
import { finalize } from 'rxjs/operators';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { textChangeRangeIsUnchanged } from 'typescript';

@Component({
  selector: 'app-duties',
  templateUrl: './duties.component.html'
})
export class DutiesComponent implements OnInit {

  // #region propiedades

  duties: Duty[] = [];
  showForm: boolean | undefined;
  modeForm: string | undefined;
  submitted: boolean | undefined;

  dutyForm = this.fb.group({
    id: { value: null, disabled: true },
    name: ['', Validators.required]
  });
  get f(): { [key: string]: AbstractControl } { return this.dutyForm.controls; }

  // #endregion

  // #region constructor y lifecycle hooks

  constructor(
    private toastr: ToastrService,
    private dutyService: DutyService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.cargaDuties();
  }

  // #endregion

  // #region métodos componente

  private cargaDuties(): void {
    this.spinner.show();
    setTimeout(() => {
      this.dutyService.getAllDuties()
        .pipe(finalize(() => this.spinner.hide()))
        .subscribe(
          (res: Duty[]) => {
            this.duties = res;
            if (this.duties.length === 0) {
              this.toastr.warning('No hay ningún duty guardado');
            }
          },
          err => this.toastr.error(`Error: <br />${err.status} - ${err.message}`)
        );
    }, 500);
  }

  aceptar(): void {
    this.submitted = true;
    if (this.dutyForm.invalid) {
      return;
    }

    if (this.modeForm === 'N') {
      this.spinner.show();
      this.dutyService.addDuty({ name: this.f.name.value })
        .pipe(finalize(() => this.spinner.hide()))
        .subscribe(
          (res: Duty) => {
            this.toastr.success('Duty añadido correctamente');
            this.cancelar();
            this.cargaDuties();
          },
          err => this.toastr.error(`Error: <br />${err.status} - ${err.message}`)
        );
    } else if (this.modeForm === 'E') {
      this.spinner.show();
      this.dutyService.updateDuty({ id: this.f.id.value, name: this.f.name.value })
        .pipe(finalize(() => this.spinner.hide()))
        .subscribe(
          (res: Duty) => {
            this.toastr.success('Duty actualizado correctamente');
            this.cancelar();
            this.cargaDuties();
          },
          err => this.toastr.error(`Error: <br />${err.status} - ${err.message}`)
        );
    }
  }

  nuevo(): void {
    this.clearForm();
    this.showForm = true;
    this.modeForm = 'N';
  }

  editar(id: string | undefined): void {
    this.clearForm();
    this.showForm = true;
    this.modeForm = 'E';

    this.spinner.show();
    this.dutyService.getById(id as string)
      .pipe(finalize(() => this.spinner.hide()))
      .subscribe(
        (res: Duty) => {
          this.f.id.setValue(res.id);
          this.f.name.setValue(res.name);
        },
        err => this.toastr.error(`Error: <br />${err.status} - ${err.message}`)
      );
  }

  borrar(id: string | undefined): void {
    this.spinner.show();
    this.dutyService.deleteDuty(id as string)
      .pipe(finalize(() => this.spinner.hide()))
      .subscribe(
        () => {
          this.toastr.success('Duty borrado correctamente');
          this.cargaDuties();
        },
        err => this.toastr.error(`Error: <br />${err.status} - ${err.message}`)
      );
  }

  clearForm(): void {
    this.dutyForm.reset();
  }

  cancelar(): void {
    this.clearForm();
    this.showForm = false;
    this.submitted = false;
  }

  // #endregion

}
