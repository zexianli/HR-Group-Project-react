/* eslint-disable */
import { useMemo, useState, useEffect } from 'react';
import Navbar from '../../components/navbar/OnboardNavBar';
import { mapBackendVisaToDocs } from '../../api/visaDataConverter';
import { visaStatus } from '../../api/visaStatus';
import { uploadVisa } from '../../api/uploadVisa';
import { initialDocs } from '../../assets/data/initialDocs';

/**
 * VisaStatusManagementPage (OPT-only)
 * - Shows NOTHING if user didn't select OPT
 * - Enforces upload order: Receipt -> EAD -> I-983 -> I-20
 * - Each doc has status: "not_uploaded" | "pending" | "approved" | "rejected"
 * - Upload is enabled only when:
 *    - it's the next required doc AND
 *    - previous doc is approved
 *
 * Drop this into your project and wire `initialVisaType` from your onboarding profile.
 * If you already have a Navbar, replace the placeholder <TopBar /> with yours.
 */

// ---------- small UI helpers ----------
function Badge({ status }) {
  const map = {
    not_uploaded: { label: 'Not uploaded', bg: '#f3f4f6', fg: '#374151', bd: '#e5e7eb' },
    pending: { label: 'Pending', bg: '#fff7ed', fg: '#9a3412', bd: '#fed7aa' },
    approved: { label: 'Approved', bg: '#ecfdf5', fg: '#065f46', bd: '#a7f3d0' },
    rejected: { label: 'Rejected', bg: '#fef2f2', fg: '#991b1b', bd: '#fecaca' },
  };
  const s = map[status] ?? map.not_uploaded;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '4px 10px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        background: s.bg,
        color: s.fg,
        border: `1px solid ${s.bd}`,
        whiteSpace: 'nowrap',
      }}
    >
      {s.label}
    </span>
  );
}

function Card({ title, right, children }) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 14,
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '14px 16px',
          borderBottom: '1px solid #eef2f7',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{title}</div>
        {right}
      </div>
      <div style={{ padding: 16 }}>{children}</div>
    </div>
  );
}

function Message({ tone = 'info', children }) {
  const map = {
    info: { bg: '#f9fafb', bd: '#e5e7eb', fg: '#111827' },
    warn: { bg: '#fff7ed', bd: '#fed7aa', fg: '#9a3412' },
    ok: { bg: '#ecfdf5', bd: '#a7f3d0', fg: '#065f46' },
    bad: { bg: '#fef2f2', bd: '#fecaca', fg: '#991b1b' },
  };
  const s = map[tone] ?? map.info;
  return (
    <div
      style={{
        background: s.bg,
        border: `1px solid ${s.bd}`,
        color: s.fg,
        borderRadius: 12,
        padding: '10px 12px',
        fontSize: 13,
        lineHeight: 1.4,
      }}
    >
      {children}
    </div>
  );
}

function Button({ as = 'button', variant = 'primary', disabled = false, onClick, children }) {
  const Component = as;

  const base = {
    padding: '10px 12px',
    borderRadius: 12,
    fontSize: 13,
    fontWeight: 700,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.55 : 1,
    border: '1px solid transparent',
    userSelect: 'none',
  };

  const variantStyles =
    variant === 'secondary'
      ? { background: '#fff', borderColor: '#e5e7eb', color: '#111827' }
      : variant === 'danger'
        ? { background: '#ef4444', borderColor: '#ef4444', color: '#fff' }
        : { background: '#111827', borderColor: '#111827', color: '#fff' };

  return (
    <Component
      onClick={onClick}
      disabled={Component === 'button' ? disabled : undefined}
      style={{ ...base, ...variantStyles }}
    >
      {children}
    </Component>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '8px 0' }}>
      <div style={{ fontSize: 13, color: '#6b7280' }}>{label}</div>
      <div style={{ fontSize: 13, color: '#111827', fontWeight: 600, textAlign: 'right' }}>
        {value}
      </div>
    </div>
  );
}

// ---------- main component ----------
export default function VisaStatusManagement({ initialVisaType = 'OPT' }) {
  const [visaType, setVisaType] = useState(initialVisaType);
  const [docs, setDocs] = useState(initialDocs);
  const [loading, setLoading] = useState(true);

  // ordered steps
  const steps = useMemo(
    () => [
      { key: 'optReceipt', title: '1) OPT Receipt (submitted in onboarding application)' },
      { key: 'optEad', title: '2) OPT EAD' },
      { key: 'i983', title: '3) I-983' },
      { key: 'i20', title: '4) I-20' },
    ],
    []
  );

  const prevKey = (k) => {
    const idx = steps.findIndex((s) => s.key === k);
    return idx <= 0 ? null : steps[idx - 1].key;
  };

  const canUpload = (key) => {
    const current = docs[key];

    // Allow upload if rejected
    if (current.status === 'rejected') return true;

    // OPT Receipt: user uploads first
    if (key === 'optReceipt') {
      return current.status === 'not_uploaded';
    }

    const prev = prevKey(key);
    if (!prev) return false;

    return docs[prev].status === 'approved' && current.status !== 'approved';
  };

  const nextInstruction = (key) => {
    const d = docs[key];

    if (key === 'optReceipt') {
      if (d.status === 'pending')
        return { tone: 'warn', text: 'Waiting for HR to approve your OPT Receipt.' };
      if (d.status === 'approved')
        return { tone: 'info', text: 'Approved. Please move to the next step.' };
      if (d.status === 'rejected')
        return { tone: 'bad', text: 'Your OPT Receipt was rejected. See HR feedback below.' };

      return {
        tone: 'info',
        text: 'Upload your OPT Receipt.',
      };
    }

    if (key === 'optEad') {
      if (d.status === 'pending')
        return { tone: 'warn', text: 'Waiting for HR to approve your OPT EAD' };
      if (d.status === 'approved')
        return { tone: 'info', text: 'Please download and fill out the I-983 form' };
      if (d.status === 'rejected')
        return { tone: 'bad', text: 'Your OPT EAD was rejected. See HR feedback below.' };
      return { tone: 'info', text: 'Upload your OPT EAD when available.' };
    }

    if (key === 'i983') {
      if (d.status === 'pending')
        return { tone: 'warn', text: 'Waiting for HR to approve and sign your I-983' };
      if (d.status === 'approved')
        return {
          tone: 'info',
          text: 'Please send the I-983 along with all necessary documents to your school and upload the new I-20',
        };
      if (d.status === 'rejected')
        return { tone: 'bad', text: 'Your I-983 was rejected. See HR feedback below.' };
      return {
        tone: 'info',
        text: 'Download a template, fill it out, then upload the completed I-983.',
      };
    }

    if (key === 'i20') {
      if (d.status === 'pending')
        return { tone: 'warn', text: 'Waiting for HR to approve your I-20' };
      if (d.status === 'approved') return { tone: 'ok', text: 'All documents have been approved' };
      if (d.status === 'rejected')
        return { tone: 'bad', text: 'Your I-20 was rejected. See HR feedback below.' };
      return { tone: 'info', text: 'Upload your updated I-20 after your school issues it.' };
    }

    return { tone: 'info', text: '' };
  };

  const handleUpload = (key, file) => {
    // In real app: upload to backend, then set status to pending.
    setDocs((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        filename: file?.name || prev[key].filename || 'uploaded.pdf',
        uploadedAt: new Date().toISOString().slice(0, 10),
        status: 'pending',
        feedback: '',
      },
    }));
  };

  // (Demo only) Buttons to simulate HR actions
  const simulateHr = (key, action) => {
    setDocs((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        status: action,
        feedback:
          action === 'rejected'
            ? 'Please re-upload a clear, unexpired document. The previous file was unreadable/cropped.'
            : '',
      },
    }));
  };

  useEffect(() => {
    let alive = true;

    async function fetchVisaStatus() {
      try {
        const res = await visaStatus();
        console.log('res', res);

        if (!alive) return;

        setVisaType(res.isOptCase ? 'OPT' : 'OTHER');
        setDocs(mapBackendVisaToDocs(res));
      } catch (err) {
        console.error('Failed to load visa status', err);
      } finally {
        if (alive) setLoading(false);
      }
    }

    fetchVisaStatus();

    return () => {
      alive = false;
    };
  }, []);

  if (visaType !== 'OPT') {
    // Spec: if not OPT, page should not show any of these documents
    return (
      <>
        <Navbar />
        <div style={{ padding: 24, maxWidth: 980, margin: '0 auto' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>
            Visa Status Management
          </div>
          <div style={{ marginTop: 12 }}>
            <Message tone="info">This page is only available for users on OPT.</Message>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: 24, maxWidth: 980, margin: '0 auto', display: 'grid', gap: 16 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#6b7280' }}>Visa Type:</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#111827' }}>{visaType}</span>
          </div>
        </div>

        {steps.map(({ key, title }) => {
          const d = docs[key];
          const msg = nextInstruction(key);

          const uploadDisabledReason = canUpload(key)
            ? ''
            : prevKey(key)
              ? docs[prevKey(key)].status !== 'approved'
                ? 'Previous document must be approved by HR'
                : 'Not available'
              : 'Not available';

          return (
            <Card key={key} title={title} right={<Badge status={d.status} />}>
              <div style={{ display: 'grid', gap: 10 }}>
                <Message tone={msg.tone}>{msg.text}</Message>

                <div style={{ borderTop: '1px dashed #e5e7eb', margin: '4px 0' }} />

                <div style={{ display: 'grid', gap: 2 }}>
                  <Row label="File" value={d.filename ? d.filename : '—'} />
                  <Row label="Uploaded" value={d.uploadedAt ? d.uploadedAt : '—'} />
                </div>

                {key === 'i983' && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 6 }}>
                    <a
                      href={docs.i983.downloads.emptyTemplateUrl}
                      download
                      style={{ textDecoration: 'none' }}
                    >
                      <Button variant="secondary">Download Empty Template</Button>
                    </a>
                    <a
                      href={docs.i983.downloads.sampleTemplateUrl}
                      download
                      style={{ textDecoration: 'none' }}
                    >
                      <Button variant="secondary">Download Sample Template</Button>
                    </a>
                  </div>
                )}

                {d.status === 'rejected' && (
                  <div style={{ marginTop: 6 }}>
                    <Message tone="bad">
                      <div style={{ fontWeight: 800, marginBottom: 6 }}>HR Feedback</div>
                      <div style={{ whiteSpace: 'pre-wrap' }}>{d.feedback || '—'}</div>
                    </Message>
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 10,
                    marginTop: 6,
                    alignItems: 'center',
                  }}
                >
                  {/* Upload */}
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                    <label
                      style={{
                        cursor: canUpload(key) ? 'pointer' : 'not-allowed',
                        display: 'inline-flex',
                      }}
                    >
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          handleUpload(key, e.target.files?.[0]);
                        }}
                      />

                      <Button as="div" variant="primary" disabled={!canUpload(key)}>
                        Upload {d.name}
                      </Button>
                    </label>
                  </div>

                  {!canUpload(key) && key !== 'optReceipt' && (
                    <span style={{ fontSize: 12, color: '#6b7280' }}>{uploadDisabledReason}</span>
                  )}

                  {/* (Demo only) Simulate HR decisions */}
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
                    <Button
                      variant="secondary"
                      disabled={d.status !== 'pending'}
                      onClick={() => simulateHr(key, 'approved')}
                    >
                      (Demo) HR Approve
                    </Button>
                    <Button
                      variant="danger"
                      disabled={d.status !== 'pending'}
                      onClick={() => simulateHr(key, 'rejected')}
                    >
                      (Demo) HR Reject
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
