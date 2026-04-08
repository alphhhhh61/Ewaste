import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const ADMIN_EMAIL = 'admin@ecosync.com';
const ADMIN_PASSWORD = 'Admin@1234';

async function createAdmin() {
  try {
    // Check if admin already exists
    const { data: existing } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('email', ADMIN_EMAIL)
      .maybeSingle();

    if (existing) {
      console.log('Admin user already exists:', existing.email, '| Role:', existing.role);
      if (existing.role !== 'admin') {
        // Update role to admin
        const { error } = await supabase
          .from('users')
          .update({ role: 'admin' })
          .eq('email', ADMIN_EMAIL);
        if (error) throw error;
        console.log('✅ Role updated to admin for:', ADMIN_EMAIL);
      } else {
        console.log('✅ Admin user is ready. Email:', ADMIN_EMAIL, '| Password:', ADMIN_PASSWORD);
      }
      return;
    }

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    const { data: user, error } = await supabase
      .from('users')
      .insert([{
        name: 'Admin',
        email: ADMIN_EMAIL,
        password: hashedPassword,
        phoneNumber: '0000000000',
        address: 'Admin HQ',
        role: 'admin',
        walletBalance: 0
      }])
      .select()
      .single();

    if (error) throw error;

    console.log('✅ Admin user created successfully!');
    console.log('   Email   :', ADMIN_EMAIL);
    console.log('   Password:', ADMIN_PASSWORD);
    console.log('   Role    :', user.role);

  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
  }

  process.exit(0);
}

createAdmin();
