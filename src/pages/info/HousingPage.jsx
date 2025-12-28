/* eslint-disable */
import { useState, useEffect } from 'react';
import '../../components/info/styles.css';
import Navbar from '../../components/navbar/OnboardNavBar';
import SectionCard from '../../components/info/layout/SectionCard';
import { FieldRow, TextInput, Modal } from '../../components/info/layout/ModuleAction';
import { formatMonthDay } from '../../components/common/formatedData';
import { getAuthHeader } from '../../api/getToken';

/**
 * HousingPage
 * - House Details: read-only
 * - Facility Reports: create + view own + comments thread
 */

function PageShell({ children }) {
  return (
    <div className="page">
      <div className="grid">{children}</div>
    </div>
  );
}

export default function HousingPage() {
  const [housing, setHousing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [newReport, setNewReport] = useState({
    title: '',
    description: '',
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [previewReport, setPreviewReport] = useState(null);
  const [previewComment, setPreviewComment] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(false);

  /* ---------------- Handlers ---------------- */
  useEffect(() => {
    async function fetchHousing() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/housing/me`, {
          headers: {
            Authorization: getAuthHeader(),
          },
        });

        if (!res.ok) {
          throw new Error(`Failed: ${res.status}`);
        }

        const response = await res.json();
        setHousing(response.data);
      } catch (err) {
        console.error('Housing fetch failed:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchHousing();
  }, []);

  async function fetchReports() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/housing/reports`, {
        headers: {
          Authorization: getAuthHeader(),
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch reports: ${res.status}`);
      }

      const response = await res.json();
      setReports(response.data);
    } catch (err) {
      console.error('Reports fetch failed:', err);
    }
  }

  useEffect(() => {
    fetchReports();
  }, []);

  async function submitReport() {
    if (!newReport.title.trim() || !newReport.description.trim()) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/housing/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAuthHeader(),
        },
        body: JSON.stringify({
          title: newReport.title,
          description: newReport.description,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to submit report: ${res.status}`);
      }

      setNewReport({ title: '', description: '' });

      await fetchReports();

      setShowAddForm(false);
    } catch (err) {
      console.error('Submit report failed:', err);
    }
  }

  async function addPreviewComment() {
    if (!previewComment.trim() || !previewReport) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/housing/reports/${previewReport.id}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: getAuthHeader(),
          },
          body: JSON.stringify({
            description: previewComment,
          }),
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to add comment: ${res.status}`);
      }

      // ✅ Clear input immediately
      setPreviewComment('');

      // ✅ Refresh comments after successful POST
      await fetchComments(previewReport);
    } catch (err) {
      console.error('Add comment failed:', err);
    }
  }

  async function fetchComments(report) {
    setCommentsLoading(true);

    try {
      console.log(report.id);
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/housing/reports/${report.id}/comments`,
        {
          headers: {
            Authorization: getAuthHeader(),
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch comments: ${res.status}`);
      }

      const response = await res.json();

      setPreviewReport({
        ...report,
        comments: response.data,
      });
    } catch (err) {
      console.error('Comments fetch failed:', err);
      setPreviewReport({
        ...report,
        comments: [],
      });
    } finally {
      setCommentsLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <PageShell>
        {/* ================= HOUSE DETAILS ================= */}
        <SectionCard title="House Details" canEdit={false}>
          <div className="stack row-2">
            <FieldRow label="City">
              <TextInput disabled value={housing?.house?.address?.city || ''} />
            </FieldRow>
            <FieldRow label="State">
              <TextInput disabled value={housing?.house?.address?.state || ''} />
            </FieldRow>
          </div>

          <div className="stack row-2">
            <FieldRow label="Street">
              <TextInput disabled value={housing?.house?.address?.street || ''} />
            </FieldRow>

            <FieldRow label="Unit">
              <TextInput disabled value={housing?.house?.address?.unit || ''} />
            </FieldRow>
          </div>

          <div className="stack row-2">
            <FieldRow label="Zip">
              <TextInput disabled value={housing?.house?.address?.zip || ''} />
            </FieldRow>
            <div />
          </div>

          <div className="divider" />

          <h3 className="h3">Roommates</h3>

          {housing?.roommates?.map((r, idx) => (
            <div key={idx} className="stack row-2">
              <FieldRow label="First Name">
                <TextInput disabled value={r.firstName} />
              </FieldRow>
              <FieldRow label="Last Name">
                <TextInput disabled value={r.lastName} />
              </FieldRow>
              <FieldRow label="Phone">
                <TextInput disabled value={r.phone} />
              </FieldRow>
            </div>
          ))}
        </SectionCard>

        {/* ================= MY REPORTS ================= */}
        <SectionCard title={`My Facility Reports`} canEdit={false}>
          {reports.length === 0 && <div className="empty-state">No reports submitted.</div>}

          {reports.map((r) => (
            <div key={r.id} className="doc-item">
              <div className="clickable report-main" style={{ flex: 1 }}>
                <strong className="report-title">{r.title}</strong>

                <div className="report-meta">
                  <span className="report-time">{formatMonthDay(r.createdAt)}</span>
                  <StatusBadge status={r.status} />
                </div>
              </div>
              <button className="btn-ghost" onClick={() => fetchComments(r)}>
                Preview
              </button>
            </div>
          ))}

          {!showAddForm && (
            <button
              className="doc-upload-row"
              onClick={() => setShowAddForm(true)}
              style={{ marginBottom: 12 }}
            >
              Add Facility Report
            </button>
          )}
        </SectionCard>
        <Modal
          open={showAddForm}
          title="Create Facility Report"
          onClose={() => {
            setShowAddForm(false);
            setNewReport({ title: '', description: '' });
          }}
        >
          <div className="stack gap-lg">
            <FieldRow label="Title">
              <TextInput
                value={newReport.title}
                onChange={(v) => setNewReport((prev) => ({ ...prev, title: v }))}
                placeholder="Short summary of the issue"
              />
            </FieldRow>

            <FieldRow label="Description">
              <textarea
                className="textarea"
                rows={4}
                value={newReport.description}
                onChange={(e) =>
                  setNewReport((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe the issue in detail"
              />
            </FieldRow>

            <div className="button-group">
              <button
                className="btn-ghost"
                onClick={() => {
                  setShowAddForm(false);
                  setNewReport({ title: '', description: '' });
                }}
              >
                Cancel
              </button>

              <button
                className="btn-primary"
                onClick={() => {
                  submitReport();
                  setShowAddForm(false);
                }}
              >
                Submit Report
              </button>
            </div>
          </div>
        </Modal>
        <Modal
          open={!!previewReport}
          title="Facility Report Preview"
          onClose={() => {
            setPreviewReport(null);
            setPreviewComment('');
          }}
        >
          {previewReport && (
            <div className="stack gap-lg">
              {/* ---- Report Info ---- */}
              <FieldRow label="Title">
                <div>{previewReport.title}</div>
              </FieldRow>

              <FieldRow label="Description">
                <div>{previewReport.description}</div>
              </FieldRow>

              <FieldRow label="Created By">
                <div>{previewReport.createdBy.username}</div>
              </FieldRow>

              <FieldRow label="Timestamp">
                <div>{formatMonthDay(previewReport.createdAt)}</div>
              </FieldRow>

              <FieldRow label="Status">
                <StatusBadge status={previewReport.status} />
              </FieldRow>

              <div className="divider" />

              {/* ---- Comments ---- */}
              <h3 className="h3">Comments</h3>

              {commentsLoading && <div className="empty-state">Loading comments...</div>}

              {!commentsLoading && previewReport.comments?.length === 0 && (
                <div className="empty-state">No comments yet.</div>
              )}

              {previewReport.comments?.map((c) => (
                <div key={c.id} className="comment">
                  <div className="comment-body">{c.message}</div>
                  <div className="comment-meta">
                    <span className="comment-author">{c.createdBy.username}</span>
                    <span className="comment-dot">•</span>
                    <span className="comment-time">{formatMonthDay(c.createdAt)}</span>
                  </div>
                </div>
              ))}

              {/* ---- Add Comment ---- */}
              <div className="comment-input">
                <textarea
                  className="comment-textarea"
                  rows={2}
                  placeholder="Add a comment..."
                  value={previewComment}
                  onChange={(e) => setPreviewComment(e.target.value)}
                />

                <div className="comment-actions">
                  <button
                    className="btn-primary"
                    onClick={addPreviewComment}
                    disabled={!previewComment.trim()}
                  >
                    Add Comment
                  </button>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </PageShell>
    </>
  );
}

function StatusBadge({ status }) {
  const map = {
    OPEN: 'badge-open',
    'In Progress': 'badge-progress',
    CLOSED: 'badge-closed',
  };

  return <span className={`badge ${map[status]}`}>{status}</span>;
}
