-- Create admin user in auth.users table
-- Using Supabase's auth schema to create the user with encrypted password
DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Generate user ID
  new_user_id := gen_random_uuid();
  
  -- Insert into auth.users
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role,
    confirmation_token,
    recovery_token
  ) VALUES (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    'trinetra@gmail.com',
    crypt('trinetra', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    'authenticated',
    'authenticated',
    '',
    ''
  );
  
  -- Insert into admin_users table
  INSERT INTO public.admin_users (
    id,
    email,
    username,
    password_hash,
    created_at
  ) VALUES (
    new_user_id,
    'trinetra@gmail.com',
    'trinetra',
    crypt('trinetra', gen_salt('bf')),
    NOW()
  );
END $$;