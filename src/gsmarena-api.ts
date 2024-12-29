import axios from 'axios';
import * as cheerio from 'cheerio';
import { PhoneSearchResult, PhoneDetails, SearchOptions, CameraSpec } from './types/phone';

export class GSMArenaAPI {
  private readonly baseUrl = 'https://www.gsmarena.com';
  private readonly userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

  private async fetch(url: string): Promise<string> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': this.userAgent
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch data: ${error.message}`);
      }
      throw error;
    }
  }

  async searchPhones(query: string, options: SearchOptions = {}): Promise<PhoneSearchResult[]> {
    try {
      const searchUrl = `${this.baseUrl}/results.php3?sQuickSearch=yes&sName=${encodeURIComponent(query)}`;
      const html = await this.fetch(searchUrl);
      const $ = cheerio.load(html);
      
      const phones: PhoneSearchResult[] = [];
      const limit = options.limit || Infinity;
      
      $('.makers ul li').each((_, element) => {
        if (phones.length >= limit) return false;
        
        const phone: PhoneSearchResult = {
          name: $(element).find('span').text().trim(),
          brand: $(element).find('img').attr('title')?.split(' ')[0] || 'Unknown',
          imageUrl: $(element).find('img').attr('src') || '',
          slug: $(element).find('a').attr('href')?.replace('.php', '') || ''
        };
        
        phones.push(phone);
      });

      return phones;
    } catch (error) {
      throw new Error(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getPhoneDetails(slug: string): Promise<PhoneDetails> {
    try {
      const html = await this.fetch(`${this.baseUrl}/${slug}.php`);
      const $ = cheerio.load(html);
      
      const specs: Record<string, Record<string, string>> = {};
      
      $('#specs-list table').each((_, table) => {
        const category = $(table).find('th').text().trim();
        specs[category] = {};
        
        $(table).find('tr').each((_, row) => {
          const key = $(row).find('td.ttl').text().trim();
          const value = $(row).find('td.nfo').text().trim();
          if (key && value) {
            specs[category][key] = value;
          }
        });
      });

      const phone: PhoneDetails = {
        name: $('#specs-list h1').text().trim(),
        brand: $('.specs-phone-name-title').text().trim().split(' ')[0],
        imageUrl: $('.specs-photo-main img').attr('src') || '',
        specifications: specs,
        cameras: {
          main: this.extractCameraSpecs(specs['Main Camera'] || {}),
          selfie: this.extractCameraSpecs(specs['Selfie camera'] || {})
        }
      };

      return phone;
    } catch (error) {
      throw new Error(`Failed to get phone details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private extractCameraSpecs(cameraSpecs: Record<string, string>): CameraSpec[] {
    const cameras: CameraSpec[] = [];
    const resolutionKey = Object.keys(cameraSpecs).find(key => key.includes('Resolution'));
    
    if (resolutionKey) {
      const resolutions = cameraSpecs[resolutionKey].split(' and ');
      resolutions.forEach(resolution => {
        cameras.push({
          resolution,
          features: Object.entries(cameraSpecs)
            .filter(([key]) => key.includes('Features'))
            .flatMap(([_, value]) => value.split(', '))
        });
      });
    }
    
    return cameras;
  }
}