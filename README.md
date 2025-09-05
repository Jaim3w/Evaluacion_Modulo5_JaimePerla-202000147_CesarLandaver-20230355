# 📱 Proyecto Cesar-JaimeActividad

**Integrantes:**  
- 👨‍💻 **César Geovany Landaverde Larios**  
  - Código: **20230355**  
- 👨‍💻 **Jaime Ernesto Perla Romero**  
  - Código: **20200147**

---

## 🚀 Descripción
Este proyecto fue desarrollado en **React Native con Expo**, con el objetivo de implementar navegación, conexión con Firebase y manejo de recursos como imágenes, estados y configuración de entorno.  

---

## 📦 Dependencias

### 📌 Navegación
- **@react-navigation/native**  
  Biblioteca principal de navegación en React Native. Permite gestionar rutas y pantallas dentro de la aplicación.  

- **@react-navigation/native-stack**  
  Proporciona un **stack navigator** optimizado con mejor rendimiento, ideal para aplicaciones modernas.  

- **@react-navigation/stack**  
  Versión tradicional del stack navigator, útil para manejar transiciones entre pantallas de manera apilada (como en Android/iOS).  

---

### 📌 Expo
- **expo**  
  Framework y conjunto de herramientas que simplifican el desarrollo en React Native.  

- **expo-constants**  
  Permite acceder a información del sistema y del proyecto (como nombre de la app, versión, etc.).  

- **expo-image-picker**  
  Sirve para abrir la galería o la cámara y seleccionar imágenes.  

- **expo-status-bar**  
  Proporciona un componente que controla y personaliza la barra de estado del dispositivo.  

---

### 📌 Firebase
- **firebase**  
  SDK oficial de Google para conectarse con servicios como **autenticación, base de datos en tiempo real, Firestore y almacenamiento en la nube**.  

---

### 📌 React y React Native
- **react**  
  Librería base de JavaScript para construir interfaces de usuario.  

- **react-native**  
  Framework que permite desarrollar aplicaciones móviles nativas usando React.  

---

### 📌 Utilidades
- **react-native-dotenv**  
  Permite manejar variables de entorno a través de un archivo `.env`, útil para guardar claves privadas (como API keys).  

- **react-native-gesture-handler**  
  Maneja gestos táctiles complejos (swipes, toques múltiples, arrastres). Fundamental para la navegación y componentes interactivos.  

- **react-native-safe-area-context**  
  Administra los márgenes seguros de la pantalla en dispositivos con notch, esquinas redondeadas o barras de navegación.  

- **react-native-screens**  
  Optimiza la navegación haciendo que las pantallas se rendericen de manera más eficiente.  

---

## ⚙️ Dependencias de desarrollo
- **@babel/core**  
  Compilador que transforma código moderno de JavaScript para que sea compatible con diferentes entornos.  

---

## ▶️ Scripts disponibles
- `npx expo start` → Inicia el proyecto en modo desarrollo con Expo.  
- `npm run android` → Ejecuta la app en un emulador o dispositivo Android.  
- `npm run ios` → Ejecuta la app en un simulador de iOS.  
- `npm run web` → Ejecuta la app en el navegador como aplicación web.  
