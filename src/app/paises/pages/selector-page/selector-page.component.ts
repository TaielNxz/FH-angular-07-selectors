import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { switchMap, switchMapTo, tap } from "rxjs/operators";

import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interfaces/pais.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region  : [ '', [ Validators.required ] ],
    pais    : [ '', [ Validators.required ] ],
    frontera: [ '', [ Validators.required ] ],
  })

  // UI
  cargando: boolean = false;

  // llenar selectores
  regiones : string[]    = [];
  paises   : PaisSmall[] = [];
  // fronteras: string[]    = [];
  fronteras: PaisSmall[] = [];

  constructor( private fb: FormBuilder, 
               private paisesService: PaisesService) { }

  ngOnInit(): void {

    this.regiones = this.paisesService.regiones;


    // Cuando cambie la region
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap( ( _ ) => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        }),
        switchMap( region => this.paisesService.getPaisesPorRegion( region ))
      )
      .subscribe( paises => {
        this.paises = paises;
        this.cargando = false;
      });


    // Cuando cambia el pais
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap( () => {
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;
        }),
        switchMap( codigo => this.paisesService.getPaisPorCodigo( codigo ) ),
        switchMap( pais => this.paisesService.getPaisesPorCodigos( pais?.borders! ) )
      )
      .subscribe( paises => {
        // this.fronteras = pais?.borders || [];
        this.fronteras = paises;
        this.cargando = false;
      })
      
  }

  guardar() {
    console.log(this.miFormulario.value)
  }

}
