# Phaser Samurai

Un juego de plataformas 2D desarrollado con Phaser 3 y Vue.js, donde controlas a un samurái con habilidades especiales y combate.

## Características

- Sistema de combate con múltiples ataques
- Habilidad ultimate con espada de fuego
- Enemigos (Goblins) con IA básica
- Sistema de vida y daño
- Múltiples niveles
- Efectos visuales y animaciones fluidas
- Sistema de colisiones y física

## Controles

- **W**: Saltar
- **A**: Moverse a la izquierda
- **D**: Moverse a la derecha
- **LMB**: Ataque básico
- **Q**: Ataque especial 1
- **E**: Ataque especial 2
- **R**: Activar ultimate (cuando la barra está llena)

## Instalación

```bash
npm install
```

### Desarrollo
```bash
npm run serve
```

### Producción
```bash
npm run build
```

## Estructura del Proyecto

```
src/
├── assets/           # Recursos gráficos y sonoros
├── components/       # Componentes Vue
│   ├── Game.vue     # Componente principal del juego
│   ├── LoadingOverlay.vue
│   ├── MenuFinal.vue
│   ├── MenuMuerte.vue
│   └── MenuPrincipal.vue
├── router/          # Configuración de rutas
│   └── index.js
├── scenes/          # Escenas del juego
│   └── GameScenes.js # Contiene Mundo1Scene y Mundo2Scene
├── store/           # Estado global (Vuex)
│   └── game.js
├── utils/           # Utilidades y sistemas
│   ├── DebugSystem.js
│   ├── EventBus.js
│   ├── GameState.js
│   ├── ObjectPool.js
│   └── ResourceManager.js
├── App.vue          # Componente raíz
└── main.js          # Punto de entrada

public/
├── assets/          # Recursos estáticos
├── favicon.ico
└── index.html
```

### Descripción de Componentes Principales

- **Game.vue**: Componente principal que inicializa y gestiona el juego
- **MenuPrincipal.vue**: Menú de inicio del juego
- **MenuMuerte.vue**: Pantalla de game over
- **MenuFinal.vue**: Pantalla de victoria

### Sistemas de Utilidad

- **DebugSystem**: Sistema de depuración para desarrollo
- **EventBus**: Sistema de eventos para comunicación entre componentes
- **GameState**: Gestión del estado del juego
- **ObjectPool**: Sistema de reutilización de objetos para optimización
- **ResourceManager**: Gestión de recursos del juego

## Tecnologías Utilizadas

- Phaser 3
- Vue.js
- JavaScript/ES6+

## Personalización

Para configurar el proyecto, consulta la [Referencia de Configuración de Vue CLI](https://cli.vuejs.org/config/).
