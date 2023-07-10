import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {shareReplay} from "rxjs/operators";
import {API_URL} from "../../constant/project-constant";
import {ProjectPagingRes} from "../model/project-paging-res";
import {ProjectSearchReq} from "../model/project-search-req";
import {MvcRes} from "../model/mvc-res";
import {InfoRes} from "../model/info-res";
import {ProjectActionReq} from "../model/project-action-req";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http : HttpClient) {

  }
  getAllProjects(pageIndex : number, pageSize : number) : Observable<ProjectPagingRes> {
    return this.http.get<ProjectPagingRes>(`${API_URL}/get-data`, {
      params: {
        offset: pageIndex,
        limit: pageSize
      }
    }).pipe(
      shareReplay()
    );
  }

  searchProject(pageIndex : number, pageSize : number, projectSearch : ProjectSearchReq): Observable<ProjectPagingRes> {
    return this.http.get<ProjectPagingRes>(`${API_URL}/search`, {
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

  deleteProjects(projectIds : number[]) : Observable<MvcRes> {
    return this.http.delete<MvcRes>(`${API_URL}/delete-project`, {
        body: projectIds
    })
  }

  getInfoRes(): Observable<InfoRes> {
    return this.http.get<InfoRes>(`${API_URL}/get-group-status`, {
      params: {
        input: ''
      }
    }).pipe(
      shareReplay()
    );
  }

  getProject(projectNumber : number) : Observable<MvcRes> {
    return this.http.get<MvcRes>(`${API_URL}/get-project/${projectNumber}`).pipe(
      shareReplay()
    )
  }

  createProject(projectCreateReq : ProjectActionReq) : Observable<MvcRes> {
   return  this.http.post<MvcRes>(`${API_URL}/new-project`, projectCreateReq).pipe(
      shareReplay()
    )
  }

  editProject(projectEditReq: ProjectActionReq) : Observable<MvcRes> {
    return this.http.post<MvcRes>(`${API_URL}/update-project/${projectEditReq.projectNumber}`, projectEditReq).pipe(
      shareReplay()
    )
  }



}
