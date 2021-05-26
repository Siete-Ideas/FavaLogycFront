import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from 'app/services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioGuard implements CanLoad {

  constructor(private _UsuarioService: UsuarioService) {}

  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    // return this._UsuarioService.validaToken();
    return true;
  }
}