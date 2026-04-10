import { BaseInterface } from "@/core/base-type";

export interface User extends BaseInterface{
  userId: number;
  names: string;
  surnames: string;
  username: string;
  email?: string;
  password?: string;
  rolId: number;
  rolUser: string;
  state: boolean;
}