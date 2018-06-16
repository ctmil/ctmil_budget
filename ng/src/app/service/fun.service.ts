import { Injectable } from '@angular/core';

@Injectable()
export class FunService {

  constructor() { }

  public createName(proyecto:string, cliente: string): string{
    let n = proyecto.toLowerCase().replace(/ /g, "-").replace(/\,/g, "") +
    "_" + cliente.toLowerCase().replace(/ /g, "-").replace(/\,/g, "");

    return n;
  }

  public findIndex(array:any, sel:any): number{
    let index:number = -1;

    for (let i = 0; i < array.length; i++) {
        if(array[i].indexOf(sel) >= 0){
          index = i;
          break;
        }
    }

    return index;
  }

}
