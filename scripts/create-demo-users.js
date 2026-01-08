#!/usr/bin/env node

/**
 * Script pour créer les comptes démo dans Supabase
 * 
 * Usage: node scripts/create-demo-users.js
 * 
 * Requiert les variables d'environnement:
 *   SUPABASE_SERVICE_ROLE_KEY
 *   NEXT_PUBLIC_SUPABASE_URL
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Erreur: variables d\'environnement manquantes');
  console.error('   NEXT_PUBLIC_SUPABASE_URL=' + (supabaseUrl ? '✓' : '✗'));
  console.error('   SUPABASE_SERVICE_ROLE_KEY=' + (serviceRoleKey ? '✓' : '✗'));
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const demoUsers = [
  {
    email: 'demo.admin@example.com',
    password: 'demo123456',
    role: 'admin',
  },
  {
    email: 'demo.production@example.com',
    password: 'demo123456',
    role: 'production',
  },
  {
    email: 'demo.client@example.com',
    password: 'demo123456',
    role: 'client',
  },
  {
    email: 'demo.fournisseur@example.com',
    password: 'demo123456',
    role: 'fournisseur',
  },
  {
    email: 'demo.oncall@example.com',
    password: 'demo123456',
    role: 'oncall',
  },
];

async function createDemoUsers() {
  console.log('🔐 Création des comptes démo...\n');

  for (const user of demoUsers) {
    try {
      // Créer l'utilisateur
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
      });

      if (error) {
        console.log(`⚠️  ${user.email}: ${error.message}`);
        continue;
      }

      // Créer le profil
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: user.email,
          role: user.role,
          nom: user.role.charAt(0).toUpperCase() + user.role.slice(1),
          prenom: 'Démo',
        });

      if (profileError) {
        console.log(`⚠️  Profil ${user.email}: ${profileError.message}`);
        continue;
      }

      console.log(`✅ ${user.email} (${user.role})`);
    } catch (error) {
      console.log(`❌ ${user.email}: ${error}`);
    }
  }

  console.log('\n✅ Création des comptes terminée!');
  console.log('\n📝 Comptes disponibles:');
  demoUsers.forEach(u => {
    console.log(`   Email: ${u.email}`);
    console.log(`   Password: ${u.password}`);
    console.log(`   Role: ${u.role}\n`);
  });
}

createDemoUsers().catch(console.error);
