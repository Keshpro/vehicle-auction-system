import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Auction } from '../types/auction.types';
import { getAuctions, publishAuction } from '../services/auctionService';

const STATUSES = ['', 'Draft', 'Scheduled', 'Live', 'Closed', 'Cancelled'];

export default function AuctionListPage() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getAuctions(status || undefined)
      .then(setAuctions)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [status, reloadKey]);

  const onPublish = async (id: number) => {
    setBusyId(id);
    setError(null);
    try {
      await publishAuction(id);
      setReloadKey((k) => k + 1);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  const fmt = (d: string) => new Date(d).toLocaleString();
  const cell = { padding: '8px 12px', borderBottom: '1px solid #ddd', textAlign: 'left' as const };
  const btn = {
    padding: '8px 16px',
    border: '1px solid #bbb',
    borderRadius: 6,
    cursor: 'pointer',
    background: '#fff',
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Auctions</h1>
        <Link to="/admin/auctions/new" style={{ ...btn, background: '#dc2626', color: '#fff', textDecoration: 'none' }}>
          + Create Auction
        </Link>
      </div>
      <label>
        Status:{' '}
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s || 'All'}</option>
          ))}
        </select>
      </label>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && auctions.length === 0 && <p>No auctions found.</p>}

      {!loading && auctions.length > 0 && (
        <table style={{ marginTop: 16, borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={cell}>ID</th>
              <th style={cell}>Title</th>
              <th style={cell}>Starts</th>
              <th style={cell}>Ends</th>
              <th style={cell}>Status</th>
              <th style={cell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {auctions.map((a) => (
              <tr key={a.auctionId}>
                <td style={cell}>{a.auctionId}</td>
                <td style={cell}>
                  <Link
                    to={`/auctions/${a.auctionId}`}
                    style={{ color: '#dc2626', fontWeight: 600 }}
                  >
                    {a.title} → View Auction
                  </Link>
                </td>
                <td style={cell}>{fmt(a.startsAt)}</td>
                <td style={cell}>{fmt(a.endsAt)}</td>
                <td style={cell}>{a.status}</td>
                <td style={cell}>
                  {a.status === 'Draft' && (
                    <button style={btn} disabled={busyId === a.auctionId} onClick={() => onPublish(a.auctionId)}>
                      {busyId === a.auctionId ? 'Publishing...' : 'Publish'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}