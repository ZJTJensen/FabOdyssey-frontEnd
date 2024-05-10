import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FabMainComponent } from '../fab-main/fab-main.component';
import { CardSelectComponent } from '../card-select/card-select.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { UserInfoComponent } from '../user-info/user-info.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [],
  imports: [
    FormsModule,
    CommonModule,
    CardSelectComponent,
    UserInfoComponent,
    FabMainComponent,
    NgxMaskDirective, NgxMaskPipe
  ],
  providers: [provideNgxMask()],
})
export class AppModuleModule { }
