import { Component, ViewChild, ElementRef } from '@angular/core';
import { Globals } from './globals';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title:string = 'Cooperativa de Trabajo Moldeo Interactive Ltda.';
  /////////////////////////////////////////
  @ViewChild("formulario") form: ElementRef;
  @ViewChild("presupuesto") presu: ElementRef;
  @ViewChild("tiempo") tiempo: ElementRef;
  @ViewChild("etapas") etapas: ElementRef;
  @ViewChild("ifCrono") ifCrono: ElementRef;
  @ViewChild("importe") importe: ElementRef;

  public imgData:string = Globals.IMGDATA;  //Logo de Moldeo Interactive

  public presentacion:string = Globals.PRESENTACION;
  public contrato:any = Globals.CONTRATO;
  public objetivos:string = Globals.OBJETIVOS;

  constructor(){}

  ngOnInit(){
    this.createNewField();
  }

  public createNewField(): void{
    let this_ = this;
    this.presu.nativeElement.insertAdjacentHTML('beforeend', '<div style="margin:5px 0;position:relative;">\
      <input style="border:1px solid #ccc;width:33%;padding:5px;box-shadow: inset 0 1px 1px rgba(0,0,0,.075);" type="text" name="servicio" placeholder="Servicio"><input style="border:1px solid #ccc;width:44%;padding:5px;box-shadow: inset 0 1px 1px rgba(0,0,0,.075);" type="text" name="servi_des" placeholder="Descripción"><input style="border:1px solid #ccc;width:23%;padding:5px;box-shadow: inset 0 1px 1px rgba(0,0,0,.075);" type="text" name="horas" placeholder="Horas">\
      <button class="glyphicon glyphicon-trash" style="position:absolute;top:0;right:0;display:block;width:32px;height:32px;float:right;border:1px solid #ccc;"></button>\
    </div>');
    setTimeout(function(){
      for (let i = 0; i < this_.presu.nativeElement.children.length; i++) {
        this_.presu.nativeElement.children[i].querySelector('button').addEventListener("mouseup", function(e){
          this_.removeField(e);
        })
      }
    }, 10);
  }

  public removeField(e): void{
    if(e.srcElement.parentNode.parentNode){  //Previene Error por iteración
        e.srcElement.parentNode.parentNode.removeChild(e.srcElement.parentNode);
    }
  }

  public addCStage(): void{
    let stages:string = "<div style='border:1px solid #ccc;padding:5px;box-shadow: inset 0 1px 1px rgba(0,0,0,.075);'>Etapa: <span>";
    for (let i = 0; i < this.tiempo.nativeElement.children[4].value; i++) {
      stages += '<input style="margin:0 5px;width:20px;height:20px;" type="checkbox" name="stage" value="stage">';
    }
    stages += '</span></div>';
    this.etapas.nativeElement.insertAdjacentHTML('beforeend', stages);
  }

  public resetCStage(): void{
    this.etapas.nativeElement.innerHTML = "";
  }

  public generateBudget(): void{
    let doc = new jsPDF({orientation: "p", lineHeight: 1.5});
    let proyecto:string = this.form.nativeElement[0].value;
    let cliente:string = this.form.nativeElement[1].value;
    let propuesta:string = this.form.nativeElement[2].value.replace(/\n/g, " ");
    let relevamiento:string = this.form.nativeElement[3].value.replace(/\n/g, " ");
    let requerimientos:string = this.form.nativeElement[4].value.replace(/\n/g, " ");
    let importe:number = +(Number(this.importe.nativeElement.children[0].value).toFixed(2));
    let iva:number = +((importe*0.21).toFixed(2));
    let importeConIVA:number = +((importe+iva).toFixed(2));
    let moneda:string;
    if(this.importe.nativeElement.children[1].checked){
      moneda = '$';
    }else if(this.importe.nativeElement.children[3].checked){
      moneda = 'US$';
    }else{
      moneda = '$';
    }
    let horas:number = 0;

    let name:string = proyecto.toLowerCase().replace(/ /g, "-") + "_" + cliente.toLowerCase().replace(/ /g, "-");

    doc.addPage();
    doc.addPage();
    doc.addPage();

    /*HEADER*/
    doc.setPage(1);
    doc.setTextColor(20, 20, 20);
    doc.setFont("helvetica");
    doc.setFontSize(9);
    doc.setFillColor(10, 10, 10);
    doc.rect(10, 45, 190, 1, 'F');
    doc.text('Coop. de Trabajo Moldeo Interactive Ltda.', 100, 25);
    doc.setTextColor(0, 0, 240);
    doc.textWithLink('www.moldeointeractive.com.ar', 100, 30, {url: 'http://www.moldeointeractive.com.ar'});
    doc.textWithLink('info@moldeointeractive.com.ar', 100, 35, {url: 'mailto:info@moldeointeractive.com.ar'});
    doc.addImage(this.imgData, 'PNG', 10, 15);

    /*BODY 01 - DATOS*/
    doc.fromHTML(

    '<h2 style="font-family:helvetica;font-size:18px;color:#111;">Proyecto: '+proyecto+'</h2>\
    <h3 style="font-family:helvetica;font-size:14px;color:#111;">Cliente: '+cliente+'</h3>\
    <h3 style="font-family:helvetica;font-size:14px;color:#111;">Presentación</h3>\
    <p style="font-family:helvetica;font-size:11px;color:#111;">'+this.presentacion+'</p>\
    <h3 style="font-family:helvetica;font-size:14px;color:#111;">Modelo de contrato</h3>\
    <ol style="font-family:helvetica;font-size:11px;color:#111;">\
      <li>'+this.contrato[0]+'</li>\
      <li>'+this.contrato[1]+'</li>\
      <li>'+this.contrato[2]+'</li>\
      <li>'+this.contrato[3]+'</li>\
      <li>'+this.contrato[4]+'</li>\
      <li>'+this.contrato[5]+'</li>\
    </ol>\
    <h3 style="font-family:helvetica;font-size:14px;color:#111;">En caso de no cumplir los objetivos</h3>\
    <p style="font-family:helvetica;font-size:11px;color:#111;">'+this.objetivos+'</p> ',

    10,55,{'width': 180});

    /*BODY 02 - PROPUESTA, RELEVAMIENTO, REQUERIMIENTOS*/
    doc.setPage(2);
    doc.setFont("helvetica");
    doc.setTextColor(20, 20, 20);
    doc.fromHTML(

    '<h3 style="font-family:helvetica;font-size:14px;color:#111;">Propuesta</h3>\
     <p style="font-family:helvetica;font-size:11px;color:#111;">'+propuesta+'</p>\
     <h3 style="font-family:helvetica;font-size:14px;color:#111;">Relevamiento</h3>\
     <p style="font-family:helvetica;font-size:11px;color:#111;">'+relevamiento+'</p>\
     <h3 style="font-family:helvetica;font-size:14px;color:#111;">Requerimientos</h3>\
     <p style="font-family:helvetica;font-size:11px;color:#111;">'+requerimientos+'</p>\ ',

    10, 15, {'width': 180});

    /*BODY 03 - PRESUPUESTO*/
    doc.setPage(3);
    doc.setFont("helvetica");
    doc.setTextColor(20, 20, 20);
    doc.fromHTML(
    '<h3 style="font-family:helvetica;font-size:14px;">Presupuesto desglosado</h3>',
    10, 15, {'width': 180});

    let pColumns = ["Servicio", "Descripcion", "Horas"];
    let pRows = [];
    for (let i = 0; i < this.presu.nativeElement.children.length; i++) {
        let a = [];
        a[0] = this.presu.nativeElement.children[i].children[0].value;
        a[1] = this.presu.nativeElement.children[i].children[1].value;
        a[2] = this.presu.nativeElement.children[i].children[2].value;
        horas += Number(this.presu.nativeElement.children[i].children[2].value);
        pRows[i] = a;
    }
    doc.autoTable(pColumns, pRows, { startY: 30, styles: {fontSize:9} });

    /*BODY 04 - CRONOGRAMA*/
    doc.setPage(4);
    doc.setFont("helvetica");
    let poscronograma:string = '\
    <p style="font-family:helvetica;font-size:10px;">Horas de Trabajo Presupuestadas: '+horas+' Horas</p>\
    <div style="font-family:helvetica;font-size:11px;">Total sin IVA: '+moneda+' '+importe+'</div>\
    <div style="font-family:helvetica;font-size:11px;">IVA 21%: '+moneda+' '+iva+'<div>\
    <p style="font-family:helvetica;font-size:16px;font-weight:bold;">Total: '+moneda+' '+importeConIVA+'</p>\
    <p style="font-family:helvetica;font-size:11px;">Este presupuesto tiene validez por 15 días para ser aprobado.</p>';

    if(this.ifCrono.nativeElement.checked === false){
      doc.fromHTML(
      '<h3 style="font-family:helvetica;font-size:14px;">Cronograma de trabajo</h3>\ ',
      10, 15, {'width': 180});
      let cColumns = [];
      cColumns[0] = "Etapas";
      if(this.tiempo.nativeElement.children[0].checked){
        for (let i = 0; i < this.tiempo.nativeElement.children[4].value; i++) {
          let n = i+1;
          cColumns[n] = "Mes "+n;
        }
      }else if(this.tiempo.nativeElement.children[1].checked){
        for (let i = 0; i < this.tiempo.nativeElement.children[4].value; i++) {
          let n = i+1;
          cColumns[n] = "Quin. "+n;
        }
      }else if(this.tiempo.nativeElement.children[2].checked){
        for (let i = 0; i < this.tiempo.nativeElement.children[4].value; i++) {
          let n = i+1;
          cColumns[n] = "Semana "+n;
        }
      }
      let cRows = [];
      for (let i = 0; i < this.etapas.nativeElement.children.length; i++) {
        let a = [];
        let n = i+1;
        a[0] = "Etapa "+n;
        for (let u = 0; u < this.etapas.nativeElement.children[i].children[0].children.length; u++) {
          if(this.etapas.nativeElement.children[i].children[0].children[u].checked){
            a[u+1] = "X";
          }else{
            a[u+1] = "";
          }
        }
        cRows[i] = a;
      }

      doc.autoTable(cColumns, cRows, { startY: 30, styles: {fontSize:9} });
      doc.fromHTML(poscronograma, 10, doc.autoTableEndPosY()+10, {'width': 180});
      doc.setDrawColor(180, 180, 180);
      doc.line(10, doc.autoTableEndPosY()+18, 70, doc.autoTableEndPosY()+18);
      doc.setDrawColor(10, 10, 10);
      doc.line(10, doc.autoTableEndPosY()+30, 70, doc.autoTableEndPosY()+30);
    } else {
      doc.fromHTML(
      '<h3 style="font-family:helvetica;font-size:14px;">Cronograma de trabajo</h3>\
       <p style="font-family:helvetica;font-size:11px;">No Aplica.</p><br/>'+poscronograma,
       10, 15, {'width': 180});
      doc.setDrawColor(180, 180, 180);
      doc.line(10, 42, 70, 42);
      doc.setDrawColor(10, 10, 10);
      doc.line(10, 54, 70, 54);
    }

    /*FOOTER*/
    for(let i = 0; i < doc.internal.getNumberOfPages(); i++) {
      doc.setPage(i);
      doc.setDrawColor(10, 10, 10);
      doc.line(10, 280, 200, 280);
      doc.addImage(this.imgData, 'PNG', 10, 283, 30, 8.25);
      doc.setFontSize(7);
      doc.setTextColor(0, 0, 240);
      doc.textWithLink('www.moldeointeractive.com.ar', 165, 285, {url: 'http://www.moldeointeractive.com.ar'});
      doc.textWithLink('info@moldeointeractive.com.ar', 165, 288, {url: 'mailto:info@moldeointeractive.com.ar'});
    }

    /*SAVE PDF*/
    doc.save(name+'.pdf');
  }
}
