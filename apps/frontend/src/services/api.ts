import type { Component } from '../types/components';

export async function GetAllComponents() {
  const response = await fetch(
    import.meta.env.VITE_API_URL + '/components/all',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const json = await response.json();

  const data = json.components as Component[];
  return data;
}
