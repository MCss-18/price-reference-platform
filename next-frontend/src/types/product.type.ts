import { BaseInterface } from "@/core/base-type";

export type Product =  BaseInterface & {
  productCode: string;
  productCode2: string;
  description: string;
  state: number;
}