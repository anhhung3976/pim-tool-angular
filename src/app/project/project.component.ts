import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {EnumUtils} from "../utils/EnumUtils";
import {StatusEnum} from "../../constant/project-constant";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectService} from "../services/project.service";
import {InfoRes} from "../model/info-res";
import {map, Observable} from "rxjs";
import {ProjectActionReq} from "../model/project-action-req";
import {Project} from "../model/project";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  formGroup! : FormGroup;
  status = Object.values(StatusEnum);
  EnumUtils = EnumUtils;
  isFormValid : boolean = true;
  titlePage : string = "New Project";
  isNewPage : boolean = true;
  infoRes$! : Observable<InfoRes>;

  constructor(private formBuilder : FormBuilder, private route: ActivatedRoute,
              private projectService : ProjectService, private router: Router) {
    this.initForm();
  }

  ngOnInit() {
    const path = this.route.snapshot.url[0].path;
    this.infoRes$ = this.projectService.getInfoRes().pipe(
      map(res =>  {
        //TODO
        this.formGroup.patchValue({groupId: res.groupIdList[0]})
        return res;
      })
    );
    if (path != "new-project") {
      this.titlePage = "Edit Project"
      this.isNewPage = false;
      const projectNumber = parseInt(this.route.snapshot.paramMap.get("projectNumber")!);
      this.formGroup.controls["projectNumber"].disable();
      this.projectService.getProject(projectNumber).pipe(
        map(res => {
          const project : Project = res.body;
          this.formGroup.patchValue({
            ...project,
            projectName: project.name,
            startDate: new Date(project.startDate),
            endDate: new Date(project.endDate),
          })
          return res.body;
        }
      )).subscribe();
    } else {
      //tested
    }
  }

  createProject() {
    this.isFormValid = this.getFormValidationErrors();
    if (!this.isFormValid) {
      return;
    }
    const formValue = this.formGroup.value;
    const projectActionReq: ProjectActionReq = {
      ...formValue,
      name: formValue.projectName,
      employeeDtos: formValue.members,
    }

    this.projectService.createProject(projectActionReq).subscribe(
      res => {
        this.router.navigateByUrl("/");
      }
    )
  }

  editProject() {
    const formValue = this.formGroup.value;
    const projectActionReq : ProjectActionReq = {
      ...this.formGroup.value,
      name: formValue.projectName,
      employeeDtos: formValue.members,
    }

    this.projectService.editProject(projectActionReq).subscribe(
      res => {
        this.router.navigateByUrl("/");
      }
    )

  }
  cancel() {
    this.router.navigateByUrl("/");
  }


  closeError() {
    this.isFormValid = true;
  }

  private initForm() {
    this.formGroup = this.formBuilder.group({
      id: 0,
      projectNumber: ['', [Validators.required]],
      projectName: ['', [Validators.required]],
      customerName: ['', [Validators.required]],
      groupId: [null, Validators.required],
      members: [[]],
      status: [EnumUtils.getKeyByValue(StatusEnum.NEW), Validators.required],
      startDate: ['', Validators.required],
      endDate: [],
      version: 0
    });
  }

  private getFormValidationErrors() {
    let isValid = true;
    let controls = Object.keys(this.formGroup.controls);
    for (let key of controls) {
      const controlErrors: ValidationErrors | null = this.formGroup.get(key)!.errors;
      if (controlErrors != null) {
        // Object.keys(controlErrors).forEach(keyError => {
        //   console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        // });
        isValid = false;
        break;
      }
    }
    return isValid;
  }
}
