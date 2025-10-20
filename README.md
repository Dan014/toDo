# 📱 Aplicación To-Do List – Ionic + Angular

Aplicación móvil híbrida desarrollada con **Ionic 8**, **Angular 20** y **Capacitor**, que permite gestionar una lista de tareas con soporte de categorías, almacenamiento local y configuración remota mediante **Firebase Remote Config**.

---

## 🚀 Funcionalidades principales

- Agregar nuevas tareas.  
- Marcar tareas como completadas.  
- Eliminar tareas.  
- Crear, editar y eliminar categorías.  
- Asignar una categoría a cada tarea.  
- Filtrar tareas por categoría.  
- Activar o desactivar el módulo de categorías desde **Firebase Remote Config**.

---

## ⚙️ Requisitos e instalación

### Requisitos previos
- **Node.js:** 20.19.5  
- **npm:** 10.8.2  
- **Android Studio** (Gradle y SDK configurados)  
- **Firebase Console** (para el Remote Config)


# 📱 Aplicación To-Do List – Ionic + Angular


¿Cuáles fueron los principales desafíos que enfrentaste al implementar 
las nuevas funcionalidades?

El principal desafío fue integrar componentes standalone dentro de una estructura Angular más tradicional, lo que implicó ajustar la configuración de módulos, rutas y dependencias para mantener la compatibilidad. Además, fue necesario adaptar el flujo de compilación de Ionic con Capacitor y Gradle para asegurar que las nuevas funcionalidades (como la gestión de categorías y la configuración remota con Firebase) se comportaran correctamente tanto en el entorno web como en Android.

¿Qué técnicas de optimización de rendimiento aplicaste y por qué?

Se implementó lazy loading para cargar los módulos y componentes solo cuando son necesarios, reduciendo significativamente el tiempo de arranque de la aplicación.
También se trabajó con componentes standalone para simplificar dependencias, mejorar la modularidad y optimizar la detección de cambios.

¿Cómo aseguraste la calidad y mantenibilidad del código?

Se mantuvo una arquitectura modular y clara, separando responsabilidades en servicios, modelos y componentes.
El código se estructuró siguiendo las convenciones de Angular y Ionic, con nombres descriptivos, tipado estricto en TypeScript y comentarios en las secciones críticas.

### Instalación
```bash
git clone https://github.com/tuusuario/ionic-todo.git
cd ionic-todo
npm install
