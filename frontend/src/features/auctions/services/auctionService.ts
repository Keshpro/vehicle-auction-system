import type { Auction } from '../types/auction.types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api';

export async function getAuctions(status?: string): Promise<Auction[]> {
  const url = status
    ? `${API_BASE}/auctions?status=${encodeURIComponent(status)}`
    : `${API_BASE}/auctions`;
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error(`Failed to load auctions (${res.status})`);
  return res.json();
}
export interface CreateAuctionInput {
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
}

export async function createAuction(input: CreateAuctionInput): Promise<Auction> {
  const res = await fetch(`${API_BASE}/auctions`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    let msg = `Failed to create auction (${res.status})`;
    try {
      const data = await res.json();
      if (data?.message) msg = data.message;
      else if (data?.errors) msg = Object.values(data.errors).flat().join(' ');
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  return res.json();
}
export async function publishAuction(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/auctions/${id}/publish`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) {
    let msg = `Failed to publish auction (${res.status})`;
    try {
      const data = await res.json();
      if (data?.message) msg = data.message;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
}
export async function cancelAuction(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/auctions/${id}/cancel`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) {
    let msg = `Failed to cancel auction (${res.status})`;
    try {
      const data = await res.json();
      if (data?.message) msg = data.message;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
}
