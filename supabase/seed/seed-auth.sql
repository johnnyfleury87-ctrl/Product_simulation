-- ============================================================================
-- SEED AUTH - CRÉATION DES COMPTES DÉMO
-- ============================================================================
-- ATTENTION: À exécuter avec la clé SERVICE_ROLE
-- Les users doivent être créés via l'API auth.users de Supabase
-- 
-- Pour un développement local, utiliser:
--   supabase start
--   puis copier/coller les insertions dans pgAdmin sur auth.users
-- 
-- Alternativement, utiliser le script Node.js dans /scripts/create-demo-users.js
-- ============================================================================

-- NOTE: Les insertions directes dans auth.users nécessitent la SERVICE_ROLE_KEY
-- Ce fichier est un template - adapter selon votre environnement Supabase

-- Créer les comptes démo (les emails et mots de passe sont fictifs en démo)
-- Les vraies insertions nécessitent les hashs bcrypt des passwords

/*
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data
) VALUES
  (
    gen_random_uuid(),
    'demo.admin@example.com',
    crypt('demo123456', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    jsonb_build_object('provider', 'email', 'providers', ARRAY['email']),
    jsonb_build_object('role', 'admin')
  ),
  (
    gen_random_uuid(),
    'demo.production@example.com',
    crypt('demo123456', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    jsonb_build_object('provider', 'email', 'providers', ARRAY['email']),
    jsonb_build_object('role', 'production')
  ),
  (
    gen_random_uuid(),
    'demo.client@example.com',
    crypt('demo123456', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    jsonb_build_object('provider', 'email', 'providers', ARRAY['email']),
    jsonb_build_object('role', 'client')
  ),
  (
    gen_random_uuid(),
    'demo.fournisseur@example.com',
    crypt('demo123456', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    jsonb_build_object('provider', 'email', 'providers', ARRAY['email']),
    jsonb_build_object('role', 'fournisseur')
  ),
  (
    gen_random_uuid(),
    'demo.oncall@example.com',
    crypt('demo123456', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    jsonb_build_object('provider', 'email', 'providers', ARRAY['email']),
    jsonb_build_object('role', 'oncall')
  );
*/

-- ============================================================================
-- APRÈS QUE LES USERS SOIENT CRÉÉS DANS auth.users:
-- ============================================================================

-- Créer les profils correspondants dans la table profiles
-- (une fois que les users existent dans auth.users)

-- Template pour insertion des profils (adapter les IDs des users)
/*
INSERT INTO profiles (id, email, role, nom, prenom) VALUES
  ('USER_ID_ADMIN', 'demo.admin@example.com', 'admin', 'Admin', 'Démo'),
  ('USER_ID_PRODUCTION', 'demo.production@example.com', 'production', 'Production', 'Démo'),
  ('USER_ID_CLIENT', 'demo.client@example.com', 'client', 'Client', 'Démo'),
  ('USER_ID_FOURNISSEUR', 'demo.fournisseur@example.com', 'fournisseur', 'Fournisseur', 'Démo'),
  ('USER_ID_ONCALL', 'demo.oncall@example.com', 'oncall', 'OnCall', 'Démo');
*/

-- ============================================================================
-- COMPTES DÉMO RECOMMANDÉS
-- ============================================================================
-- Email: demo.admin@example.com
-- Password: demo123456
-- Rôle: admin
--
-- Email: demo.production@example.com
-- Password: demo123456
-- Rôle: production
--
-- Email: demo.client@example.com
-- Password: demo123456
-- Rôle: client
--
-- Email: demo.fournisseur@example.com
-- Password: demo123456
-- Rôle: fournisseur
--
-- Email: demo.oncall@example.com
-- Password: demo123456
-- Rôle: oncall
-- ============================================================================
