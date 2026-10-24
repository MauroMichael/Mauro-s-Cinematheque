// src/api/films.js

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function getAllFilms() {
  const response = await fetch(`${API_URL}/films/find/all`);

  if (!response.ok) {
    throw new Error('Failed to fetch films');
  }

  const data = await response.json();

  return data;
}