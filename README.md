# React Weather & City Gallery

> **Application web réactive combinant prévisions météorologiques en temps réel, galerie photo dynamique et découverte culturelle.**

[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Axios](https://img.shields.io/badge/Axios-HTTP_Client-5A29E4?logo=axios&logoColor=white)](https://axios-http.com/)
[![Bootstrap 5](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Open-Meteo](https://img.shields.io/badge/API-Open--Meteo-orange)](https://open-meteo.com/)
[![Deployment](https://img.shields.io/badge/Deployment-GitHub_Pages-brightgreen?logo=github)](https://mohammed-aichour.github.io/react-weather-gallery/)

---

## 🌤️ Présentation du Projet

**React Weather & City Gallery** est une application web moderne développée sous **React 19** permettant d'explorer les prévisions météo mondiales et marocaines en temps réel, couplée à une galerie photo dynamique alimentée par API.

L'application intègre l'API **Open-Meteo** (fonctionnelle instantanément sans clé requise) pour restituer les conditions climatiques précises (températures actuelles, ressenties, humidité, vitesse du vent et prévisions hebdomadaires), ainsi que l'API **Pixabay** pour afficher une galerie visuelle haute résolution de la ville recherchée.

* **Démo en ligne** : [https://mohammed-aichour.github.io/react-weather-gallery/](https://mohammed-aichour.github.io/react-weather-gallery/)

---

## ✨ Fonctionnalités Clés

- **Météo Temps Réel & Prévisions 7 Jours** :
  - Recherche instantanée par ville (Maroc & Monde).
  - Récupération des données météo via l'API Open-Meteo.
  - Affichage des indicateurs : Température (°C), Humidité (%), Vitesse du vent (km/h), et conditions actuelles.

- **Galerie d'Images Dynamique (Pixabay API)** :
  - Chargement dynamique de photographies haute définition de la ville ciblée.
  - Pagination réactive et gestion des états de chargement (`loading states`) et d'absence de résultats (`empty states`).

- **Module Culture & Géographie (REST Countries API)** :
  - Intégration des données officielles sur le Maroc (capitale, population, devises, fuseau horaire, drapeaux).

- **Architecture Réactive sous React 19** :
  - Utilisation de hooks avancés (`useCallback`, `useMemo`, `useRef`, `useEffect`).
  - Découpage en composants modulaires (`HomePage`, `WeatherPage`, `GalleryPage`, `CulturePage`, `SearchBar`).

---

## 🏗️ Structure du Projet

```
react-weather-gallery/
├── public/
├── src/
│   ├── api/             # Connecteurs API (Open-Meteo, Pixabay, REST Countries)
│   ├── components/      # Composants modulaires (Home, Weather, Gallery, Culture, Navbar)
│   ├── App.js           # Composant racine et gestion d'état centralisée
│   ├── config.js        # Configuration sécurisée des variables d'environnement
│   └── index.js
├── .env.example         # Modèle des variables d'environnement
└── package.json
```

---

## 🚀 Installation & Lancement Local

1. **Cloner le projet** :
   ```bash
   git clone https://github.com/Mohammed-aichour/react-weather-gallery.git
   cd react-weather-gallery
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement** :
   ```bash
   npm start
   # L'application s'ouvre automatiquement sur http://localhost:3000
   ```

4. **Variables d'environnement optionnelles** :
   * Copiez `.env.example` en `.env.local` pour ajouter votre clé Pixabay optionnelle :
     ```env
     REACT_APP_PIXABAY_KEY=votre_cle_pixabay_optionnelle
     ```
   * *Note : La météo Open-Meteo fonctionne immédiatement sans aucune clé API.*

---

## 👤 Auteur

**Mohammed AICHOUR** — Élève Ingénieur en Génie Informatique, École Polytechnique d’Agadir – Universiapolis (Option Cybersécurité & Réseaux).
