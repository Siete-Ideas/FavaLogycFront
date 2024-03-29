import { Component, ViewEncapsulation, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ModalErrorComponent } from 'app/shared/modal-error/modal-error.component';
import { MatDialog } from '@angular/material/dialog';
import { SonidoService } from 'app/shared/services/sonidos.service';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';

import { HttpErrorResponse } from '@angular/common/http';
import { ControlarLoteService } from './controlar-lote.service';
import { MatButton } from '@angular/material/button';
import { PopUpLoteCreado } from './popUpLoteControlado/popUpLoteControlado.component';


/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
    selector     : 'controlar-lote',
    templateUrl  : './controlar-lote.component.html',
    styleUrls    : ['./controlar-lote.component.scss'],
    animations   : [
      trigger('esconder', [
        state('show', style({
          height: '90px',
          opacity: 1
        })),
        state('hide',   style({
          height: '0px',
          opacity: 0
        })),
        transition('show => hide', animate('300ms ease-out')),
        transition('hide => show', animate('300ms ease-in'))
      ])
    ],
    encapsulation: ViewEncapsulation.None
})

export class ControlarLoteComponent implements OnInit {

  @ViewChild('buscarCUPA') buscarCUPAInput: ElementRef;
  @ViewChild('buscarCodigoBarras') buscarCodigoBarrasInput: ElementRef;
  @ViewChild('eliminaCupa') eliminaCupaInput: ElementRef;
  @ViewChild('btnRef') buttonRef: MatButton;
    
  articulos: [] = null;
  modo: string = '';
  tituloPagina: string = 'ESTANTERÍA';
  idLote : number;
  lote = {};
  nombreLote: string = '';
  eliminar: boolean = false;
  codigoBarras: string = null;
  cupa: string = null;
  controlado: boolean = false;
  ocultarBotones: boolean = false;
  estadoLote: string = "A CONTROLAR";

  condicion: string = null;
  endPoint: string = null;

  constructor(
    private _router: Router,
    private _controlarLoteService: ControlarLoteService,
    private _dialog: MatDialog,
    private _sonido: SonidoService,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void{
    this._activatedRoute.params.subscribe( params => {

      this.modo = params['modo'];
      this.idLote = params['id'];
    });
    this.setTitulo();
    this.getArticulosDeLote();
    this.buscarLotePorId();
  }

  setTitulo(){
    if( this.modo === 'darsena' ){
      this.tituloPagina = "DÁRSENA";
    }
  }

  alertArregloVacio(){
    let titulo = 'Algo salió mal';
    let mensaje = "El lote con id "+ this.idLote +" no existe o está vacío";
    let errStatus = 404;
    this.mostrarError(errStatus, titulo, mensaje);
    this.volver();
  }

  toggleBotones(){
    console.log("verBotones", this.ocultarBotones);
  }

  volver(){
    let ruta = `lotes/control/lote-en/${this.modo}`;
    this._router.navigate([ruta]);
  }

  actualizar(){
    window.location.reload();
  }

  buscarLotePorId(){
    this._controlarLoteService.getLotePorId( this.idLote ) .subscribe( data => {

      this.lote = data; 
      //console.log("LOTEEEEEEEEEEEEEEEE", this.lote);
    },
    (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
        console.log("Client-side error");
      } else {
        let errStatus = err.status
        if (errStatus == 0){
          let titulo = 'Error de Servidor';
          let mensaje = "Por favor comunicarse con Sistemas";
          this.mostrarError(errStatus, titulo, mensaje);
        } else {
          let titulo = 'Error al buscar lote';
          let mensaje = err.error.message.toString();
          this.mostrarError(errStatus, titulo, mensaje);
        }
      }
    });
  }

  setEstadoLote(articulos: any){
    console.log("articulos de setEstadoLote", articulos);
    let contador = 0;
    if(this.modo === "estanteria"){
      for(let articulo of articulos){
        //console.log("cantDetalles", articulo.cantidadDeDetalles, "cantDetalles a chequear", articulo.cantidadDeDetallesCheckeados);  
        if(articulo.cantidadDeDetalles == articulo.cantidadDeDetallesCheckeados){
          contador++;
          //console.log("contador", contador, "articulos.lenght", articulos.length);
        }
      }
      if (contador == this.articulos.length){
        this.estadoLote = "CONTROLADO";
        this.popUpLoteControlado();
      }
    }
    //console.log("ESTADO LOTE", this.estadoLote);
    if(this.modo === "darsena"){
      for(let articulo of articulos){
        //console.log("cantDetalles", articulo.cantidadDeDetalles, "cantDetalles a chequear", articulo.cantidadDeDetallesCheckeados);  
        if(articulo.cantidadDeDetalles == articulo.cantidadDeDetallesCheckeados){
          contador++;
          //console.log("contador", contador);
        }
      }
      if (contador == this.articulos.length){
        this.estadoLote = "CONTROLADO";
        this.popUpLoteControlado();
      }
    }

  }

  popUpLoteControlado() {
    
    this._dialog.open( PopUpLoteCreado, {
        data: {
          idLote: this.idLote,
          modo: this.modo,
          lote: this.lote
        }
      });
  } 

  getArticulosDeLote() {
    this._controlarLoteService.getArticulosDeLote(this.idLote, '', this.modo).subscribe( data => {
      this.articulos = data.datos;
      console.log( "this.articulos ->", this.articulos );
      this.setEstadoLote( this.articulos );
      //this.articulos = this.dataSource2;
    },
    (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
        console.log("Client-side error");
      } else {
        let errStatus = err.status
        if (errStatus == 0){
          let titulo = 'Error de Servidor';
          let mensaje = "Por favor comunicarse con Sistemas";
          this.mostrarError(errStatus, titulo, mensaje);
        } else {
          let titulo = 'Error';
          let mensaje = "El articulo no se agregó";
          this.mostrarError(errStatus, titulo, mensaje);
        }
      }
    });

  }

  esperarYactualizarDatos(){
    setTimeout(() => {                          
      this.getArticulosDeLote();
      this.limpiarInputs();
    }, 1000);
  }

  limpiarInputs(){
    this.buscarCUPAInput.nativeElement.value = "";
    this.buscarCodigoBarrasInput.nativeElement.value = "";
  }

  controlarEtapaArticulo() {
    // al chequear el articulo la etapa del articulo cambia
    console.log(this.cupa);
    console.log(this.codigoBarras);
    this.articulos = null;
    
    this._controlarLoteService.controlarEtapaArticulo( this.cupa, this.idLote, this.codigoBarras, this.modo )
      .subscribe( data => {
        this.controlado = true;
        this._sonido.playAudioSuccess();
        console.log("control exitoso");
        this.esperarYactualizarDatos();
        
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log("Client-side error");
        } else {
          this._sonido.playAudioAlert();
          let errStatus = err.status
          if (errStatus == 0){
            let titulo = 'Error de Servidor';
            let mensaje = "Por favor comunicarse con Sistemas";
            this.mostrarError(errStatus, titulo, mensaje);
          } else {
            let titulo = 'Error al Controlar';
            let mensaje = "No se controló el artículo. Es posible que falten datos para controlar o sean incorrectos.";
            this.mostrarError(errStatus, titulo, mensaje);
            this.getArticulosDeLote();
          }
        }
      });
    }



  //@Debounce(1000) 
  searchCodigoBarras( ) {
    this.codigoBarras = this.buscarCodigoBarrasInput.nativeElement.value;
    this.codigoBarras = this.codigoBarras.toLocaleUpperCase();
    console.log(this.codigoBarras);
    if (this.codigoBarras == "" || this.codigoBarras == null){
      this.codigoBarras = null;
    }
  }  
  //@Debounce(1000) 
  searchCUPA() {
    this.cupa = this.buscarCUPAInput.nativeElement.value;
    this.cupa = this.cupa.toLocaleUpperCase();
    console.log(this.cupa);
    if (this.cupa == "" || this.cupa == null){
      this.cupa = null;
    }

  }

  saltarAcupa(e){
    if(e.key === "Enter")
      this.buscarCUPAInput.nativeElement.focus();
  }

  saltarAbotonControlar(e){
    if (e.key === "Enter") {
      if (this.ocultarBotones == false){
        this.controlarEtapaArticulo();
      }
      else{
        this.buttonRef.focus();
      }
    }
  }


  resetCampos(){
    this.buscarCodigoBarrasInput.nativeElement.value = '';
    this.buscarCUPAInput.nativeElement.value = '';
    this.codigoBarras = '';
    this.cupa = '';
    this.eliminar = false;
    this.buscarCodigoBarrasInput.nativeElement.focus();
  }

  toggle() {
    this.eliminar = !this.eliminar;
  }

  get funcionEsconder() {
    return this.eliminar ? 'show' : 'hide'
  }

  borrarArticuloDeLotePorCupa() {
    this._controlarLoteService.eliminarArticuloDeLotePorCupa( this.cupa ).subscribe( data => {
      //this.dataSource2 = data.datos;
      console.log("borrado ");
    },
    (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
        console.log("Client-side error");
      } else {
        let errStatus = err.status
        if (errStatus == 0){
          let titulo = 'Error de Servidor';
          let mensaje = "Por favor comunicarse con Sistemas";
          this.mostrarError(errStatus, titulo, mensaje);
        } else {
          let titulo = 'Error ';
          let mensaje = err.error.message.toString();
          this.mostrarError(errStatus, titulo, mensaje);
        }
      }
    });
  }

  mostrarError(errStatus, titulo, mensaje){
    const dialogRef = this._dialog.open( ModalErrorComponent, { 
      data: {
        titulo: titulo,
        mensaje: mensaje
      } 
    });
  } 
}