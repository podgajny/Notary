/**
 * Testy dla mock utilities IndexedDB
 */

import { describe, it, expect } from 'vitest';
import { 
  mockIndexedDB, 
  resetMockIndexedDB, 
  createMockNote, 
  createMockDraft 
} from './indexeddb-mock';

describe('IndexedDB Mock Utilities', () => {
  it('should store and retrieve values', async () => {
    await mockIndexedDB.set('test-key', 'test-value');
    const value = await mockIndexedDB.get('test-key');
    
    expect(value).toBe('test-value');
  });

  it('should handle objects and arrays', async () => {
    const testObject = { name: 'Test', items: [1, 2, 3] };
    
    await mockIndexedDB.set('object-key', testObject);
    const retrieved = await mockIndexedDB.get('object-key');
    
    expect(retrieved).toEqual(testObject);
  });

  it('should delete keys', async () => {
    await mockIndexedDB.set('to-delete', 'value');
    await mockIndexedDB.del('to-delete');
    
    const value = await mockIndexedDB.get('to-delete');
    expect(value).toBeUndefined();
  });

  it('should list all keys', async () => {
    await mockIndexedDB.set('key1', 'value1');
    await mockIndexedDB.set('key2', 'value2');
    
    const keys = await mockIndexedDB.keys();
    expect(keys).toContain('key1');
    expect(keys).toContain('key2');
  });

  it('should clear all data', async () => {
    await mockIndexedDB.set('key1', 'value1');
    await mockIndexedDB.set('key2', 'value2');
    
    await mockIndexedDB.clear();
    
    const keys = await mockIndexedDB.keys();
    expect(keys).toHaveLength(0);
  });

  it('should reset between tests', async () => {
    await mockIndexedDB.set('persistent-key', 'value');
    resetMockIndexedDB();
    
    const value = await mockIndexedDB.get('persistent-key');
    expect(value).toBeUndefined();
  });
});

describe('Mock Data Helpers', () => {
  it('should create mock note with defaults', () => {
    const note = createMockNote();
    
    expect(note).toHaveProperty('id');
    expect(note).toHaveProperty('title', 'Test Note');
    expect(note).toHaveProperty('body', 'Test note body content');
    expect(note).toHaveProperty('createdAt');
    expect(note).toHaveProperty('updatedAt');
  });

  it('should create mock note with overrides', () => {
    const note = createMockNote({
      title: 'Custom Title',
      body: 'Custom body',
    });
    
    expect(note.title).toBe('Custom Title');
    expect(note.body).toBe('Custom body');
    expect(note).toHaveProperty('id'); // Still has defaults
  });

  it('should create mock draft with defaults', () => {
    const draft = createMockDraft();
    
    expect(draft).toHaveProperty('title', 'Draft title');
    expect(draft).toHaveProperty('body', 'Draft body content');
    expect(draft).toHaveProperty('lastModified');
  });
});
