import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

const BASE_URL = environment.server + environment.baseUrl;

export interface BodyDetalle{

    idTipo          : number;
    idDarsena       : number;
    desdePedido     : string;
    hastaPedido     : string;
}

@Injectable()
export class CrearOrdenDistribucionService {
    constructor(
        private _httpClient: HttpClient ){ }

    getAllRemitosNuevos( body, page, size, columna, order): Observable<any> {  

        console.log("datos-> ", page, size, columna, order);

        let headers = new HttpHeaders({
            "Content-Type": "application/json"
        });

        let ruta = `${ BASE_URL }pedidos/pedidocbte/remito/${ page }/${ size }/${ columna }/${ order }`;

        return this._httpClient.post(ruta, body, {headers: headers});
    }

    crearOrdenDeDistribucion( body ){

        let headers = new HttpHeaders({
            "Content-Type": "application/json"
        });

        let ruta = `${BASE_URL}pedidos/distribucion`;
        return this._httpClient.post(ruta, body, {headers: headers});
    }
}
