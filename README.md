# Gestion des Salles et des Réservations

Application web permettant de consulter la disponibilité des salles et de gérer les réservations de manière centralisée, avec authentification par rôles (employé, gestionnaire, administrateur).

## Stack technique

- **Frontend** : React (Vite), Axios, react-big-calendar, date-fns
- **Backend** : Node.js, Express.js, Sequelize, JWT (jsonwebtoken), bcrypt, multer
- **Base de données** : PostgreSQL

## Structure du projet

```
gestion-salles-reservations/
├── backend/        # API Express (routes, contrôleurs, modèles Sequelize)
└── uploads/        # Photos des salles (généré automatiquement au démarrage du backend)
├── frontend/       # Application React (Vite)
```

## Prérequis

- Node.js (version LTS)
- PostgreSQL installé et démarré

## Installation

### 1. Cloner le projet

```bash
git clone <url_du_depot>
cd gestion-salles-reservations
```

### 2. Backend

```bash
cd backend
npm install
```

Crée un fichier `.env` dans `backend/` en te basant sur `backend/.env.example` :

```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gestion_salles
DB_USER=postgres
DB_PASSWORD=ton_mot_de_passe
JWT_SECRET=une_chaine_secrete_longue_et_aleatoire
```

Crée la base de données :

```bash
psql -U postgres -c "CREATE DATABASE gestion_salles;"
```

Lance le serveur (les tables sont créées automatiquement au premier démarrage) :

```bash
npm run dev
```

Le backend est disponible sur `http://localhost:5000`.

### 3. Frontend

Dans un second terminal :

```bash
cd frontend
npm install
npm run dev
```

L'application est disponible sur `http://localhost:5173`.

## Premiers pas

1. Ouvrir `http://localhost:5173`
2. Cliquer sur "Créer un compte" et choisir un rôle (employé, gestionnaire ou administrateur)
3. Se connecter
4. En tant que gestionnaire/administrateur : créer des équipements, puis une ou plusieurs salles
5. En tant qu'employé : rechercher une disponibilité et réserver un créneau
6. En tant que gestionnaire/administrateur : confirmer ou annuler la réservation depuis "Gestion des réservations"

## Rôles et permissions

| Action | Employé | Gestionnaire | Admin |
|---|---|---|---|
| Rechercher / réserver une salle | ✅ | ✅ | ✅ |
| Consulter / annuler ses propres réservations | ✅ | ✅ | ✅ |
| Confirmer / annuler n'importe quelle réservation | ❌ | ✅ | ✅ |
| Créer une salle ou un équipement | ❌ | ✅ | ✅ |
| Consulter les statistiques d'occupation | ❌ | ✅ | ✅ |
| Supprimer une salle ou un équipement | ❌ | ❌ | ✅ |

## Fonctionnalités principales

- Authentification JWT avec gestion des rôles
- CRUD des salles, avec équipements associés et photo
- Recherche de disponibilité avec détection des chevauchements
- Création de réservation protégée par transaction (anti double-booking)
- Workflow de validation (en attente / confirmée / annulée)
- Calendrier interactif des réservations (jour / semaine / mois)
- Notifications automatiques (confirmation, annulation)
- Statistiques d'occupation (taux d'utilisation, créneaux les plus demandés)

## Tests

L'ensemble des endpoints a été testé manuellement avec Postman tout au long du développement.

## Limites connues

- Le rafraîchissement de l'interface se fait par sondage périodique (toutes les 8 secondes), pas par WebSockets.
- Un gestionnaire peut confirmer une réservation dont il est lui-même l'auteur (pas de séparation stricte demandeur/validateur).
- La modification d'une réservation existante (déplacement de créneau) n'a pas été conservée dans la version finale — voir le rapport du Sprint 2 pour le détail de cette décision.

## Auteur
[ThorneVyzaard](https://github.com/ThorneVyzaard)
