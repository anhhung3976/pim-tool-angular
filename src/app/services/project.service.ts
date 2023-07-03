import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

import {shareReplay} from "rxjs/operators";
import {API_URL} from "../../constant/project-constant";
import {ProjectPaging} from "../model/project-paging";
import {ProjectSearch} from "../model/project-search";


@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http : HttpClient) {

  }
  getAllProjects(pageIndex : number, pageSize : number) : Observable<ProjectPaging> {
    return this.http.get<ProjectPaging>(`${API_URL}/get-data`, {
      params: {
        offset: pageIndex,
        limit: pageSize
      }
    }).pipe(
      shareReplay()
    );
  }

  searchProject(pageIndex : number, pageSize : number, projectSearch : ProjectSearch): Observable<ProjectPaging> {
    return this.http.get<ProjectPaging>(`${API_URL}/search`, {
      params: {
        offset: pageIndex,
        limit: pageSize,
        status: projectSearch.projectStatus,
        input: projectSearch.input
      },
    }).pipe(
      shareReplay()
    );
  }
}
