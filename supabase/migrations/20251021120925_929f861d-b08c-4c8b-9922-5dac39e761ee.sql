-- =====================================================
-- Fix Security Warnings: Add search_path to functions
-- =====================================================

-- Fix Function 1: update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SET search_path = public;

-- Fix Function 2: ensure_single_current_owner
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
$$ LANGUAGE plpgsql
SET search_path = public;

-- Fix Function 3: get_cars_by_severity
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
$$ LANGUAGE plpgsql
SET search_path = public;

-- Fix Function 4: get_dealership_stats
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
$$ LANGUAGE plpgsql
SET search_path = public;

-- Fix Function 5: get_owner_cars
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
$$ LANGUAGE plpgsql
SET search_path = public;

-- =====================================================
-- Fix Security Definer Views: Recreate as SECURITY INVOKER
-- =====================================================

-- Recreate View 1 with SECURITY INVOKER
DROP VIEW IF EXISTS public.cars_with_crime_stats;
CREATE VIEW public.cars_with_crime_stats 
WITH (security_invoker=true) AS
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

-- Recreate View 2 with SECURITY INVOKER
DROP VIEW IF EXISTS public.current_car_ownership_view;
CREATE VIEW public.current_car_ownership_view
WITH (security_invoker=true) AS
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

-- Recreate View 3 with SECURITY INVOKER
DROP VIEW IF EXISTS public.dealership_inventory_view;
CREATE VIEW public.dealership_inventory_view
WITH (security_invoker=true) AS
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

-- Recreate View 4 with SECURITY INVOKER
DROP VIEW IF EXISTS public.high_risk_cars_view;
CREATE VIEW public.high_risk_cars_view
WITH (security_invoker=true) AS
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