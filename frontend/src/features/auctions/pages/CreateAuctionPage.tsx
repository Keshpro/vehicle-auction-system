import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAuction } from '../services/auctionService';

export default function CreateAuctionPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (title.trim().length < 3) return setError('Title must be at least 3 characters.');
    if (!startsAt || !endsAt) return setError('Start and end time are required.');
    if (new Date(endsAt) <= new Date(startsAt)) return setError('End time must be after start time.');

    setSaving(true);
    try {
      await createAuction({ title: title.trim(), description, startsAt, endsAt });
      navigate('/admin/auctions');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const field = { display: 'block', width: '100%', padding: 8, marginTop: 4, marginBottom: 16 };

  return (
    <div style={{ padding: 24, maxWidth: 560 }}>
      <h1>Create Auction</h1>
      <form onSubmit={onSubmit}>
        <label>Title
          <input style={field} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={150} />
        </label>
        <label>Description
          <textarea style={field} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label>Starts at
          <input style={field} type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
        </label>
        <label>Ends at
          <input style={field} type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
        </label>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Create Auction'}</button>{' '}
        <button type="button" onClick={() => navigate('/admin/auctions')}>Cancel</button>
      </form>
    </div>
  );
}