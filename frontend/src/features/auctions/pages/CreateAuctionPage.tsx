import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAuction } from '../services/auctionService';

type Field = 'title' | 'startsAt' | 'endsAt';
type FieldErrors = Partial<Record<Field, string>>;

const TITLE_MAX = 150;

function validate(title: string, startsAt: string, endsAt: string): FieldErrors {
  const errors: FieldErrors = {};
  const t = title.trim();

  if (t.length === 0) errors.title = 'Title is required.';
  else if (t.length < 3) errors.title = 'Title must be at least 3 characters.';
  else if (t.length > TITLE_MAX) errors.title = `Title must be at most ${TITLE_MAX} characters.`;

  if (!startsAt) errors.startsAt = 'Start time is required.';
  else if (new Date(startsAt) < new Date()) errors.startsAt = 'Start time cannot be in the past.';

  if (!endsAt) errors.endsAt = 'End time is required.';
  else if (startsAt && new Date(endsAt) <= new Date(startsAt))
    errors.endsAt = 'End time must be after start time.';

  return errors;
}

export default function CreateAuctionPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<Field, boolean>>({
    title: false,
    startsAt: false,
    endsAt: false,
  });

  const errors = validate(title, startsAt, endsAt);
  const isValid = Object.keys(errors).length === 0;
  const touch = (f: Field) => setTouched((t) => ({ ...t, [f]: true }));
  const showError = (f: Field) => (touched[f] ? errors[f] : undefined);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setTouched({ title: true, startsAt: true, endsAt: true });
    if (!isValid) return;

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

const field = {
  display: 'block',
  width: '100%',
  padding: 10,
  marginTop: 4,
  marginBottom: 16,
  border: '1px solid #bbb',
  borderRadius: 6,
  background: '#fff',
  boxSizing: 'border-box' as const,
};

  const fieldFor = (f: Field) =>
    showError(f) ? { ...field, marginBottom: 4, borderColor: 'red' } : field;
  const fieldError = (f: Field) =>
    showError(f) && <p style={{ color: 'red', marginTop: 0, marginBottom: 16 }}>{showError(f)}</p>;

  return (
    <div style={{ padding: 24, maxWidth: 560 }}>
      <h1>Create Auction</h1>
      <form onSubmit={onSubmit} noValidate>
        <label>Title
          <input
            style={fieldFor('title')}
            value={title}
            onChange={(e) => { setTitle(e.target.value); touch('title'); }}
            onBlur={() => touch('title')}
            maxLength={TITLE_MAX}
          />
        </label>
        {fieldError('title')}
        <label>Description
          <textarea style={field} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label>Starts at
          <input
            style={fieldFor('startsAt')}
            type="datetime-local"
            value={startsAt}
            onChange={(e) => { setStartsAt(e.target.value); touch('startsAt'); }}
            onBlur={() => touch('startsAt')}
          />
        </label>
        {fieldError('startsAt')}
        <label>Ends at
          <input
            style={fieldFor('endsAt')}
            type="datetime-local"
            value={endsAt}
            onChange={(e) => { setEndsAt(e.target.value); touch('endsAt'); }}
            onBlur={() => touch('endsAt')}
          />
        </label>
        {fieldError('endsAt')}

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" disabled={saving || !isValid}>{saving ? 'Saving...' : 'Create Auction'}</button>{' '}
        <button type="button" onClick={() => navigate('/admin/auctions')}>Cancel</button>
      </form>
    </div>
  );
}
