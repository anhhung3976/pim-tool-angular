import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {ProjectService} from "../services/project.service";
import {switchMap, map, tap} from "rxjs";
import {Project} from "../model/project";
import {StatusEnum} from "../../constant/project-constant";
import {EnumUtils} from "../utils/EnumUtils";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProjectSearch} from "../model/project-search";
import {SelectionModel} from "@angular/cdk/collections";

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit, AfterViewInit {
  recordTotal: number = 0;
  pageIndex: number = 0;
  pageSize: number = 5;
  status = Object.values(StatusEnum);
  selectedItems = new SelectionModel<Project>(true, []);

  projectSearchForm : FormGroup;
  EnumUtils = EnumUtils;
  StatusEnum = StatusEnum;
  displayedColumns: string[] = ['select', 'number', 'name', 'status', 'customer', 'startDate', 'delete'];
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
        this.recordTotal = res.recordsTotal;
        this.selectedItems = new SelectionModel<Project>(true, []);
      })
    ).subscribe();
  }

  loadAllProject() {
    // const pageIndex = this.paginator?.pageIndex ?? 0;
    // const pageSize = this.paginator?.pageSize ?? 5;
    this.projectService.getAllProjects(this.pageIndex, this.pageSize).pipe(
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
    this.projectService.searchProject(this.pageIndex, this.pageSize, projectSearch).pipe(
      map(res => {
        this.dataSource = new MatTableDataSource(res.data);
        this.paginator.length  = this.recordTotal;
        this.paginator.pageIndex = 0
        this.pageIndex = 0;
        this.recordTotal = res.recordsTotal;
      })
    ).subscribe();
  }

  onResetSearchForm() {
    this.pageIndex = 0;
    this.projectSearchForm.reset({input: "", projectStatus: EnumUtils.getKeyByValue(StatusEnum.NEW)})
    this.onSubmitSearchForm();
  }

  onProjectToggled(project : Project) {
    this.selectedItems.toggle(project);
  }

  deleteItem(project : Project) {
    this.projectService.deleteProjects([project.id]).pipe(
      tap(() => {
        this.selectedItems = new SelectionModel<Project>(true, []);
        this.loadAllProject();
      })
    ).subscribe();

  }

  deleteItems() {
    const projectsInvalid = this.selectedItems.selected.filter(project => project.status != EnumUtils.getKeyByValue(StatusEnum.NEW));
    if (projectsInvalid.length > 0) {
      alert("Can only delete the project with status new");
    } else {
      const ids = this.selectedItems.selected.map(project => project.id);
      this.projectService.deleteProjects(ids).pipe(
        tap(() => {
          this.selectedItems = new SelectionModel<Project>(true, []);
          this.loadAllProject();
        })
      ).subscribe();
    }
  }

}
