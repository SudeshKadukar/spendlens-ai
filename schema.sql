-- Supabase Schema for SpendLens AI

CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  public_id TEXT UNIQUE NOT NULL,
  team_size INTEGER NOT NULL,
  use_case TEXT NOT NULL,
  tools JSONB NOT NULL,
  recommendations JSONB NOT NULL,
  total_monthly_spend NUMERIC NOT NULL,
  total_monthly_savings NUMERIC NOT NULL,
  total_annual_savings NUMERIC NOT NULL,
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  audit_public_id TEXT REFERENCES audits(public_id),
  email TEXT NOT NULL,
  company_name TEXT,
  role TEXT,
  team_size INTEGER,
  monthly_savings NUMERIC,
  is_high_savings BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS)
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow public read access to audits by public_id
CREATE POLICY "Public can view audits by public_id" 
  ON audits FOR SELECT 
  USING (true);

-- Allow anon to insert audits
CREATE POLICY "Anon can insert audits" 
  ON audits FOR INSERT 
  WITH CHECK (true);

-- Allow anon to insert leads
CREATE POLICY "Anon can insert leads" 
  ON leads FOR INSERT 
  WITH CHECK (true);
