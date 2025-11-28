# Multiverso Hub 🌌

**Multiverso Hub** es una aplicación móvil desarrollada con **React Native** y **Expo** que permite explorar un universo de personajes. La aplicación gestiona listados, detalles de personajes, una lista de favoritos persistente y soporta navegación por pestañas (tabs), modo oscuro/claro y detección de estado de conexión (offline/online).

## 🚀 Características

* **Explorador de Personajes:** Visualización de listas y detalles individuales (`/character/[id]`).
* **Favoritos:** Gestión de personajes favoritos usando Context API y persistencia de datos.
* **Modo Offline:** Detección de red y banner de aviso cuando no hay conexión.
* **Temas:** Soporte para modo Claro y Oscuro (Dark Mode).
* **Navegación Fluida:** Implementada con Expo Router (File-based routing).

## 🛠️ Tecnologías Utilizadas

* [React Native](https://reactnative.dev/)
* [Expo](https://expo.dev/) (SDK 52+ recomendado)
* [TypeScript](https://www.typescriptlang.org/)
* **Expo Router**: Para la navegación.
* **React Context**: Para el manejo de estado global (Favoritos y Tema).
* **AsyncStorage**: Para persistencia de datos local.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

* [Node.js](https://nodejs.org/) (Versión LTS recomendada).
* Un dispositivo físico con la app **Expo Go** instalada (Android/iOS) o un emulador configurado.

## 🔧 Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/tu-usuario/multiverso-hub.git](https://github.com/tu-usuario/multiverso-hub.git)
    cd multiverso-hub
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    # O si usas yarn:
    # yarn install
    ```

## ⚡ Ejecutar la Aplicación

Para iniciar el servidor de desarrollo, ejecuta el siguiente comando en tu terminal:

```bash
npx expo start
