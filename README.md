# 🗾 Samurai Game

Un juego de acción 2D desarrollado con **Vue.js** y **Phaser 3**, donde controlas a un samurai en su épica aventura a través de diferentes mundos llenos de enemigos.

## 🎮 Descripción del Juego

Samurai Game es un juego de plataformas de acción donde el jugador controla a un guerrero samurai que debe atravesar dos mundos diferentes, enfrentándose a goblins y hongos enemigos. El juego cuenta con un sistema de combate complejo, habilidades especiales, y un sistema de puntuación que recompensa el juego hábil.

### ✨ Características Principales

- **Sistema de Combate Avanzado**: Múltiples tipos de ataques (básico, especial, poderoso)
- **Habilidad Ultimate**: Modo especial con ataques mejorados y efectos visuales únicos
- **Dos Mundos Únicos**: Cada mundo con enemigos y desafíos específicos
- **Sistema de Puntuación**: Recompensas por derrotar enemigos, penalización por muerte
- **Efectos Visuales**: Animaciones fluidas y efectos de partículas
- **Sistema de Pociones**: Elementos consumibles para recargar la ultimate
- **Diseño Responsivo**: Interfaz adaptada para diferentes tamaños de pantalla

## 🎯 Controles del Juego

### 🚶 Movimiento
- **←/A**: Mover izquierda
- **→/D**: Mover derecha  
- **W**: Saltar

### ⚔️ Combate
- **LMB (Clic Izquierdo)**: Ataque básico
- **Q**: Ataque especial
- **E**: Ataque poderoso
- **R**: Ultimate (cuando esté cargada al 100%)

### 🧪 Objetos
- **F**: Usar poción (recarga la ultimate al 100%)

### 💡 Consejos de Combate
- **Encadenar ataques** asegura un DPS óptimo y un combate más eficiente
- La **ultimate** se carga automáticamente al derrotar enemigos
- Usa las **pociones** estratégicamente para activar la ultimate en momentos críticos

## 🏗️ Estructura del Proyecto

```
phaser-samurai/
├── public/
│   ├── assets/               # Recursos gráficos del juego
│   │   ├── player/          # Sprites del jugador
│   │   ├── enemies/         # Sprites de enemigos
│   │   ├── Background/      # Fondos parallax
│   │   ├── Props/           # Objetos y decoraciones
│   │   └── Tileset/         # Texturas de terreno
│   └── index.html
├── src/
│   ├── components/          # Componentes Vue
│   │   ├── Game.vue         # Componente principal del juego
│   │   ├── MenuPrincipal.vue # Menú principal con controles
│   │   ├── MenuMuerte.vue   # Pantalla de muerte
│   │   └── MenuFinal.vue    # Pantalla de finalización
│   ├── scenes/              # Escenas de Phaser
│   │   └── GameScenes.js    # Mundo1Scene y Mundo2Scene
│   ├── entities/            # Clases de entidades
│   │   ├── Enemy.js         # Clase base de enemigos
│   │   ├── Goblin.js        # Enemigo Goblin (Mundo 1)
│   │   └── Mushroom.js      # Enemigo Hongo (Mundo 2)
│   ├── utils/               # Utilidades y sistemas
│   │   ├── PlayerUtils.js   # Funciones de combate y utilidades
│   │   ├── DebugSystem.js   # Sistema de depuración
│   │   ├── GameState.js     # Gestión del estado del juego
│   │   └── ResourceManager.js # Gestión de recursos
│   └── router/              # Configuración de rutas Vue
└── package.json
```

## 🔧 Funciones Más Importantes

### 🎮 Escenas del Juego (`GameScenes.js`)

#### `Mundo1Scene`
- **Enemigos**: Goblins con diferentes comportamientos de IA
- **Objetivo**: Llegar al portal al final del nivel
- **Mecánica especial**: Score se resetea a 0 al morir

#### `Mundo2Scene`
- **Enemigos**: Hongos con patrones de ataque únicos
- **Objetivo**: Completar el juego llegando al portal final
- **Mecánica especial**: Puntuación se mantiene entre muertes

### ⚔️ Sistema de Combate (`PlayerUtils.js`)

```javascript
// Funciones principales de combate
attackMelee(scene, player, enemies, isUltimate)      // Ataque básico
attackMelee2(scene, player, enemies, isUltimate)     // Ataque especial Q
attackMelee3(scene, player, enemies, isUltimate)     // Ataque poderoso E
attackMeleeAir(scene, player, enemies, isUltimate)   // Ataque aéreo
showDamageText(scene, x, y, damage, isUltimate)      // Efectos visuales de daño
healPlayer(scene, amount)                            // Sistema de curación
applyDamageOverTime(scene, target, damage, duration) // Daño continuo
```

### 🤖 Sistema de Enemigos

#### `Goblin.js`
- **HP**: 100 puntos
- **Comportamiento**: Patrulla, persigue al jugador, ataque cuerpo a cuerpo
- **Recompensa**: +50 puntos al ser derrotado

#### `Mushroom.js`
- **HP**: 80 puntos
- **Comportamiento**: Movimiento errático, ataques a distancia
- **Recompensa**: +75 puntos al ser derrotado

### 🛠️ Sistemas de Soporte

#### `DebugSystem.js`
- Sistema de depuración en tiempo real
- Información de rendimiento y estado del juego
- Controles de desarrollo (solo en modo debug)

#### `GameState.js`
- Gestión centralizada del estado del juego
- Persistencia de puntuaciones y progreso
- Comunicación entre componentes

## 📦 Instalación y Configuración

### Prerrequisitos
- **Node.js** (versión 14 o superior)
- **npm** o **yarn**
- Navegador web moderno

### 🚀 Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd phaser-samurai
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
```

3. **Ejecutar en modo desarrollo**
```bash
npm run serve
# o
yarn serve
```

4. **Abrir en el navegador**
```
http://localhost:8080
```

### 🏗️ Construcción para Producción

```bash
npm run build
# o
yarn build
```

Los archivos compilados se generarán en la carpeta `dist/`.

## 🎨 Tecnologías Utilizadas

- **Vue.js 3**: Framework frontend reactivo
- **Phaser 3**: Motor de juegos 2D
- **JavaScript ES6+**: Lógica del juego y componentes
- **CSS3**: Estilos y animaciones de la interfaz
- **Vue Router**: Navegación entre pantallas
- **Webpack**: Bundling y optimización

## 🎯 Mecánicas de Juego

### Sistema de Puntuación
- **Derrotar Goblin**: +50 puntos
- **Derrotar Hongo**: +75 puntos
- **Muerte en Mundo 1**: Score se resetea a 0
- **Muerte en Mundo 2**: Score se mantiene

### Sistema de Ultimate
- **Carga**: Se llena automáticamente al derrotar enemigos
- **Activación**: Presionar R cuando esté al 100%
- **Duración**: 15 segundos
- **Efectos**: Ataques mejorados, mayor daño, efectos visuales especiales

### Sistema de Vida
- **HP Máximo**: 300 puntos
- **Regeneración**: Solo mediante ultimate (lifesteal)

## 🤝 Contribución

- https://xzany.itch.io/
- https://xzany.itch.io/demon-samurai-2d-pxel-art
- https://xzany.itch.io/autumn-forest-2d-pixel-art

