import {Employee} from "./employee";

export interface InfoRes {
  groupIdList : number[];
  statusList: string[];
  employeeDtos: Employee[];
}
