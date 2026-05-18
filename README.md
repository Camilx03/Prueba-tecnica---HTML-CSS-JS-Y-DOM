# Todo List - Prueba Técnica

Esta es mi prueba técnica del bootcamp. He creado una todo list con temática de Camilo's Original Motor Works inspirada en GTA Online.

## Tecnologías usadas

- HTML5
- CSS3
- JavaScript Vanilla

## Lo que he hecho

He creado una aplicación de lista de tareas funcional. La aplicación tiene:

- Un header con el logo del taller, estadísticas y barra de progreso
- Un formulario para añadir tareas nuevas
- Una lista de tareas dinámica gestionada con JavaScript
- Filtros para ver todas, pendientes o completadas
- Botones para desmarcar, eliminar completadas o eliminar todas las tareas
- Modo oscuro y modo claro
- Un footer con el nombre del taller

## Estructura del proyecto

```
todo-list/
├── index.html
├── css/
│   └── styles.css
└── js/
    └── app.js
```

## Funcionalidades JavaScript

- Añadir tareas con el botón o con la tecla Enter
- Marcar tareas como completadas con checkbox
- Las tareas completadas se van al final automáticamente
- Eliminar tarea individual con el botón X
- Eliminar todas las tareas completadas
- Eliminar todas las tareas
- Desmarcar todas las tareas de golpe
- Filtros: todas / pendientes / completadas
- Persistencia con localStorage — las tareas se guardan al recargar
- El filtro activo y el modo oscuro también se recuerdan

## Mejoras visuales y de usuario

- Mensaje "¡Todo listo! Buen trabajo 🏁" cuando se completan todas las tareas
- Flash verde en el input al añadir una tarea
- Contador de caracteres en el input (máximo 80)
- Botón Añadir deshabilitado si el input está vacío
- No permite tareas duplicadas
- Hora de creación en cada tarea
- Animación de salida al eliminar una tarea
- Mensaje "No hay trabajos en cola" cuando la lista está vacía
- Modo oscuro / modo claro con botón en el header
- Botones desactivados cuando no tienen efecto

## Responsive — Mobile First

He aplicado mobile first, los estilos base están pensados para móvil y se van añadiendo ajustes para pantallas más grandes con min-width:

- Base: móvil vertical
- 568px: móvil horizontal
- 600px: tablet
- 900px: escritorio

## Cosas que he aprendido

- A usar HTML5 semántico con etiquetas como header, main, section, footer
- A hacer checkboxes personalizados solo con CSS3
- A usar flexbox para maquetar
- A aplicar mobile first con media queries y min-width
- A usar nth-child para alternar colores en la franja del header
- A manipular el DOM con JavaScript Vanilla
- A usar addEventListener, querySelector, createElement y classList
- A guardar datos en localStorage
- A trabajar con el patrón Single Source of Truth