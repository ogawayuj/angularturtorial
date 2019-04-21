import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';

import { HeroesComponent } from './heroes/heroes.component';
import { DashbordComponent } from './dashbord/dashbord.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';

const routes: Routes = [
  {path: 'heroes', component: HeroesComponent},
  {path: 'dashboard', component: DashbordComponent },
  {path: 'detail/:id', component: HeroDetailComponent },
  {path: '', redirectTo: '/dashbord', pathMatch: 'full'}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
}


