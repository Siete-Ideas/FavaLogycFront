import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

const BASE_URL = environment.server + environment.baseUrl;

export interface BodyDetalle{

    idTipo : number;
    idTurno : number;
    idOrigen : number;
    idEstado : number;
    idEtapa : number;
    idProvincia : number;
    idLocalidad : number;
    desdePedido : string;
    hastaPedido : string;
    lote : string;
    desdeLote : string;
    hastaLote : string;
  }

@Injectable()
export class LoteCrearLoteService
{
    constructor(
        private _httpClient: HttpClient
    )
    {
    }


    /* getAllEtapasPorId(id:number): Observable<any>
    {
        let ruta = `${BASE_URL}pedidos/pedidoetapa/estado/${id}`;
        return this._httpClient.get(ruta);
    } */

    getAllEtapas(): Observable<any>
    {
        let ruta = `${BASE_URL}pedidos/pedidoetapa/`;
        return this._httpClient.get(ruta);
    }

    getAllTurnos(): Observable<any>
    {
        let ruta = `${BASE_URL}pedidos/pedidoturno/`;
        return this._httpClient.get(ruta);
    }


    getAllTransportes(): Observable<any>
    {
        let ruta = `${BASE_URL}pedidos/transporte/`;
        return this._httpClient.get(ruta);
    }

    /* getAllEstadosPorId(id:number): Observable<any>
    {
        let ruta = `${BASE_URL}pedidos/pedidoestado/etapa/${id}`;
        return this._httpClient.get(ruta);
    }*/

    /* getAllEstados(): Observable<any>
    {
        let ruta = `${BASE_URL}pedidos/pedidoestado/`;
        return this._httpClient.get(ruta);
    }  */

    getAllOrigenes(): Observable<any>
    {
        let ruta = `${BASE_URL}pedidos/pedidoorigen/`;
        return this._httpClient.get(ruta);
    }

    getAllTipos(): Observable<any>
    {
        let ruta = `${BASE_URL}pedidos/pedidotipo/`;
        return this._httpClient.get(ruta);
    }

    /* getAllLocalidades(): Observable<any>
    {
        let ruta = `${BASE_URL}pedidos/localidad/domicilio/`;
        return this._httpClient.get(ruta);
    } */

    getAllLocalidadesPorProvincia(id:number): Observable<any>
    {
        let ruta = `${BASE_URL}pedidos/localidad/domicilio/provincia/${id}`;
        return this._httpClient.get(ruta);
    }

    getAllProvincias(): Observable<any>
    {
        let ruta = `${BASE_URL}pedidos/provincia/domicilio/`;
        return this._httpClient.get(ruta);
    }

    getProvinciaPorLocalidad(id:number): Observable<any>
    {
        let ruta = `${BASE_URL}pedidos/provincia/localidad/${id}`;
        return this._httpClient.get(ruta);
    }

    getArticulos(body: BodyDetalle, busqueda, page, size, columna, order): Observable<any>
    {

        let headers = new HttpHeaders({
            "Content-Type": "application/json"
        });

        let buscar:string = '';
        if (busqueda !== ''){
            buscar = `/${busqueda}`;
        }

        let ruta = `${BASE_URL}pedidos/pedidodetalle/porcomprobanteoarticulo${buscar}/${page}/${size}/${columna}/${order}`;
        

        return this._httpClient.post(ruta, body, {headers: headers});
    }

    imprimir(lote, impresora): Observable<any>{

        let headers = new HttpHeaders({
            "Content-Type": "application/json"
        });
        console.log(impresora);
        let ruta = `${BASE_URL}pedidos/pedidolote/lote/imprimir/cupa/${lote}/${impresora}`;

        return this._httpClient.post(ruta, {headers: headers});
    } 
}
