import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ProjectComponent} from "./project/project.component";
import {ProjectListComponent} from "./project-list/project-list.component";
import {EDIT_PROJECT, LOGIN, NEW_PROJECT} from "../constant/project-constant";
import {LoginComponent} from "./login/login.component";

const routes : Routes = [
  {
    path: '',
    component: ProjectListComponent
  },
  {
    path: LOGIN,
    component: LoginComponent
  },
  {
    path: NEW_PROJECT,
    component: ProjectComponent
  },
  {
    path: `${EDIT_PROJECT}/:projectNumber`,
    component: ProjectComponent
  },
  {
    path: '**',
    redirectTo: '/'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
