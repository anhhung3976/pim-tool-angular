import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {ProjectService} from "../services/project.service";
import {switchMap, map, tap, BehaviorSubject, Observable} from "rxjs";
import {Project} from "../model/project";
import {StatusEnum} from "../../constant/project-constant";
import {EnumUtils} from "../utils/EnumUtils";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProjectSearchReq} from "../model/project-search-req";
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

  private subject = new BehaviorSubject<Boolean>(false);
  isSearchClicked$ : Observable<Boolean> = this.subject.asObservable();

  // isSearchClicked : boolean = false;
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
    this.pageIndex = this.paginator.pageIndex;
    return;
  }

  onSubmitSearchForm(isReset : boolean) {
    const projectSearch : ProjectSearchReq = this.projectSearchForm.value;
    this.projectService.searchProject(0, this.pageSize, projectSearch).pipe(
      map(res => {
        this.dataSource = new MatTableDataSource(res.data);
        this.paginator.length  = this.recordTotal;
        this.paginator.pageIndex = 0
        this.pageIndex = 0;
        this.recordTotal = res.recordsTotal;
        this.subject.next(!isReset);
        // this.isSearchClicked = !isReset;
      })
    ).subscribe();
  }

  onResetSearchForm() {
    this.pageIndex = 0;
    this.projectSearchForm.reset({input: "", projectStatus: EnumUtils.getKeyByValue(StatusEnum.NEW)});
    this.onSubmitSearchForm(true);
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
