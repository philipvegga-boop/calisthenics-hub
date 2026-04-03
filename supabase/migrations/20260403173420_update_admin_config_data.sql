/*
  # Actualizar configuración con datos del admin proporcionados
*/

-- Update admin config directly
UPDATE admin_config 
SET
  bank_name = 'Mercado Pago',
  account_type = 'Cuenta Vista',
  account_number = '1046686070',
  rut = '201859271',
  holder_name = 'Philip Jorge Alexander Vega Mercado',
  email = 'philipvegga@gmail.com',
  updated_at = now()
WHERE admin_id IS NOT NULL;

-- If no rows updated, insert new record
INSERT INTO admin_config (admin_id, bank_name, account_type, account_number, rut, holder_name, email)
SELECT 
  (SELECT id FROM user_profiles WHERE role = 'admin' LIMIT 1),
  'Mercado Pago',
  'Cuenta Vista',
  '1046686070',
  '201859271',
  'Philip Jorge Alexander Vega Mercado',
  'philipvegga@gmail.com'
WHERE NOT EXISTS (SELECT 1 FROM admin_config)
AND EXISTS (SELECT 1 FROM user_profiles WHERE role = 'admin');
