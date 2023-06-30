import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {ProjectService} from "../service/project.service";
import {Observable, tap} from "rxjs";
import {Project} from "../model/project";
import {ProjectPaging} from "../model/project-paging";

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['position', 'number', 'name', 'status', 'customer', 'startDate', 'delete'];
  projectList$! : Observable<Project[]>;
  recordTotal: number = 0;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(private projectService : ProjectService) {

  }

  ngOnInit(): void {
    console.log("called");
    this.loadAllProject();
  }

  ngAfterViewInit() {
    this.paginator!.page.pipe(
        tap(() => this.loadAllProject()),
    ).subscribe();
  }

  loadAllProject() {

    const pageIndex = this.paginator?.pageIndex ?? 0;
    const pageSize = this.paginator?.pageSize ?? 5;
    this.projectList$ =  this.projectService.getAllProjects(pageIndex, pageSize).pipe(

    );
  }

}
