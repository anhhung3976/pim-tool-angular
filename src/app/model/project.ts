
export interface Project {
  id: number;
  groupId: number;
  projectNumber: number;
  name: string;
  customerName: string;
  employeeDtos: [];
  status: string;
  startDate: number;
  endDate: number;
  version: number;
}
