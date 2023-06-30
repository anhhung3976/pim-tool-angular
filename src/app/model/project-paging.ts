import {Project} from "./project";

export interface ProjectPaging {
  recordsTotal: number;
  recordsFiltered: number;
  data: Project[];
  error: boolean
}
