import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

const supabase  = createClient(configService.get('NEXT_PUBLIC_SUPABASE_URL'), configService.get('NEXT_PUBLIC_SUPABASE_ANON_KEY'));

export default supabase;
