"use client";

import axios from 'axios';
import { log } from 'console';

const API_URL = process.env.NEXT_PUBLIC_API;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
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
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

// export const login = async (credentials: { email: string; password: string }) => {
//   // Étape 1 : récupérer le cookie CSRF de Sanctum
//   await axios.get(`${BASE_URL}/sanctum/csrf-cookie`, {
//     withCredentials: true,
//   });
//   // Étape 2 : login
//   const response = await axios.post(`${API_URL}/auth/login`, credentials, {
//     withCredentials: true, // indispensable pour envoyer/recevoir cookies
//   });
//   console.log(response.data);
//   localStorage.setItem('token', response.data.token);
//   return response.data; // Sanctum renvoie l'utilisateur + éventuellement un token
// };

export const login = async (credentials: { email: string; password: string }) => {
  // Étape 2 : login
  const response = await axios.post(`${API_URL}/auth/admin/login`, credentials);
  console.log(response.data.data);
  localStorage.setItem('token', response.data.data.access_token);
  localStorage.setItem('admin', JSON.stringify(response.data.data.admin));
  return response.data; // Sanctum renvoie l'utilisateur + éventuellement un token
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

export const getRole = (): string | null => {
  if (typeof window !== 'undefined') {
    const admin = JSON.parse(localStorage.getItem('admin') || '{}');
    return admin?.role || null;
  }
return null;
};
export const isAuthenticated = (): boolean => {
  return !!getToken();
};