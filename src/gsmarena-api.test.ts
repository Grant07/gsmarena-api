import { describe, it, expect } from 'vitest';
import { GSMArenaAPI } from './gsmarena-api';

describe('GSMArenaAPI', () => {
  const api = new GSMArenaAPI();

  it('should search for phones', async () => {
    const results = await api.searchPhones('iPhone 15', { limit: 3 });
    expect(results).toBeInstanceOf(Array);
    expect(results.length).toBeLessThanOrEqual(3);
    results.forEach(phone => {
      expect(phone).toHaveProperty('name');
      expect(phone).toHaveProperty('brand');
      expect(phone).toHaveProperty('imageUrl');
      expect(phone).toHaveProperty('slug');
    });
  });

  it('should get phone details', async () => {
    const results = await api.searchPhones('iPhone 15');
    const details = await api.getPhoneDetails(results[0].slug);
    
    expect(details).toHaveProperty('name');
    expect(details).toHaveProperty('brand');
    expect(details).toHaveProperty('imageUrl');
    expect(details).toHaveProperty('specifications');
    expect(details).toHaveProperty('cameras');
  });
});