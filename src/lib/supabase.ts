import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dovpheulzacqhbcsipcg.supabase.co';

const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvdnBoZXVsemFjcWhiY3NpcGNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MzEwMzUsImV4cCI6MjEwNjEwNzAzNX0.CCLQTCgGDcoH2g8E1MvRmk8SfpQcRw9IK1mnlPXXZd8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
