// const API_BASE_URL = 'http://localhost:5001';
const API_BASE_URL='https://wowburger.onrender.com';

export function getToken(): string | null {
  return localStorage.getItem('wow_burger_token');
}

export function setToken(token: string): void {
  localStorage.setItem('wow_burger_token', token);
}

export function removeToken(): void {
  localStorage.removeItem('wow_burger_token');
}

export function getHeaders(contentType: string = 'application/json') {
  const headers: Record<string, string> = {};
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// Auth API
export async function login(email: string, password: string): Promise<{ access_token: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Login failed. Please verify credentials.');
  }

  const data = await response.json();
  setToken(data.access_token);
  return data;
}

// Categories API
export async function getCategories() {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    headers: getHeaders(''),
  });
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
}

export async function createCategory(catData: any) {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(catData),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create category');
  }
  return response.json();
}

export async function updateCategory(id: string, catData: any) {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(catData),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to update category');
  }
  return response.json();
}

export async function deleteCategory(id: string) {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'DELETE',
    headers: getHeaders(''),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to delete category');
  }
}

// Menu Items API
export async function getMenuItems() {
  const response = await fetch(`${API_BASE_URL}/menu-items`, {
    headers: getHeaders(''),
  });
  if (!response.ok) throw new Error('Failed to fetch menu items');
  return response.json();
}

export async function createMenuItem(itemData: any) {
  const response = await fetch(`${API_BASE_URL}/menu-items`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(itemData),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create menu item');
  }
  return response.json();
}

export async function updateMenuItem(id: string, itemData: any) {
  const response = await fetch(`${API_BASE_URL}/menu-items/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(itemData),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to update menu item');
  }
  return response.json();
}

export async function deleteMenuItem(id: string) {
  const response = await fetch(`${API_BASE_URL}/menu-items/${id}`, {
    method: 'DELETE',
    headers: getHeaders(''),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to delete menu item');
  }
}
