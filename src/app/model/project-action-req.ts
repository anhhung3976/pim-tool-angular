import {Employee} from "./employee";

export interface ProjectActionReq {
  id : number;
  groupId: number;
  projectNumber: number;
  name : string;
  customerName : string;
  status : string;
  startDate : string;
  endDate : string;
  employeeDtos: Employee[];
  version : number

}
