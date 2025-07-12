import axios from 'axios';
import type { Component } from '../types/components';

export async function GetAllComponents() {
  const response = await axios.get(
    import.meta.env.VITE_API_URL + '/components/all'
  );

  const data = response.data.components as Component[];

  return data;
}
