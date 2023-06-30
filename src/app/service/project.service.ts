import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

import {map, shareReplay} from "rxjs/operators";
import {Project} from "../model/project";
import {API_URL} from "../../constant/project-constant";
import {ProjectPaging} from "../model/project-paging";


@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(private http : HttpClient) {
  }

  getAllProjects(pageIndex : number, pageSize : number) : Observable<Project[]> {
    return this.http.get<ProjectPaging>(`${API_URL}/get-data`, {
      params: {
        offset: pageIndex,
        limit: pageSize
      }
    }).pipe(
      map((res : ProjectPaging) => res.data),
      shareReplay()
    );
  }
}
