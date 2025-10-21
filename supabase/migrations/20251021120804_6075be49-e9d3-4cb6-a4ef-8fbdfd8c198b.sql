-- =====================================================
-- DDL (Data Definition Language): Creating Tables
-- Following 3NF Normalization Principles
-- =====================================================

-- 1. OWNERS TABLE (Normalized - no redundant data)
CREATE TABLE public.owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  state TEXT NOT NULL,
  pin TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. CARS TABLE (Normalized - separated from ownership)
CREATE TABLE public.cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_number TEXT UNIQUE NOT NULL,
  year_of_registration INTEGER NOT NULL,
  model TEXT NOT NULL,
  color TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. DEALERSHIPS TABLE
CREATE TABLE public.dealerships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealership_name TEXT NOT NULL,
  location TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. CRIME HISTORY TABLE (Foreign key to cars)
CREATE TABLE public.crime_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID REFERENCES public.cars(id) ON DELETE CASCADE NOT NULL,
  type_of_crime TEXT NOT NULL,
  damage TEXT,
  cid TEXT NOT NULL,
  date_recorded TIMESTAMP WITH TIME ZONE DEFAULT now(),
  severity TEXT CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')) DEFAULT 'Low'
);

-- 5. CAR OWNERSHIP TABLE (Junction table - many-to-many relationship)
CREATE TABLE public.car_ownership (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID REFERENCES public.cars(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES public.owners(id) ON DELETE CASCADE NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  current_owner BOOLEAN DEFAULT true,
  UNIQUE(car_id, owner_id, start_date)
);

-- 6. CAR DEALER TABLE (Junction table for cars and dealerships)
CREATE TABLE public.car_dealer (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID REFERENCES public.cars(id) ON DELETE CASCADE NOT NULL,
  dealership_id UUID REFERENCES public.dealerships(id) ON DELETE CASCADE NOT NULL,
  deposit_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT CHECK (status IN ('Available', 'Sold', 'Reserved', 'Under Inspection')) DEFAULT 'Available',
  UNIQUE(car_id, dealership_id)
);

-- =====================================================
-- INDEXES for Performance
-- =====================================================
CREATE INDEX idx_cars_registration ON public.cars(registration_number);
CREATE INDEX idx_crime_car_id ON public.crime_history(car_id);
CREATE INDEX idx_ownership_car_id ON public.car_ownership(car_id);
CREATE INDEX idx_ownership_owner_id ON public.car_ownership(owner_id);
CREATE INDEX idx_car_dealer_car_id ON public.car_dealer(car_id);

-- =====================================================
-- TRIGGERS: Auto-update timestamps
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cars_updated_at
  BEFORE UPDATE ON public.cars
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- TRIGGER: Ensure only one current owner per car
-- =====================================================
CREATE OR REPLACE FUNCTION public.ensure_single_current_owner()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.current_owner = true THEN
    UPDATE public.car_ownership
    SET current_owner = false, end_date = now()
    WHERE car_id = NEW.car_id AND id != NEW.id AND current_owner = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_single_current_owner
  BEFORE INSERT OR UPDATE ON public.car_ownership
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_single_current_owner();

-- =====================================================
-- VIEWS: Complex Aggregations
-- =====================================================

-- View 1: Cars with Crime History Count (with GROUP BY)
CREATE OR REPLACE VIEW public.cars_with_crime_stats AS
SELECT 
  c.id,
  c.registration_number,
  c.model,
  c.color,
  c.amount,
  COUNT(ch.id) as crime_count,
  MAX(ch.severity) as highest_severity,
  MAX(ch.date_recorded) as last_crime_date
FROM public.cars c
LEFT JOIN public.crime_history ch ON c.id = ch.car_id
GROUP BY c.id, c.registration_number, c.model, c.color, c.amount;

-- View 2: Current Car Ownership Details
CREATE OR REPLACE VIEW public.current_car_ownership_view AS
SELECT 
  c.id as car_id,
  c.registration_number,
  c.model,
  c.year_of_registration,
  o.id as owner_id,
  o.first_name || ' ' || o.last_name as owner_name,
  o.city,
  o.state,
  co.start_date
FROM public.cars c
JOIN public.car_ownership co ON c.id = co.car_id
JOIN public.owners o ON co.owner_id = o.id
WHERE co.current_owner = true;

-- View 3: Dealership Inventory with Crime History (Nested Query in View)
CREATE OR REPLACE VIEW public.dealership_inventory_view AS
SELECT 
  d.dealership_name,
  d.location,
  c.registration_number,
  c.model,
  c.amount,
  cd.status,
  cd.deposit_date,
  (SELECT COUNT(*) FROM public.crime_history WHERE car_id = c.id) as crime_count
FROM public.dealerships d
JOIN public.car_dealer cd ON d.id = cd.dealership_id
JOIN public.cars c ON cd.car_id = c.id;

-- View 4: High-Risk Cars (Using HAVING clause with GROUP BY)
CREATE OR REPLACE VIEW public.high_risk_cars_view AS
SELECT 
  c.registration_number,
  c.model,
  COUNT(ch.id) as total_crimes,
  STRING_AGG(ch.type_of_crime, ', ') as crime_types
FROM public.cars c
JOIN public.crime_history ch ON c.id = ch.car_id
GROUP BY c.id, c.registration_number, c.model
HAVING COUNT(ch.id) > 1
ORDER BY COUNT(ch.id) DESC;

-- =====================================================
-- STORED FUNCTIONS: Complex Queries with Nested SELECT
-- =====================================================

-- Function 1: Get cars by severity with nested query
CREATE OR REPLACE FUNCTION public.get_cars_by_severity(severity_level TEXT)
RETURNS TABLE (
  car_id UUID,
  registration_number TEXT,
  model TEXT,
  crime_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.registration_number,
    c.model,
    COUNT(ch.id) as crime_count
  FROM public.cars c
  LEFT JOIN public.crime_history ch ON c.id = ch.car_id
  WHERE c.id IN (
    SELECT DISTINCT car_id 
    FROM public.crime_history 
    WHERE severity = severity_level
  )
  GROUP BY c.id, c.registration_number, c.model
  ORDER BY crime_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Function 2: Get dealership statistics with GROUP BY and HAVING
CREATE OR REPLACE FUNCTION public.get_dealership_stats()
RETURNS TABLE (
  dealership_name TEXT,
  total_cars BIGINT,
  available_cars BIGINT,
  avg_price NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.dealership_name,
    COUNT(cd.car_id) as total_cars,
    COUNT(CASE WHEN cd.status = 'Available' THEN 1 END) as available_cars,
    AVG(c.amount) as avg_price
  FROM public.dealerships d
  LEFT JOIN public.car_dealer cd ON d.id = cd.dealership_id
  LEFT JOIN public.cars c ON cd.car_id = c.id
  GROUP BY d.id, d.dealership_name
  HAVING COUNT(cd.car_id) > 0
  ORDER BY total_cars DESC;
END;
$$ LANGUAGE plpgsql;

-- Function 3: Get owner's cars with crime history (demonstrates ORDER BY)
CREATE OR REPLACE FUNCTION public.get_owner_cars(owner_first_name TEXT)
RETURNS TABLE (
  registration_number TEXT,
  model TEXT,
  crime_count BIGINT,
  highest_severity TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.registration_number,
    c.model,
    COUNT(ch.id) as crime_count,
    MAX(ch.severity) as highest_severity
  FROM public.owners o
  JOIN public.car_ownership co ON o.id = co.owner_id
  JOIN public.cars c ON co.car_id = c.id
  LEFT JOIN public.crime_history ch ON c.id = ch.car_id
  WHERE o.first_name = owner_first_name AND co.current_owner = true
  GROUP BY c.id, c.registration_number, c.model
  ORDER BY crime_count DESC, c.model ASC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- RLS (Row Level Security) Policies
-- =====================================================
ALTER TABLE public.owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dealerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crime_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.car_ownership ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.car_dealer ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Allow public read on owners" ON public.owners FOR SELECT USING (true);
CREATE POLICY "Allow public read on cars" ON public.cars FOR SELECT USING (true);
CREATE POLICY "Allow public read on dealerships" ON public.dealerships FOR SELECT USING (true);
CREATE POLICY "Allow public read on crime_history" ON public.crime_history FOR SELECT USING (true);
CREATE POLICY "Allow public read on car_ownership" ON public.car_ownership FOR SELECT USING (true);
CREATE POLICY "Allow public read on car_dealer" ON public.car_dealer FOR SELECT USING (true);

-- =====================================================
-- DML (Data Manipulation Language): Sample Data
-- =====================================================

-- Insert Owners
INSERT INTO public.owners (first_name, last_name, state, pin, address, city) VALUES
('Rajesh', 'Kumar', 'Maharashtra', '400001', '123 Marine Drive', 'Mumbai'),
('Priya', 'Sharma', 'Delhi', '110001', '456 Connaught Place', 'New Delhi'),
('Amit', 'Patel', 'Gujarat', '380001', '789 CG Road', 'Ahmedabad'),
('Sneha', 'Reddy', 'Telangana', '500001', '321 Banjara Hills', 'Hyderabad');

-- Insert Dealerships
INSERT INTO public.dealerships (dealership_name, location, phone) VALUES
('Premium Auto Mumbai', 'Andheri West, Mumbai', '+91-22-12345678'),
('Capital Motors Delhi', 'Vasant Vihar, Delhi', '+91-11-87654321'),
('Gujarat Auto Hub', 'Satellite, Ahmedabad', '+91-79-11223344');

-- Insert Cars
INSERT INTO public.cars (registration_number, year_of_registration, model, color, amount) VALUES
('MH-01-AB-1234', 2020, 'Honda City', 'Silver', 850000.00),
('DL-02-CD-5678', 2019, 'Maruti Swift', 'Red', 650000.00),
('GJ-03-EF-9012', 2021, 'Hyundai Creta', 'White', 1250000.00),
('TG-04-GH-3456', 2018, 'Toyota Innova', 'Black', 1450000.00);

-- Insert Crime History
INSERT INTO public.crime_history (car_id, type_of_crime, damage, cid, severity) VALUES
((SELECT id FROM public.cars WHERE registration_number = 'MH-01-AB-1234'), 'Theft Attempt', 'Minor scratches on door', 'CR-2023-001', 'Low'),
((SELECT id FROM public.cars WHERE registration_number = 'DL-02-CD-5678'), 'Accident', 'Front bumper damage', 'CR-2023-002', 'Medium'),
((SELECT id FROM public.cars WHERE registration_number = 'DL-02-CD-5678'), 'Hit and Run', 'Side mirror broken', 'CR-2023-003', 'High');

-- Insert Car Ownership (current owners)
INSERT INTO public.car_ownership (car_id, owner_id, current_owner) VALUES
((SELECT id FROM public.cars WHERE registration_number = 'MH-01-AB-1234'), 
 (SELECT id FROM public.owners WHERE first_name = 'Rajesh'), true),
((SELECT id FROM public.cars WHERE registration_number = 'DL-02-CD-5678'), 
 (SELECT id FROM public.owners WHERE first_name = 'Priya'), true),
((SELECT id FROM public.cars WHERE registration_number = 'GJ-03-EF-9012'), 
 (SELECT id FROM public.owners WHERE first_name = 'Amit'), true);

-- Insert Car Dealer entries
INSERT INTO public.car_dealer (car_id, dealership_id, status) VALUES
((SELECT id FROM public.cars WHERE registration_number = 'TG-04-GH-3456'), 
 (SELECT id FROM public.dealerships WHERE dealership_name = 'Premium Auto Mumbai'), 'Available');