import { Injectable } from '@angular/core';

@Injectable()
export class FunService {

  constructor() { }

  public createName(proyecto:string, cliente: string): string{
    let n = proyecto.toLowerCase().replace(/ /g, "-").replace(/\,/g, "") +
    "_" + cliente.toLowerCase().replace(/ /g, "-").replace(/\,/g, "");

    return n;
  }

}
