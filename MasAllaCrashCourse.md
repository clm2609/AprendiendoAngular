# Mas alla del crash course

## Directivas

### Estructurales

Hemos usado en el ejemplo anterior las directivas ngFor y ngIf. Estas son directivas estructurales, es decir, que alteran la estructura del DOM. Otro ejemplo de estas podria ser ngSwicth.

### De atributo

Hay otro tipo de directivas, las directivas de atributo, llamadas asi por parecerse a atributos html. La directiva ngModel por ejemplo crearia un bindeo bidireccional de los datos:

```html
<input [(ngModel)]="user.name">
```

Otras directivas de atributo serian ngStyle que permitiria cargar estilos de forma dinamica, o ngClass, para cargar Clases de forma dinamica.

## Tuberias

Las tuberias permiten declarar transformaciones a los datos que quieres mostrar. El ejemplo mas claro es para mostrar una fecha:

```html
<!-- date format: output 'Jun 15, 2015'-->
 <p>Today is {{today | date}}</p>

 <!-- fullDate format: output 'Monday, June 15, 2015'-->
<p>The date is {{today | date:'fullDate'}}</p>
```

La tuberia se encarga de dar el formato elegido a los datos que quieres mostrar.  
Estas dos tuberias y otras [](https://angular.io/api?type=pipe) estan disponibles por defecto en Angular ([Lista de API de tuberias](https://angular.io/api?type=pipe)), aunque tambien puedes crear tus propias tuberias

## Eventos

Cuando quieres responder a los eventos del usuario utilizas un codigo del estilo ```(event)="statement"```.  
```event``` es un evento, por ejemplo ```click``` para eventos de click o  ```keydown.enter``` para eventos de pulsacion de tecla simple o ```keyup.control.shift.enter``` para eventos de pulsacion de combinacion de teclas.  
```statement``` es codigo javascript con algunas excepciones. En general suele ser una llamada a una funcion del componente.  
Por ejemplo:

```html
<input (keydown.enter)="accept()">
<button (click)="accept()">Aceptar</button>
```

Tambien se pueden usar propiedades del template en el statement:

```html
<button *ngFor="let user of users" (click)="deleteUser(user)">{{user.name}}</button>
```

## Lifecycle Hooks

Despues de crear un componente/directiva tras llamar al constructor Angular llama a los distintos metodos del ciclo de vida de un componente. Estos son:

* ```ngOnChanges()```: Se le llama tras crear el componente y cada vez que una propiedad bindeada a un input se modifica.
* ```ngOnInit()```: Se le llama una vez, tras el primero ```ngOnChanges()```.
* ```ngDoCheck()```: Se le llama cuando hay cambios que Angular no puede detectar por si mismo y despues de ```ngOnInit()```.
* ``` ngAfterContentInit()```: Responde despues de que Angular proyecte contenido externo en el componente. Se le llama tras el primer ```ngDoCheck()```.
* ```ngAfterContentChecked()```: Responde despues de que Angular compruebe el contenido proyectado en el componente. Se le llama despues de ``` ngAfterContentInit()``` y a partir de ahi, despues de cada ```ngDoCheck()```.
* ```ngAfterViewInit()```: Responde despues de que Angular incialize las vistas del componente y las vistas hijas/la vista en la que esta la driectiva. Se le llama una vez despues del primer ```ngAfterContentChecked()```.
* ```ngAfterViewChecked()```: Responde despues de que Angular compruebe las vistas del componente y las vistas hijas. Se le llama despues del primer ```ngAfterViewInit()``` y a partir de ahi despues de cada ```ngAfterContentChecked()```.
* ```ngOnDestroy()```: Limpieza antes de eliminar el componente/directiva. Se usa para darse de baja de observables y eliminar manejadores de eventos para evitar problemas de memoria. Se le llama justo antes de eliminar el componente/directiva.

## Paso de datos entre padre e hijo

### Padre a hijo mediante Input

El decorador ```@Input``` permite el paso de datos de padre a hijo:

```typescript
import { Component, Input } from '@angular/core';
@Component({
  selector: 'hijo',
  template: `
    <p>Mi padre me ha pasado el siguiente dato: {{dato}}</p>
  `
})
export class ComponenteHijo {
  @Input() dato: string;
}

```

```typescript
import { Component, Input } from '@angular/core';
@Component({
  selector: 'padre',
  template: `
    <hijo
        [dato]="dato">
    </hijo>
  `
})
export class ComponentePadre {
    dato="Yo soy tu padre";
}
```

En caso de que el dato se modifique en el padre, este se modifica automaticamente en el hijo.

### Hijo a padre mediante Output

El decorador ```@Output``` permite el paso de datos del hijo al padre. Por ejemplo un evento:

```typescript
    import { Component, EventEmitter, Input, Output } from '@angular/core';
     
    @Component({
      selector: 'app-voter',
      template: `
        <h4>{{name}}</h4>
        <button (click)="vote(true)"  [disabled]="didVote">Agree</button>
        <button (click)="vote(false)" [disabled]="didVote">Disagree</button>
      `
    })
    export class VoterComponent {
      @Input()  name: string;
      @Output() voted = new EventEmitter<boolean>();
      didVote = false;
     
      vote(agreed: boolean) {
        this.voted.emit(agreed);
        this.didVote = true;
      }
    }
```

```typescript
import { Component } from '@angular/core';
  
@Component({
  selector: 'app-vote-taker',
  template: `
    <h2>Should mankind colonize the Universe?</h2>
    <h3>Agree: {{agreed}}, Disagree: {{disagreed}}</h3>
    <app-voter *ngFor="let voter of voters"
      [name]="voter"
      (voted)="onVoted($event)">
    </app-voter>
  `
})
export class VoteTakerComponent {
  agreed = 0;
  disagreed = 0;
  voters = ['Mr. IQ', 'Ms. Universe', 'Bombasto'];
  
  onVoted(agreed: boolean) {
    agreed ? this.agreed++ : this.disagreed++;
  }
}
```

### Hijo a padre mediante variable local

Tambien puedes asignar una variable a un componente hijo, permitiendo al padre acceder a variables y funciones del hijo directamente. Siendo el hijo:

```typescript
import { Component, OnDestroy, OnInit } from '@angular/core';
  
@Component({
  selector: 'app-countdown-timer',
  template: '<p>{{message}}</p>'
})
export class CountdownTimerComponent implements OnInit, OnDestroy {
  
  intervalId = 0;
  message = '';
  seconds = 11;
  
  clearTimer() { clearInterval(this.intervalId); }
  
  ngOnInit()    { this.start(); }
  ngOnDestroy() { this.clearTimer(); }
  
  start() { this.countDown(); }
  stop()  {
    this.clearTimer();
    this.message = `Holding at T-${this.seconds} seconds`;
  }
  
  private countDown() {
    this.clearTimer();
    this.intervalId = window.setInterval(() => {
      this.seconds -= 1;
      if (this.seconds === 0) {
        this.message = 'Blast off!';
      } else {
        if (this.seconds < 0) { this.seconds = 10; } // reset
        this.message = `T-${this.seconds} seconds and counting`;
      }
    }, 1000);
  }
} 
```

Siendo el padre:

```typescript
import { Component }                from '@angular/core';
import { CountdownTimerComponent }  from './countdown-timer.component';
  
@Component({
  selector: 'app-countdown-parent-lv',
  template: `
  <h3>Countdown to Liftoff (via local variable)</h3>
  <button (click)="timer.start()">Start</button>
  <button (click)="timer.stop()">Stop</button>
  <div class="seconds">{{timer.seconds}}</div>
  <app-countdown-timer #timer></app-countdown-timer>
  `,
  styleUrls: ['../assets/demo.css']
})
export class CountdownLocalVarParentComponent { }
```

La variable local ```timer``` en el tag ```app-countdown-timer``` representa al componente hijo. Esto te da una referencia que te permite acceder a sus propiedades y metodos. Este metodo permite al template del padre acceder a los datos y metodos del hijo, pero no permite a la clase del padre acceder a ellos. Para ello debemos usar algo mas potente, como es ```@ViewChild```.

### Hijo a padre mediante ViewChild

```@ViewChild``` permite el uso de metodos del hijo desde la clase typescript, no solo desde el template. El nuevo padre quedaria asi:

```typescript
import { AfterViewInit, ViewChild } from '@angular/core';
import { Component }                from '@angular/core';
import { CountdownTimerComponent }  from './countdown-timer.component';
  
@Component({
  selector: 'app-countdown-parent-vc',
  template: `
  <h3>Countdown to Liftoff (via ViewChild)</h3>
  <button (click)="start()">Start</button>
  <button (click)="stop()">Stop</button>
  <div class="seconds">{{ seconds() }}</div>
  <app-countdown-timer></app-countdown-timer>
  `,
  styleUrls: ['../assets/demo.css']
})
export class CountdownViewChildParentComponent implements AfterViewInit {
  
  @ViewChild(CountdownTimerComponent)
  private timerComponent: CountdownTimerComponent;
  
  seconds() { return 0; }
  
  ngAfterViewInit() {
    // Redefine `seconds()` to get from the `CountdownTimerComponent.seconds` ...
    // but wait a tick first to avoid one-time devMode
    // unidirectional-data-flow-violation error
    setTimeout(() => this.seconds = () => this.timerComponent.seconds, 0);
  }
  
  start() { this.timerComponent.start(); }
  stop() { this.timerComponent.stop(); }
}
```

### Bidireccional mediante un servicio

Otra forma de comunicacion seria mediante un servicio:
Servicio:

```typescript
import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';
  
@Injectable()
export class MissionService {
  
  // Observable string sources
  private missionAnnouncedSource = new Subject<string>();
  private missionConfirmedSource = new Subject<string>();
  
  // Observable string streams
  missionAnnounced$ = this.missionAnnouncedSource.asObservable();
  missionConfirmed$ = this.missionConfirmedSource.asObservable();
  
  // Service message commands
  announceMission(mission: string) {
    this.missionAnnouncedSource.next(mission);
  }
  
  confirmMission(astronaut: string) {
    this.missionConfirmedSource.next(astronaut);
  }
}
```

Componente padre:

```typescript
import { Component } from '@angular/core';
import { MissionService } from './mission.service';
  
@Component({
  selector: 'app-mission-control',
  template: `
    <h2>Mission Control</h2>
    <button (click)="announce()">Announce mission</button>
    <app-astronaut *ngFor="let astronaut of astronauts"
      [astronaut]="astronaut">
    </app-astronaut>
    <h3>History</h3>
    <ul>
      <li *ngFor="let event of history">{{event}}</li>
    </ul>
  `,
  providers: [MissionService]
})
export class MissionControlComponent {
  astronauts = ['Lovell', 'Swigert', 'Haise'];
  history: string[] = [];
  missions = ['Fly to the moon!',
              'Fly to mars!',
              'Fly to Vegas!'];
  nextMission = 0;
  
  constructor(private missionService: MissionService) {
    missionService.missionConfirmed$.subscribe(
      astronaut => {
        this.history.push(`${astronaut} confirmed the mission`);
      });
  }
  
  announce() {
    let mission = this.missions[this.nextMission++];
    this.missionService.announceMission(mission);
    this.history.push(`Mission "${mission}" announced`);
    if (this.nextMission >= this.missions.length) { this.nextMission = 0; }
  }
}
```

Componente hijo:

```typescript
import { Component, Input, OnDestroy } from '@angular/core';
import { MissionService } from './mission.service';
import { Subscription } from 'rxjs';
  
@Component({
  selector: 'app-astronaut',
  template: `
    <p>
      {{astronaut}}: <strong>{{mission}}</strong>
      <button
        (click)="confirm()"
        [disabled]="!announced || confirmed">
        Confirm
      </button>
    </p>
  `
})
export class AstronautComponent implements OnDestroy {
  @Input() astronaut: string;
  mission = '<no mission announced>';
  confirmed = false;
  announced = false;
  subscription: Subscription;
  
  constructor(private missionService: MissionService) {
    this.subscription = missionService.missionAnnounced$.subscribe(
      mission => {
        this.mission = mission;
        this.announced = true;
        this.confirmed = false;
    });
  }
  
  confirm() {
    this.confirmed = true;
    this.missionService.confirmMission(this.astronaut);
  }
  
  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}
```

