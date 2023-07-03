import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {ProjectService} from "../services/project.service";
import { switchMap, map} from "rxjs";
import {Project} from "../model/project";
import {StatusEnum} from "../../constant/project-constant";
import {EnumUtils} from "../utils/EnumUtils";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProjectSearch} from "../model/project-search";

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit, AfterViewInit {
  recordTotal: number = 0;
  pageIndex: number = 0;
  status = Object.values(StatusEnum)
  projectSearchForm : FormGroup;
  EnumUtils = EnumUtils;

  displayedColumns: string[] = ['position', 'number', 'name', 'status', 'customer', 'startDate', 'delete'];
  dataSource = new MatTableDataSource<Project>([]);

  @ViewChild(MatTable)
  table!: MatTable<Project>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(private projectService: ProjectService, private formBuilder : FormBuilder) {
    this.projectSearchForm = this.formBuilder.group({
      input: ['', Validators.required],
      projectStatus: [EnumUtils.getKeyByValue(StatusEnum.NEW), Validators.required]
    });
  }


  ngOnInit(): void {
    this.loadAllProject();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator.page.pipe(
      switchMap(() => {
        return this.projectService.getAllProjects(this.pageIndex, this.paginator.pageSize);
      }),
      map((res) => {
        this.dataSource = new MatTableDataSource(res.data);
        this.recordTotal = res.recordsTotal
      })
    ).subscribe();
  }

  loadAllProject() {
    const pageIndex = this.paginator?.pageIndex ?? 0;
    const pageSize = this.paginator?.pageSize ?? 5;
    this.projectService.getAllProjects(pageIndex, pageSize).pipe(
      map(res => {
        this.dataSource = new MatTableDataSource(res.data)
        this.recordTotal = res.recordsTotal
      })).subscribe();
  }


  pageChanged(event: PageEvent | any) {
    const finalIndex = event.length / event.pageSize
    if (event.pageIndex == 0) {
      this.pageIndex = 0;
      return;
    }
    if (event.pageIndex + 1 == finalIndex) {
      this.pageIndex = event.length - event.pageSize;
      return;
    }
    if (event.previousPageIndex > event.pageIndex) {
      this.pageIndex -= 5;
      return;
    }
    this.pageIndex += 5;
    return;
  }

  onSubmitSearchForm() {
    const projectSearch : ProjectSearch = this.projectSearchForm.value;
    const pageIndex = 0;
    const pageSize = 5
    this.projectService.searchProject(pageIndex, pageSize, projectSearch).pipe(
      map(res => {
        this.dataSource = new MatTableDataSource(res.data);
        this.paginator.length  = this.recordTotal;
        this.paginator.pageIndex = 0
        this.recordTotal = res.recordsTotal;
        this.pageIndex = 0;
      })
    ).subscribe();
  }

  onResetSearchForm() {
    this.projectSearchForm.patchValue({input: "", projectStatus: EnumUtils.getKeyByValue(StatusEnum.NEW)})
    this.onSubmitSearchForm();
  }
}
