# Class S — Site Web Officiel & Console Administrateur

> **« L'identité visuelle qui vous impose »** — Marque personnelle et studio de **Scott Nana**, Brand & Graphic Designer basé à Ouagadougou, Burkina Faso.

---

## 🌟 Présentation du Projet

Site vitrine professionnel et console d'administration sur-mesure pour **Class S** :
- **Site Public** : Présentation des réalisations, méthode en 3 étapes, mur de témoignages dynamiques, accordéon FAQ, et formulaire de contact multi-étapes conditionnel branché sur Supabase.
- **Console Administrateur (`/classs`)** : Espace de gestion sécurisé à double verrou (Google OAuth restreint + mot de passe applicatif) pour piloter les demandes de devis, les projets/galeries d'images et les témoignages clients.

---

## 🛠️ Stack Technique

- **Front-end** : React 18, TypeScript, Vite, TailwindCSS
- **Animations** : Framer Motion, GSAP, Canvas Confetti
- **Backend & Base de données** : Supabase (PostgreSQL, Storage, Auth, Row Level Security)
- **Icônes & Typographies** : Lucide React, Cormorant Garamond (Titres H1/H2), Jost (Corps de texte)

---

## 🚀 Installation & Lancement Local

1. **Cloner le projet** :
   ```bash
   git clone <url-du-repo>
   cd "Site Web Officiel"
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement** :
   Copiez `.env.example` vers `.env` et renseignez vos clés Supabase :
   ```env
   VITE_SUPABASE_URL=https://votre-projet.supabase.co
   VITE_SUPABASE_ANON_KEY=votre-cle-anonyme-supabase
   VITE_ADMIN_ALLOWED_EMAIL=wendclasss@gmail.com
   ```

4. **Lancer le serveur de développement** :
   ```bash
   npm run dev -- --host
   ```

5. **Compiler pour la production** :
   ```bash
   npm run build
   ```

---

## 🗄️ Schéma de Base de Données (Supabase)

Le script SQL complet est situé dans [`supabase/schema.sql`](supabase/schema.sql) :
- Tables `demandes`, `projets`, `projet_images`, `temoignages`, `admin_config`
- Politiques de sécurité **Row Level Security (RLS)** actives et étanches
- Configuration du bucket Supabase Storage `project-images`

---

## 🔒 Accès Administrateur

L'administration est accessible à la route privée **`/classs`** (aucun lien visible sur le site public) :
1. **Facteur 1** : Connexion Google restreinte à `wendclasss@gmail.com`.
2. **Facteur 2** : Mot de passe applicatif défini par Scott Nana.
