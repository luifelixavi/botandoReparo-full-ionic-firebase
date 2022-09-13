import { Component, OnInit } from '@angular/core';
//import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-dados',
  templateUrl: './dados.component.html',
  styleUrls: ['./dados.component.scss'],
})
export class DadosComponent implements OnInit {


public nome: any;
public endereco: any;
public atendimento: any;
public telefone: any;
public whats: any;
public servicos: any;
public biografia: any;

  constructor() { }

  ngOnInit() {}

}
