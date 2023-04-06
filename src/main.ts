import 'zone.js/dist/zone';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { BehaviorSubject, of, interval, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main.html',
})
export class App implements OnInit {
  // Creando un observable
  public name$ = of('Angular');
  public name!: string;

  public suscriptor2$!: Subscription;

  // Creando observables que emite respuesta, cada vez que recibe respuesta, a cada subscriptor
  public obs1$ = new BehaviorSubject<number>(0);

  public obs2$ = new BehaviorSubject<string>('hola');

  public obs3$ = new BehaviorSubject<boolean>(false);

  // crea un observable que desde 0 va aumentando en 1 dependiendo del tiempo en milisegundos que reciba la función, este para su posterior uso debe ser si o si asociada a una variable.
  public inter = interval(1000);

  // suscriptor1$ se transforma en un suscriptiror de inter.
  private suscriptor1$ = this.inter.subscribe((res) => {
    // console.log(res);
  });

  ngOnInit() {
    // Después de 5 segundos suscriptor1$ se desvincula de inter.
    setTimeout(() => {
      this.suscriptor1$.unsubscribe();
    }, 5000);
  }

  constructor() {
    this.name$ // = 'Angular'
      // Dentro de pipe va codigo que intevendra, como un middleware, la respuesta de subscribe (el dato final del observable)
      .pipe(
        // con map se puede acceder al dato final y modificar la respuesta si se usará subscribe
        map((data) => {
          console.log(data); //salida: 'Angular'
          return data + ' mapping'; //retorna: 'Angular mapping'
        })
      )
      // Al subscribirse podemos acceder al dato final del observable
      .subscribe((res) => {
        this.name = res; // res: 'Angular mapping'
      });

    this.obs1$.subscribe((res) => {
      console.log('Number: ' + res);
    });
    this.suscriptor2$ = this.obs2$.subscribe((res) => {
      console.log('String: ' + res);
    });
    this.obs3$.subscribe((res) => {
      console.log('Boolean: ' + res);
    });
  }

  // Con next enviamos un nuevo valor final al observable
  addNumber() {
    this.obs1$.next(1);
  }
  addString() {
    this.obs2$.next('adios');
  }
  addBoolean() {
    this.obs3$.next(true);
  }

  removeObs2() {
    this.suscriptor2$.unsubscribe();
  }
}

bootstrapApplication(App);
