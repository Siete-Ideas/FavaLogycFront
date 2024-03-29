import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { observeOn } from 'rxjs/operators';

const BASE_URL = environment.server + environment.baseUrl;

export interface BodyDetalle{

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

@Injectable()
export class ControlDeCargaService {
    arregloDeDetalles;
    idLote;
    modo;
    
    constructor( private _httpClient: HttpClient ) {}

    getAllOrdenes(  page, size, columna, order ): Observable<any>{  
        
        let ruta = `${ BASE_URL }pedidos/distribucion/estado/NUEVO/${ page }/${ size }/${ columna }/${ order }`;

        return this._httpClient.get(ruta);
    } 
    
    getOrdenById ( idOrdenDist: number ): Observable<any>{    
        
        let ruta = `${ BASE_URL }pedidos/distribucion/${ idOrdenDist }`;
        return this._httpClient.get(ruta);
    }

    getOrdenDistribucionPorCupa ( cupa ): Observable<any>{  
        
        let ruta = `${ BASE_URL }pedidos/distribucion/cupa/${ cupa }`; 

        return this._httpClient.get(ruta);
    }
    
}
