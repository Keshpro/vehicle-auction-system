import type { Auction } from '../types/auction.types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api';

export async function getAuctions(status?: string): Promise<Auction[]> {
  const url = status
    ? `${API_BASE}/auctions?status=${encodeURIComponent(status)}`
    : `${API_BASE}/auctions`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load auctions (${res.status})`);
  return res.json();
}