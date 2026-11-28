import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Auction, AuctionReport } from '../types/auction.types';
import {
  cancelAuction,
  getAuction,
  getAuctionReport,
  publishAuction,
} from '../services/auctionService';

export default function AuctionDetailsPage() {
  const { id } = useParams();
  const auctionId = Number(id);

  const [auction, setAuction] = useState<Auction | null>(null);
  const [report, setReport] = useState<AuctionReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!Number.isInteger(auctionId) || auctionId <= 0) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    let ignore = false;
    setLoading(true);
    setError(null);
    setNotFound(false);

    (async () => {
      try {
        const a = await getAuction(auctionId);
        if (ignore) return;
        if (!a) {
          setNotFound(true);
          return;
        }
        setAuction(a);
        const r = await getAuctionReport(auctionId);
        if (!ignore) setReport(r);
      } catch (e) {
        if (!ignore) setError((e as Error).message);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [auctionId, reloadKey]);

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setActionError(null);
    try {
      await action();
      setReloadKey((k) => k + 1);
    } catch (e) {
      setActionError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const onPublish = () => run(() => publishAuction(auctionId));
  const onCancel = () => {
    if (!auction) return;
    if (!window.confirm(`Cancel auction "${auction.title}"? This cannot be undone.`)) return;
    run(() => cancelAuction(auctionId));
  };

  const fmt = (d: string) => new Date(d).toLocaleString();
  const money = (n: number) =>
    n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const btn = {
    padding: '8px 16px',
    border: '1px solid #bbb',
    borderRadius: 6,
    cursor: 'pointer',
    background: '#fff',
  };
  const card = {
    border: '1px solid #ddd',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    background: '#fff',
  };
  const row = { display: 'flex', justifyContent: 'space-between', padding: '6px 0' };

  const backLink = (
    <Link to="/admin/auctions" style={{ color: '#dc2626', fontWeight: 600 }}>
      ← Back to auctions
    </Link>
  );

  if (loading && !auction) {
    return <div style={{ padding: 24 }}>{backLink}<p>Loading...</p></div>;
  }

  if (notFound) {
    return (
      <div style={{ padding: 24 }}>
        {backLink}
        <h1>Auction not found</h1>
        <p>No auction exists with ID {id}.</p>
      </div>
    );
  }

  if (error || !auction) {
    return (
      <div style={{ padding: 24 }}>
        {backLink}
        <p style={{ color: 'red' }}>{error ?? 'Failed to load auction.'}</p>
        <button style={btn} onClick={() => setReloadKey((k) => k + 1)}>Retry</button>
      </div>
    );
  }

  const canPublish = auction.status === 'Draft';
  const canCancel = auction.status === 'Draft' || auction.status === 'Scheduled';

  return (
    <div style={{ padding: 24, maxWidth: 720 }}>
      {backLink}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <h1>{auction.title}</h1>
        <div>
          {canPublish && (
            <button style={btn} disabled={busy} onClick={onPublish}>
              {busy ? 'Working...' : 'Publish'}
            </button>
          )}
          {canCancel && (
            <button
              style={{ ...btn, marginLeft: 8, color: '#dc2626', borderColor: '#dc2626' }}
              disabled={busy}
              onClick={onCancel}
            >
              {busy ? 'Working...' : 'Cancel'}
            </button>
          )}
        </div>
      </div>

      {actionError && <p style={{ color: 'red' }}>{actionError}</p>}

      <div style={card}>
        <div style={row}><span>Status</span><strong>{auction.status}</strong></div>
        <div style={row}><span>Starts</span><span>{fmt(auction.startsAt)}</span></div>
        <div style={row}><span>Ends</span><span>{fmt(auction.endsAt)}</span></div>
      </div>

      <div style={card}>
        <h2 style={{ marginTop: 0 }}>Lot summary</h2>
        {report ? (
          <>
            <div style={row}><span>Total lots</span><strong>{report.totalLots}</strong></div>
            <div style={row}><span>Scheduled</span><span>{report.scheduled}</span></div>
            <div style={row}><span>Open</span><span>{report.openLots}</span></div>
            <div style={row}><span>Closed</span><span>{report.closed}</span></div>
            <div style={row}><span>Withdrawn</span><span>{report.withdrawn}</span></div>
            <div style={{ ...row, borderTop: '1px solid #ddd', marginTop: 6, paddingTop: 10 }}>
              <span>Total starting price</span>
              <strong>{money(report.totalStartingPrice)}</strong>
            </div>
          </>
        ) : (
          <p>No lot summary available.</p>
        )}
      </div>
    </div>
  );
}
