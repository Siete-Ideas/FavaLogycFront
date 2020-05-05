import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ParteArticulo } from 'app/objects/parte-articulo';

@Injectable()
export class PedidosPartesArticulosService implements Resolve<any>
{
    partesArticulo: ParteArticulo[];
    onPartesArticuloChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
        // Set the defaults
        this.onPartesArticuloChanged = new BehaviorSubject({});
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getPartesArticulos()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get products
     *
     * @returns {Promise<any>}
     */
    getPartesArticulos(): Promise<ParteArticulo[]>
    {
        console.log("entre al servicio");
        return new Promise((resolve, reject) => {
            console.log("entre al servicio2");
            this._httpClient.get('http://192.168.100.191:8080/api_favalogyc/pedidosatrabajar/articuloparte/porcodigoonombre/MPLA/0/15/id')
                .subscribe((response: any) => {
                    this.partesArticulo = response;
                    this.onPartesArticuloChanged.next(this.partesArticulo);
                    resolve(this.partesArticulo);
                }, reject);
        });
    }
}
