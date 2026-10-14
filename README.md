# Class S — Site Web Officiel

> **« L'identité visuelle qui vous impose »** — Marque personnelle et studio de **Scott Nana**, Brand & Graphic Designer basé à Ouagadougou, Burkina Faso.

---

## 🌟 Présentation du Projet

Site vitrine professionnel et console de gestion sur-mesure pour **Class S** :
- **Site Public** : Présentation des réalisations, méthode en 3 étapes, mur de témoignages, accordéon FAQ, blog d'analyses de marque et formulaire de contact multi-étapes conditionnel.
- **Console d'administration** : Espace de gestion sécurisé pour piloter les demandes de devis, les projets/galeries d'images, les témoignages clients et les articles de blog.

---

## 🛠️ Stack Technique

- **Front-end** : React 18, TypeScript, Vite, TailwindCSS
- **Animations** : Framer Motion, GSAP, Canvas Confetti
- **Backend & Base de données** : Supabase (PostgreSQL, Storage, Auth, Row Level Security)
- **Hébergement & Fonctions Serverless** : Vercel (Dynamic SSR Blog, Sitemap, Contact API)
- **Sécurité** : Cloudflare Turnstile, Upstash Redis Rate Limiting, DOMPurify, CSP stricte

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
   Copiez `.env.example` vers `.env` et renseignez vos clés de projet :
   ```env
   VITE_SUPABASE_URL=https://votre-projet.supabase.co
   VITE_SUPABASE_ANON_KEY=votre-cle-anonyme-supabase
   VITE_ADMIN_ALLOWED_EMAIL=admin@votre-domaine.com
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

Les scripts SQL sont situés dans le dossier [`supabase/`](supabase/) :
- Tables `demandes`, `projets`, `projet_images`, `temoignages`, `articles`, `evenements_visite`
- Politiques de sécurité **Row Level Security (RLS)** actives et étanches
- Configuration du bucket Supabase Storage `project-images`
