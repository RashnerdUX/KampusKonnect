import { promises as fs } from 'fs';
import { join } from 'path';
import type { Vendor, User, Category } from '~/types';

const DATA_DIR = join(process.cwd(), 'app', 'data');

/**
 * Read JSON file and parse content
 */
async function readJsonFile<T>(filename: string): Promise<T> {
  try {
    const filePath = join(DATA_DIR, filename);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    throw new Error(`Failed to read ${filename}`);
  }
}

/**
 * Write data to JSON file
 */
async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  try {
    const filePath = join(DATA_DIR, filename);
    const content = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, content, 'utf-8');
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw new Error(`Failed to write ${filename}`);
  }
}

// Vendor operations
export async function getVendors(): Promise<Vendor[]> {
  return readJsonFile<Vendor[]>('vendors.json');
}

export async function getVendorById(id: string): Promise<Vendor | null> {
  const vendors = await getVendors();
  return vendors.find(vendor => vendor.id === id) || null;
}

export async function createVendor(vendor: Vendor): Promise<Vendor> {
  const vendors = await getVendors();
  vendors.unshift(vendor); // Add to beginning
  await writeJsonFile('vendors.json', vendors);
  return vendor;
}

export async function updateVendor(id: string, updates: Partial<Vendor>): Promise<Vendor | null> {
  const vendors = await getVendors();
  const index = vendors.findIndex(vendor => vendor.id === id);
  
  if (index === -1) return null;
  
  vendors[index] = { ...vendors[index], ...updates, updatedAt: new Date().toISOString() };
  await writeJsonFile('vendors.json', vendors);
  return vendors[index];
}

// User operations
export async function getUsers(): Promise<User[]> {
  return readJsonFile<User[]>('users.json');
}

export async function createUser(user: User): Promise<User> {
  const users = await getUsers();
  const newUser = {
    ...user,
    id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  await writeJsonFile('users.json', users);
  return newUser;
}

// Static data
export async function getUniversities(): Promise<string[]> {
  return readJsonFile<string[]>('universities.json');
}

export async function getCategories(): Promise<Category[]> {
  return readJsonFile<Category[]>('categories.json');
}