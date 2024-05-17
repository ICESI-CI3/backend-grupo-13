import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CreateEbookDto } from 'src/ebooks/dto/create-ebook.dto';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('NEST_PUBLIC_SUPABASE_URL');
    const supabaseAnonKey = this.configService.get<string>('NEST_PUBLIC_SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase URL and Anon Key must be provided');
    }

    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  async uploadEbook(createEbookDto: CreateEbookDto){

    const { data, error } = await this.supabase
    .storage
    .from('ebooks-bucket')
    .upload(`pdfs/${createEbookDto.title}.pdf`, Buffer.from(createEbookDto.fileData, 'base64'), {
      contentType: 'application/pdf',
    });

    if (error) {
        throw new Error(`Failed to upload PDF: ${error.message}`);
    }

    return data;
  }

  async downloadEbook(filePath: string){
    const { data, error } = await this.supabase
    .storage
    .from('ebooks-bucket')
    .download(`${filePath}`);

    if(error){
        console.log('Error al obtener el pdf ', error)
        return null;
    }

    return data;
  }

}

