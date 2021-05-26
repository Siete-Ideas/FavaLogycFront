// modulos angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { CustomTagModule } from 'app/shared/custom-tags/custom-tag.module';
import { MaterialDesignModule } from 'app/material-design/material-design.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// modulos fuse
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { FuseSidebarModule } from '@fuse/components';

// modulos favalogyc
import { TablaRetractilModule } from '@fava/components/tabla-retractil/tabla-retractil.module';

// componentes favalogyc
import { ControlDeCargaComponent } from './control-de-carga/control-de-carga.component';
import { ControlarCargaComponent } from './controlar-orden/controlar-orden.component';
import { PopUpOrdenControladaComponent } from './controlar-orden/popUpOrdenControlada/popUpOrdenControlada.component';

// servicios favalogyc
import { ControlDeCargaService } from './control-de-carga/control-de-carga.service';
import { ControlarOrdenService } from './controlar-orden/controlar-orden.service';


const routes: Routes = [
    {
        path     : 'control-de-carga',
        component: ControlDeCargaComponent
    },
    {
        path     : 'controlar-orden/:id',
        component: ControlarCargaComponent
    }, 
];

@NgModule({
    declarations: [
        ControlDeCargaComponent,
        ControlarCargaComponent,
        PopUpOrdenControladaComponent
    ],
    imports     : [
        CommonModule,
        HttpClientModule,
        RouterModule.forChild(routes),
        MaterialDesignModule,
        FuseSidebarModule,
        FuseSharedModule,
        FuseWidgetModule,
        CustomTagModule,
        TablaRetractilModule,
        MatProgressSpinnerModule
    ],
    providers   : [
        ControlDeCargaService,
        ControlarOrdenService,
    ]
})

export class CargaModule
{
}