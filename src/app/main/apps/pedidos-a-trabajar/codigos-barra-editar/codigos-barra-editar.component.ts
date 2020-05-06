import {Component, ViewEncapsulation, OnInit, HostBinding} from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { PedidosCodigosBarraEditarService } from './codigos-barra-editar.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export interface CodigoBarra {
    id: number,
    articulo: {
        id: number,
        codigoArticulo: string,
        nombre: string,
        descripcion: string,
        observaciones: string,
        sysUsuario: {
            id: number,
            nombre: string,
            descripcion: string,
            usuarioActiveDirectory: string,
            usuarioGAM: string,
            usuarioAltaid: number,
            fechaAlta: number
        },
        fechaAlta: 1587840256000
    },
    codigoDeBarra: string,
    descripcion: string,
    sysUsuario: {
        id: number,
        nombre: string,
        descripcion: string,
        usuarioActiveDirectory: string,
        usuarioGAM: string,
        usuarioAltaid: number,
        fechaAlta: number
    },
    fechaAlta: number
}


const ELEMENT_DATA: CodigoBarra =
    {
        id: 1,
        articulo: {
            id: 1,
            codigoArticulo: "AKANSOP010",
            nombre: "KANEL SOPORTE P/MICROONDAS",
            descripcion: null,
            observaciones: null,
            sysUsuario: {
                id: 1,
                nombre: "Santiago Burroni",
                descripcion: "Administrador",
                usuarioActiveDirectory: "",
                usuarioGAM: "",
                usuarioAltaid: 1,
                fechaAlta: 1588086274000
            },
            fechaAlta: 1587840256000
        },
        codigoDeBarra: "7798035043002",
        descripcion: "aca viene la descripcion",
        sysUsuario: {
            id: 1,
            nombre: "Santiago Burroni",
            descripcion: "Administrador",
            usuarioActiveDirectory: "",
            usuarioGAM: "",
            usuarioAltaid: 1,
            fechaAlta: 1588086274000
        },
        fechaAlta: 1588086010000
    };

/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
    selector     : 'codigos-barra-editar',
    templateUrl  : './codigos-barra-editar.component.html',
    styleUrls    : ['./codigos-barra-editar.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})

export class PedidosCodigosBarraEditarComponent implements OnInit {
    displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
    dataSource: any;
    subParametros: Subscription;
    id:number;
    codigoArticulo:string;
    nombre:string;
    codigoDeBarra: string;
    descripcion: string;

    constructor(
        private _router: Router,
        private route: ActivatedRoute,
        private _pedidosCodigosBarraEditarService: PedidosCodigosBarraEditarService
    )
    {
        
    }

    

    ngOnInit(): void{
        
        this.subParametros = this.route.params.subscribe(params => {
            this.id = params['id'];
        })

        this._pedidosCodigosBarraEditarService.getCodigoBarra(this.id).subscribe(data => {
            this.dataSource = data;
            this.codigoDeBarra = this.dataSource.codigoDeBarra;
            this.descripcion = this.dataSource.descripcion;
            this.nombre = this.dataSource.articulo.nombre;
            this.codigoArticulo = this.dataSource.articulo.codigoArticulo;
        });        
    }

    volver(){
        let ruta = `apps/pedidos/codigos-barra/${this.codigoArticulo}`;
        this._router.navigate([ruta]);
    }

    editar(){
        this._pedidosCodigosBarraEditarService.putCodigoBarra(this.id,this.codigoDeBarra,this.descripcion).subscribe(
            data => {
              this.volver();
            },
            (err: HttpErrorResponse) => {
              if (err.error instanceof Error) {
                console.log("Client-side error");
              } else {
                console.log("Server-side error");
              }
            }
          );
    }    
}