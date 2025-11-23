-- Check if users table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'users';

-- If the above returns nothing, the table doesn't exist
-- Run the create table script below

