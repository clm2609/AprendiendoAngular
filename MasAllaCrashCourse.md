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