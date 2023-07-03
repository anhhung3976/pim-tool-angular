import {StatusEnum} from "../../constant/project-constant";

export class EnumUtils {

  static getKeyByValue(value: string) {
    const indexOfS = Object.values(StatusEnum).indexOf(value as unknown as StatusEnum);
    return Object.keys(StatusEnum)[indexOfS];
  }
}
