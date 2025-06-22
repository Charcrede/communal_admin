"use client";

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API;
function getCookie(name: string): string | null {
  const cookies = document.cookie ? document.cookie.split('; ') : [];
  for (let i = 0; i < cookies.length; i++) {
    const [key, value] = cookies[i].split('=');
    if (key === decodeURIComponent(name)) {
      return decodeURIComponent(value);
    }
  }
  return null;
}


export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    username: string;
    role: string;
  };
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/auth/login/`, credentials, {
  headers: {
    "X-CSRFToken": getCookie("csrftoken"),
  },
  withCredentials: true,
});
  
  if (response.data.access) {
    
    localStorage.setItem('token', response.data.access);
    // Set cookie for middleware
    document.cookie = `auth-token=${response.data.access}; path=/; max-age=86400`;
  }
  
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  window.location.href = '/login';
};

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};