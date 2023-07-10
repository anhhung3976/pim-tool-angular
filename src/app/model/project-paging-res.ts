import {Project} from "./project";

export interface ProjectPagingRes {
  recordsTotal: number;
  recordsFiltered: number;
  data: Project[];
  error: boolean
}
