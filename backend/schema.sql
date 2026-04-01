-- PostgreSQL Schema for E-Waste Management (Supabase)

CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  "phoneNumber" TEXT NOT NULL,
  address TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  "walletBalance" NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE devices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('Mobile phones', 'Laptops', 'Tablets', 'Televisions', 'Printers', 'Computer accessories', 'Batteries')),
  brand TEXT NOT NULL,
  "modelName" TEXT NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('Working', 'Not Working', 'Broken Screen/Parts', 'Unknown')),
  "approximateAge" TEXT NOT NULL,
  "disposalMethod" TEXT NOT NULL CHECK ("disposalMethod" IN ('Home Pickup', 'Center Drop-off')),
  status TEXT DEFAULT 'Registered' CHECK (status IN ('Registered', 'Pickup Scheduled', 'Picked Up', 'Completed')),
  "creditValue" NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE pickup_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  "pickupAddress" TEXT NOT NULL,
  "preferredDate" DATE NOT NULL,
  "preferredTime" TEXT NOT NULL,
  "specialInstructions" TEXT,
  status TEXT DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Agent Assigned', 'Completed', 'Cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE collection_centers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  "operatingHours" TEXT NOT NULL,
  "contactNumber" TEXT NOT NULL,
  "acceptedCategories" TEXT[],
  lat NUMERIC,
  lng NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('Credit', 'Withdrawal')),
  amount NUMERIC NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'Completed' CHECK (status IN ('Pending', 'Completed', 'Failed')),
  "withdrawalMethod" TEXT DEFAULT NULL CHECK ("withdrawalMethod" IN ('UPI', 'Bank Transfer', 'Digital Wallet', NULL)),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
