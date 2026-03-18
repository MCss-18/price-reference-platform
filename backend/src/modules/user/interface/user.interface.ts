import { BaseInterface } from "../../../core/interface/base.interface";

export interface User extends BaseInterface {
  userId: number;
  names: string;
  surnames: string;
  username: string;
  email?: string;
  password?: string;
  rolId?: number;
  rolUser?: string;
  state: boolean;
}

export interface UserActiveDTO {
  userId: number;
  names: string;
  surnames: string;
}