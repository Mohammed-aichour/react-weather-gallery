import axios from 'axios';
import { axiosErrorMessage } from './httpError';

const BASE = 'https://restcountries.com/v3.1';

export async function getMoroccoInfo() {
  try {
    const { data } = await axios.get(`${BASE}/alpha/MA`, { timeout: 20000 });
    const country = Array.isArray(data) ? data[0] : data;
    if (!country) throw new Error('Données Maroc introuvables.');
    return country;
  } catch (e) {
    throw new Error(axiosErrorMessage(e));
  }
}
