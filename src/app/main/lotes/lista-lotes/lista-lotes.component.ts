import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { ModalErrorComponent } from 'app/shared/modal-error/modal-error.component';
import { HttpErrorResponse } from '@angular/common/http';

import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { ListaLotesService } from './lista-lotes.service';


export interface Articulos {

  Id: number;
  Tipo: string;
  CodigoArticulo: string;
  Nombre: string;
  Comprobante: string;
  FechaEntrega: string;
  Prov: string;
  Loc: string;
  Estado: string;
  Etapa: string;
  Lote: number;
}

interface Estados{
  valor: string;
  vista: string;
}


export interface Lote {
  idLote: number;
  Nombre: string;
  FechaAlta: string;
}

export interface FiltroDeLote{
  idTipo : number;
  idTurno : number;
  idOrigen : number;
  idEtapa : number;
  idProvincia : number;
  idLocalidad : number;
  desdePedido : string;
  hastaPedido : string;
  idLote : number;
}

export interface BodyDetalleFecha{
  desdeLote : string;
  hastaLote : string;
}

@Component({  
  selector: 'app-lista-lotes',  
  templateUrl: './lista-lotes.component.html',
  styleUrls: ['./lista-lotes.component.scss']
})

export class ListaLotesComponent implements OnInit {

  @ViewChild('buscarCbte') buscarCbteInput: ElementRef;
  @ViewChild('buscarLote') buscarLoteInput: ElementRef;

  displayedColumns: string[] = ['id', 'nombre', 'fechaAlta', 'cantArticulos', 'estado', 'seleccionar'];
  dataSource2: any;
  selection = new SelectionModel<any>(true, []);
  selecccionDeEstado: string;

  idLote: number = null;
  lote: string = null;
  nombreLote: string = null;
  busqueda: string = "";
  length: number = 0;
  page: number = 0;
  size: number = 50;
  columna: string = 'idDetalle';
  order: string = 'asc';

  mensaje: string;
  filtroFechas: boolean;
  filtroInactivos: boolean;
  

  minDateDesdeFiltro: Date;
  maxDateDesdeFiltro: Date;

  minDateHastaFiltro: Date;
  maxDateHastaFiltro: Date;

  minDateDesdeLote: Date;
  maxDateDesdeLote: Date;

  minDateHastaLote: Date;
  maxDateHastaLote: Date;


  /*
  Filtros
   */

  filtroTipos: any;
  selectedTipo: any = 0;
  
  filtroTurnos: any;
  selectedTurno: any = 0;
  
  filtroOrigenes: any;
  selectedOrigen: any = 0;

  filtroEstados: any;
  selectedEstado: any = 0;

  filtroEtapas: any;
  selectedEtapa: any = 0;

  filtroProvincias: any;
  selectedProvincia: any = 1;

  filtroLocalidades: any;
  selectedLocalidad: any = 1402;

  pickerFiltroDesde: any = null;
  pickerFiltroHasta: any = null;
  pickerLoteDesde: any   = null;
  pickerLoteHasta: any   = null;

  filtroLote: FiltroDeLote ={
    idTipo      : 1,
    idTurno     : null,
    idOrigen    : null,
    idEtapa     : null,
    idProvincia : 1,
    idLocalidad : null,
    desdePedido : null,
    hastaPedido : null,
    idLote      : null
  };

  estado: string = 'ACTIVOS';

  estados: Estados [] = [
    { valor: "NUEVO", vista: "Nuevos" },
    { valor: "ANULADO", vista: "Anulados" },
    { valor: "ESTANTERIA", vista: "Estantería" },
    { valor: "DARSENA", vista: "Dársena" },
    { valor: "REMITIDO", vista: "Remitidos" },
    { valor: "ACTIVOS", vista: "Activos" }
  ];

  constructor(private _router: Router, 
              private _fuseSidebarService: FuseSidebarService, 
              private _listaLoteService: ListaLotesService,
              //private _usuarioService: UsuarioService,
              private _dialog: MatDialog,
              //private _verLoteComponent: VerLoteComponent
              ) { 

    const currentYear = new Date().getFullYear();
    this.minDateDesdeFiltro = new Date(currentYear - 5, 0, 1);
    this.maxDateDesdeFiltro = new Date(currentYear + 1, 11, 31);
    this.minDateHastaFiltro = new Date(currentYear - 5, 0, 1);
    this.maxDateHastaFiltro = new Date(currentYear + 1, 11, 31);
    this.minDateDesdeLote   = new Date(currentYear - 5, 0, 1);
    this.maxDateDesdeLote   = new Date(currentYear + 1, 11, 31);
    this.minDateHastaLote   = new Date(currentYear - 5, 0, 1);
    this.maxDateHastaLote   = new Date(currentYear + 1, 11, 31);
  }

  ngOnInit(): void {

    this.getLotesPorEstado( this.estado, this.page, this.size );
    this.filtroFechas = false;
    this.filtroInactivos = false;
  }
  
  buscarLotePorNombre() {
    let bodyFechas: BodyDetalleFecha  = {
      desdeLote   : this.pickerLoteDesde,
      hastaLote   : this.pickerLoteDesde
    }
    this._listaLoteService.getLotesPorFecha(this.lote, bodyFechas)
      .subscribe(data => {
        console.log(data);
        this.dataSource2 = data.datos;
        //this.length = data.totalRegistros;
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
            let titulo = 'Error al listar';
            let mensaje = err.error.message.toString();
            this.mostrarError(errStatus, titulo, mensaje);
          }
        }
    }); 
  }

  setNombreLote() {
    this.lote = this.buscarLoteInput.nativeElement.value;
    if(this.lote === ''){
      this.lote = null;
    }
  }

  buscarLoteConEnter( e ){
    if (e.key === "Enter" && (this.lote != null || this.lote != undefined)) {
      this.buscarLotePorNombre();
    }
  }

  activarFechas(){
    this.filtroFechas = !this.filtroFechas;
  }

  toggleMostrarInactivos(){
    this.filtroInactivos = !this.filtroInactivos;
  }
  
  getLotesPorEstado( estado: string, page, size ){
    console.log({estado});
    if( estado === 'ACTIVOS'){
      this._listaLoteService.getAllLotes( this.page, this.size ) .subscribe( data => {
        this.dataSource2 = data.datos; 
        this.length = data.totalRegistros;
        console.log(data);
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
            console.log(err.error);
            let titulo = 'Error al listar';
            let mensaje = err.error.message.toString();
            this.mostrarError(errStatus, titulo, mensaje);
          }
        }
      });
    } else {
      this.estado = estado;
      this._listaLoteService.getLotesPorEstado( this.estado, this.page, this.size ) .subscribe( data => {
        console.log(data);
        this.dataSource2 = data.datos; 
        this.length = data.totalRegistros;
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
            let titulo = 'Error al listar';
            let mensaje = err.error.message.toString();
            this.mostrarError(errStatus, titulo, mensaje);
          }
        }
      });
    }
  }

  getSoloFecha(fecha: any){
    return fecha.split(' ')[0];
  }

  getArticulo(id: number){                     //para borrar
    id = id + 7;
    return id.toString();
  }

  verLote(lote: Lote){ //redireccionar 
    //console.log(lote.idLote);
    if( lote != null ){
      //this.idLote = lote.id;
      this.idLote = lote.idLote;
      let ruta = `lotes/ver-lote/${ this.idLote }`;

      this._router.navigate([ ruta ]);
    }
  }

  resetFiltros(){
    this.busqueda = "";
    this.page = 0;
    this.size = 10;
    this.columna = 'idDetalle';
    this.order = 'asc';

    this.busqueda = "";
    this.selectedTipo = 1;
    this.selectedTurno = 0;
    this.selectedOrigen = 0;
    this.selectedEtapa = 0;
    this.selectedProvincia = 1;
    this.selectedLocalidad = 1402;
    this.pickerFiltroDesde= null;
    this.pickerFiltroHasta= null;
    
    
    this.buscarCbteInput.nativeElement.value = '';
  }

  getfiltros(){
    this._listaLoteService.getAllTipos().subscribe(params => {
      this.filtroTipos = params.datos;
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
          let titulo = 'Error al cargar filtros';
          let mensaje = err.error.message.toString();
          this.mostrarError(errStatus, titulo, mensaje);
        }
      }
    })
    
    this._listaLoteService.getAllTurnos().subscribe(params => {
      this.filtroTurnos = params.datos;
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
          let titulo = 'Error al cargar filtros';
          let mensaje = err.error.message.toString();
          this.mostrarError(errStatus, titulo, mensaje);
        }
      }
    })
    
    this._listaLoteService.getAllOrigenes().subscribe(params => {
      this.filtroOrigenes = params.datos;
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
          let titulo = 'Error al cargar filtros';
          let mensaje = err.error.message.toString();
          this.mostrarError(errStatus, titulo, mensaje);
        }
      }
    })

    this._listaLoteService.getAllEtapas().subscribe(params => {
      this.filtroEtapas = params.datos;
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
          let titulo = 'Error al cargar filtros';
          let mensaje = err.error.message.toString();
          this.mostrarError(errStatus, titulo, mensaje);
        }
      }
    })

    this._listaLoteService.getAllProvincias().subscribe(params => {
      this.filtroProvincias = params.datos;
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
          let titulo = 'Error al cargar filtros';
          let mensaje = err.error.message.toString();
          this.mostrarError(errStatus, titulo, mensaje);
        }
      }
    })

    this._listaLoteService.getAllLocalidades().subscribe(params => {
      this.filtroLocalidades = params.datos;
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
          let titulo = 'Error al cargar filtros';
          let mensaje = err.error.message.toString();
          this.mostrarError(errStatus, titulo, mensaje);
        }
      }
    })
  }

  getDetalle(busqueda, page, size, columna, order){
    let idTipo      :number =null;
    let idTurno     :number =null;
    let idOrigen    :number =null;
    let idEstado    :number =null;
    let idEtapa     :number =null;
    let idProvincia :number =null;
    let idLocalidad :number =null;
    let desdePedido :string =null;
    let hastaPedido :string =null;  
    let idLote      :number =null;
    let desdeLote   :string =null;
    let hastaLote   :string =null;
    this.selection.clear();

    if (this.selectedTipo > 0 )
      idTipo = this.selectedTipo;
    
    if (this.selectedTurno > 0 )
      idTurno = this.selectedTurno;
    
    if (this.selectedOrigen > 0 )
      idOrigen = this.selectedOrigen;
    
    if (this.selectedEstado > 0 )
      idEstado = this.selectedEstado;
    
    if (this.selectedEtapa > 0 )
      idEtapa = this.selectedEtapa;
    
    if (this.selectedProvincia > 0 )
      idProvincia = this.selectedProvincia;
    
    if (this.selectedLocalidad > 0 )
      idLocalidad = this.selectedLocalidad;
    
    if (this.pickerFiltroDesde)
      desdePedido = this.pickerFiltroDesde;
    
    if (this.pickerFiltroHasta)
      hastaPedido = this.pickerFiltroHasta;
    
    if (this.idLote !== null)
      idLote = this.idLote;
    
    if (this.pickerLoteDesde)
      desdeLote = this.pickerLoteDesde;	
    
    if (this.pickerLoteHasta)
      hastaLote = this.pickerLoteHasta;

    this.filtroLote.idTipo      = idTipo;
    this.filtroLote.idTurno     = idTurno;
    this.filtroLote.idOrigen    = idOrigen;
    this.filtroLote.idEtapa     = idEtapa;
    this.filtroLote.idProvincia = idProvincia;
    this.filtroLote.idLocalidad = idLocalidad;
    this.filtroLote.desdePedido = desdePedido;
    this.filtroLote.hastaPedido = hastaPedido;
    this.filtroLote.idLote      = idLote;
    
    // console.log(this.filtroLote);

    this._listaLoteService.getPedidosLote(this.filtroLote, busqueda, columna, order).subscribe(
      data => {
        // console.log(data)
        this.dataSource2 = data.datos;
        this.length = data.totalRegistros;
      },
      (err: HttpErrorResponse) => {
        this.length = 0;
        if (err.error instanceof Error) {
          console.log("Client-side error");
        } else {
          let errStatus = err.status
          if (errStatus == 0){
            let titulo = 'Error de Servidor';
            let mensaje = "Por favor comunicarse con Sistemas";
            this.mostrarError(errStatus, titulo, mensaje);
          } else {
            let titulo = 'Error al listar';
            let mensaje = err.error.message.toString();
            this.mensaje = mensaje;
            // this.mostrarError(errStatus, titulo, mensaje);
          }
        }
      }
    );
  }

  mostrarError(errStatus, titulo, mensaje){
    const dialogRef = this._dialog.open( ModalErrorComponent, { 
      data: {
        titulo: titulo,
        mensaje: mensaje
      } 
    });

    dialogRef.afterClosed()
      .subscribe( () => {
          if (errStatus != 0) {

            this.resetFiltros();
            // this.getfiltros();
            // this.getDetalle(this.busqueda, this.page, this.size, this.columna, this.order);
            
          } else {
            this._router.navigate(['']);
          }
      });
  }

  selectTipo(event: Event) {
    this.selectedTipo = (event.target as HTMLSelectElement).value;
  }
  
  selectTurno(event: Event) {
    this.selectedTurno = (event.target as HTMLSelectElement).value;
  }
  
  selectOrigen(event: Event) {
    this.selectedOrigen = (event.target as HTMLSelectElement).value;
  }
  
  selectEstado(event: Event) {
    this.selectedEstado = (event.target as HTMLSelectElement).value;
    if(this.selectedEstado !== 0){
    }
    console.log("Estado: "+this.selectedEstado);
  }

  selectEtapa(event: Event) {
    this.selectedEtapa = (event.target as HTMLSelectElement).value;
    if(this.selectedEstado !== 0){
      //Buscar Etapa
      console.log("Buscar Etapa");
    } else {

    }
    console.log("Etapa: "+this.selectedEtapa);
  }

  selectProvincia(event: Event) {
    this.selectedProvincia = (event.target as HTMLSelectElement).value;
    if(this.selectedProvincia > 0){
      this.selectedLocalidad = 0;
      this._listaLoteService.getAllLocalidadesPorProvincia(this.selectedProvincia).subscribe(params => {
        this.filtroLocalidades = params.datos;
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
            let titulo = 'Error al cargar filtros';
            let mensaje = err.error.message.toString();
            this.mostrarError(errStatus, titulo, mensaje);
          }
        }
      })
    } else {
      this.selectedLocalidad = 0;
      this._listaLoteService.getAllLocalidades().subscribe(params => {
        this.filtroLocalidades = params.datos;
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
            let titulo = 'Error al cargar filtros';
            let mensaje = err.error.message.toString();
            this.mostrarError(errStatus, titulo, mensaje);
          }
        }
      })
    }
  }

  selectLocalidad(event: Event) {
    this.selectedLocalidad = (event.target as HTMLSelectElement).value;
    if(this.selectedLocalidad > 0){
      this._listaLoteService.getProvinciaPorLocalidad(this.selectedLocalidad).subscribe( params => {
        this.selectedProvincia = params.id;
        console.log("Provincia: "+this.selectedProvincia);
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
            let titulo = 'Error al cargar filtros';
            let mensaje = err.error.message.toString();
            this.mostrarError(errStatus, titulo, mensaje);
          }
        }
      })
    }
  }

  addEvent( tipo, evento ) {

    // console.log("evento value");
    // console.log(evento.value);
    // console.log("evento value");

    if (evento.value) {
      console.log("tipo "+ tipo +": "+evento.value._i.year+"-"+evento.value._i.month+"-"+evento.value._i.date);
      let fecha = evento.value._i.year+"-"+(evento.value._i.month+1)+"-"+evento.value._i.date;
  
      switch (tipo) {
        case "pickerFiltroDesde":
          this.pickerFiltroDesde = fecha;
          this.minDateHastaFiltro = evento.value;
          break;
        case "pickerFiltroHasta":
          this.pickerFiltroHasta = fecha;
          this.maxDateDesdeFiltro = evento.value;
          break;
        case "pickerLoteDesde":
          this.pickerLoteDesde = fecha;
          this.minDateHastaLote = evento.value;
          break;
          case "pickerLoteHasta":
            this.pickerLoteHasta = fecha;
            this.maxDateDesdeLote = evento.value;
            console.log(this.pickerLoteHasta);
            break;
      }
          
    } else {
      console.log("llego al else");
      const currentYear = new Date().getFullYear();

      switch (tipo) {
        case "pickerFiltroDesde":
          this.pickerFiltroDesde = null;
          this.minDateHastaFiltro = new Date(currentYear - 5, 0, 1);
          break;
        case "pickerFiltroHasta":
          this.pickerFiltroHasta = null;
          this.maxDateDesdeFiltro = new Date(currentYear + 1, 11, 31);
          break;
        case "pickerLoteDesde":
          this.pickerLoteDesde = null;
          this.minDateHastaLote = new Date(currentYear - 5, 0, 1);
          break;
        case "pickerLoteHasta":
          this.pickerLoteHasta = null;
          this.maxDateDesdeLote = new Date(currentYear + 1, 11, 31);
          break;
      }
    }

  }

  buscar(){
    this.getDetalle(this.busqueda, this.page, this.size, this.columna, this.order);
  }

  //@Debounce(1000)  
  searchCbte() {

    this.busqueda = this.buscarCbteInput.nativeElement.value;
    this.page = 0;
    this.columna = 'id';

    this.getDetalle(this.busqueda, this.page, this.size, this.columna, this.order);
  }

  consultar(id){
    let ruta = `pedidos/administracion/visualizacion/${id}`;
    this._router.navigate([ruta]);
  }

  anular(id){
    let ruta = `pedidos/administracion/anular/${id}`;
    console.log(ruta);
    this._router.navigate([ruta]);
  }

  crearLote() {
    console.log(this.selection);

    localStorage.setItem('Lote',JSON.stringify(this.selection));
    
    let ruta = `pedidos/administracion/addLote`;
    this._router.navigate([ruta]);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource2.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource2.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Articulos): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.Id + 1}`;
  }

  /**
   * Toggle sidebar open
   *
   * @param key
   */
  toggleSidebarOpen(key): void
  {
      this._fuseSidebarService.getSidebar(key).toggleOpen();
  }  

  sortData( event ) {
    this.page = 0;
    this.columna = event.active;
    
    if (event.direction !== "")
        this.order = event.direction;
    
    this.getDetalle(this.busqueda, this.page, this.size, this.columna, this.order);
  }

  redirecCrearLote(){
    //this._router.navigate();
    let ruta = `lotes/crear-lote`;
    this._router.navigate([ruta]);
  }

  paginar(e: any){
    console.log(e);
    this.page = e.pageIndex;
    this.size = e.pageSize;
    
    //this._listaLoteService.getAllLotes( this.page, this.size ); 
    this.getLotesPorEstado( this.estado, this.page, this.size ); 
  }
}
