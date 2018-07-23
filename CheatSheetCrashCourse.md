# Angular 6 Crash Course

## Creando el proyecto

```console
$ ng new NombreDelProyecto --style=scss --routing
```

Crea un nuevo proyecto de angular, con todo lo necesario para un inicio rapido. Incluye el css en formato sass y un archivo de routing.

```console
$ ng serve -o
```

Sirve el proyecto en 0.0.0.0:4200, se abre una nueva pestaña del navegador.

## Creando componentes y servicios

```console
$ ng generate component NombreDelComponente
$ ng g c NombreDelComponente
```

Genera componentes y hace todo lo necesario para poder acceder a ellos directamente. Genera un template html, estilos (en el formato que quieras), el componente en ts y tests.

```console
$ ng generate service NombreDelServicio
```

Genera servicios y hace todo lo necesario para poder acceder a ellos directamente. Genera el servicio en ts y tests.

## Routing
En  /src/app/app-routing.module.ts:

```typescript
import { UsersComponent } from './users/users.component';
...
const routes: Routes = [
  {
    path: '',
    component: UsersComponent
  },
  ...
];
```

Una vez generados los componentes los añades a las rutas para poder acceder a ellos.

Para cargarlos en tu html añade ahora ```<router-outlet></router-outlet>``` en tu template. Para acceder a ellos se hace con un link ```<a routerLink="">Link</a>``` pero sin href.

## Peticiones a un servidor

En /src/app/data.service.ts:

```typescript
...
import { HttpClient } from '@angular/common/http';
...
  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get('https://jsonplaceholder.typicode.com/users')
  }
...
```

En /src/app/app.module.ts:

```typescript
...
import { HttpClientModule } from '@angular/common/http';
...
imports: [
    ...
    HttpClientModule,  
  ],
...
```

Una vez tienes el HttpClient en el servicio y el HttpClientModule en los modulos puedes realizar peticiones http. Si importas el servicio y llamas a la funcion getUsers recibiras el json con los usuarios.

## Mostrando datos
Ya podemos conseguir los datos, pero aun no los mostramos. Para mostrarlos nuestros componentes tienen que tener acceso al servicio.

```typescript
...
import { DataService } from '../data.service';
import { Observable } from 'rxjs';
export class UsersComponent implements OnInit {
  users$: Object;
  constructor(private data: DataService) { }
  ngOnInit() {
    this.data.getUsers().subscribe(
      data => this.users$ = data 
    );
  }
}
```

Para que el componente disponga de los datos usamos un observable. Notar que la variable users acaba con un ```$```. Esto es por convencion. Cuando se tiene un observable se representa la variable con un ```$``` al final.  
Ahora que ya tenemos los datos en el componente procedemos a mostrarlos. Para ellos usamos la directiva estructural *ngFor y los brackets de interpolacion.

```html
<ul>
  <li *ngFor="let user of users$">
    <a routerLink="/details/{{user.id}}">{{ user.name }}</a>
    <ul>
      <li>{{ user.email }}</li>
      <li><a href="http://{{ user.website }}">{{ user.website }}</a></li>
    </ul>
  </li>
</ul>
```

## Parametros de la URL

Para recoger los parametros de la URL tenemos qeu usar ActivatedRoute en /src/app/details/details.component.ts:

```typescript
...
import { ActivatedRoute } from "@angular/router";
...
constructor(private route: ActivatedRoute, private data: DataService) { 
  this.route.params.subscribe( params => this.user$ = params.id );
}
...
```

Con esto tenemos el id del usuario que queremos mostrar y despues de forma analoga al caso anterior mostramos los datos.

## Class Binding

Un caso habitual es querer que se muestre una clase html u otra en funcion de ciertas condiciones.  
Esto se consigue asi:

```html
<a routerLink="" [class.activated]="currentUrl == '/'">
```

```activated``` es la clase que quieres que funcione en caso de que se cumpla la condicion y ```currentUrl == '/'``` es la condicion. En este caso, sirve para destacar en que pagina se esta, aplicando un estilo en caso de estar en la ruta ```/```.  
Para saber si se esta en esa ruta se usa ```Router``` y ```NavigationEnd``` de @angular/router. En /src/app/sidebar/sidebar.component.ts:

```typescript
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

export class SidebarComponent implements OnInit {
  currentUrl: string;
  constructor(private router: Router) {
    router.events.subscribe((_: NavigationEnd) => this.currentUrl = _.url);
  }
  ngOnInit() {}
}
```

## Construyendo la aplicacion

Para construir la aplicacion se usa:

```console
$ ng build
```

Esto crea un directorio dist. Aunque ocupa mucho. Para conseguir una aplicacion para entornos de produccion se debe usar

```console
$ ng build --prod
```

Tambien se puede modificar el archivo package.json:

```javascript
...
"scripts": {
  ...
    "build-prod": "ng build --prod",
  },
...
```

Asi añades el nuevo comando a los npm, pudiendo ejecutarlo con:

```console
$ npm run build-prod
```

Aunque en nuestro ejemplo esto da un error. Para resolverlo modificamos details.component.html para rodearlo con una directiva que compruebe que existe un usuario antes de intentar mostrarlo, resultando en un error:

```html
<div *ngIf="user$">
...
</div>
```
