// const API_BASE_URL = 'http://localhost:5001';
// const API_BASE_URL = 'https://wowburger-1.onrender.com';
// const API_BASE_URL='http://35.159.83.79:3000'
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


export function getToken(): string | null {
  return localStorage.getItem('wow_burger_token');
}

export function setToken(token: string): void {
  localStorage.setItem('wow_burger_token', token);
}

export function setUserId(userId: string): void {
  localStorage.setItem('wow_burger_user_id', userId);
}

export function getUserId(): string | null {
  return localStorage.getItem('wow_burger_user_id');
}

export function removeToken(): void {
  localStorage.removeItem('wow_burger_token');
  localStorage.removeItem('wow_burger_user_id');
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
export async function login(email: string, password: string): Promise<{ access_token: string; userId: string }> {
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
  setUserId(data.userId);
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
export async function getMenuItems(page: number = 1, limit: number = 5, search: string = '') {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search.trim()) {
    params.append('search', search.trim());
  }

  const response = await fetch(`${API_BASE_URL}/menu-items?${params.toString()}`, {
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

// User API
export async function updateUser(userId: string, userData: any) {
  const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to update profile');
  }
  return response.json();
}

// Image Upload
export const uploadImages = async (files: File[]): Promise<{ urls: string[] }> => {
  const formData = new FormData();
  
  files.forEach((file) => {
    formData.append('images', file);
  });

  const response = await fetch(`${API_BASE_URL}/uploads/images`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    },
    body: formData
  });

  if (!response.ok) {
    const errorDetails = await response.json().catch(() => ({}));
    throw new Error(errorDetails.message || 'Images transfer transaction stalled.');
  }

  return await response.json();
};

// View Counter API
export async function incrementView(id: string): Promise<{ success: boolean; views: number }> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${id}/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.warn("View tracking endpoint rejected request:", err.message);
      return { success: false, views: 0 };
    }

    const data = await response.json();
    
    // Normalize response objects (handles raw number returns or structured data returns)
    if (typeof data === 'number') {
      return { success: true, views: data };
    }
    return {
      success: true,
      views: data.views ?? data.count ?? 0
    };
  } catch (error) {
    console.error("Failed to run background view aggregation pipeline:", error);
    // Return a safe mock object so the frontend state doesn't freeze under error conditions
    return { success: false, views: 0 };
  }
}