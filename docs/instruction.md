# 🚗 GarageManager — Guide d'utilisation

Bienvenue sur GarageManager, la solution moderne pour la gestion de votre garage automobile !

## Sommaire
- [Connexion & Inscription](#connexion--inscription)
- [Rôles et accès](#rôles-et-accès)
- [Navigation dans l'application](#navigation-dans-lapplication)
- [Menu Admin](#menu-admin)
- [Mode hors connexion (offline)](#mode-hors-connexion-offline)
- [Réinitialisation (Delete All)](#réinitialisation-delete-all)

---

## Connexion & Inscription
- **À l'ouverture de l'application**, vous êtes redirigé vers la page d'authentification (`/auth`).
- **Deux onglets** sont disponibles :
  - **Connexion** : pour accéder à votre compte existant.
  - **Inscription** : pour créer un nouveau compte et choisir votre rôle (propriétaire, chef garagiste, technicien, comptable).
- Après connexion, vous accédez automatiquement au tableau de bord.

## Rôles et accès
- Lors de l'inscription, choisissez un **rôle** :
  - **Propriétaire** : accès total, peut réinitialiser l'app.
  - **Chef garagiste** : gestion des réparations, véhicules, clients.
  - **Technicien** : accès aux réparations et véhicules.
  - **Comptable** : accès aux statistiques et facturation.
- L'interface s'adapte selon votre rôle (certaines actions sont réservées au propriétaire).

## Navigation dans l'application
- La **navbar horizontale** en haut permet d'accéder à toutes les sections :
  - Tableau de bord, Clients, Véhicules, Réparations, Stock, À propos, Aide, Connexion.
- Les pages principales affichent des **cards** et des images automobiles pour une expérience visuelle moderne.
- Le **footer** reste visible en bas de page.

## Menu Admin
- Si vous êtes connecté, un **menu admin** apparaît à droite de la navbar (icône automobile).
- Ce menu propose :
  - **Profil** : voir vos informations (email, rôle).
  - **Se déconnecter** : quitter la session.
  - **Delete All** : (propriétaire uniquement) réinitialise toutes les données locales.

## Mode hors connexion (offline)
- GarageManager fonctionne en **mode hors connexion** grâce à un service worker (PWA).
- Vous pouvez consulter les pages déjà visitées même sans internet.
- Pour installer l'app sur mobile ou desktop, utilisez "Ajouter à l'écran d'accueil" dans votre navigateur.

## Réinitialisation (Delete All)
- Accessible dans le menu admin (propriétaire).
- Supprime toutes les données locales et redirige vers la page d'authentification.

---

Pour toute question ou suggestion, contactez l'équipe via la page "Contact" ou consultez la section "Aide" de l'application.
