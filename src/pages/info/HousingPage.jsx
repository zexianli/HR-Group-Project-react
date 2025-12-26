import { useState, useMemo } from 'react';
import '../../components/info/styles.css';
import Navbar from '../../components/navbar/OnboardNavBar';
import SectionCard from '../../components/info/layout/SectionCard';
import { FieldRow, TextInput, Modal } from '../../components/info/layout/ModuleAction';
import { housingData, initialReports } from '../../assets/data/housing-info';

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
  const [reports, setReports] = useState(initialReports);
  const [editingReports, setEditingReports] = useState(false);
  const [newReport, setNewReport] = useState({
    title: '',
    description: '',
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [previewReport, setPreviewReport] = useState(null);
  const [previewComment, setPreviewComment] = useState('');

  const reportCount = useMemo(() => reports.length, [reports]);

  /* ---------------- Handlers ---------------- */

  const submitReport = () => {
    if (!newReport.title || !newReport.description) return;

    setReports((prev) => [
      {
        id: Date.now(),
        title: newReport.title,
        description: newReport.description,
        createdBy: 'Yuhang Zhang',
        createdAt: new Date().toLocaleString(),
        status: 'Open',
        comments: [],
      },
      ...prev,
    ]);

    setNewReport({ title: '', description: '' });
  };

  const addPreviewComment = () => {
    if (!previewComment || !previewReport) return;

    setReports((prev) =>
      prev.map((r) =>
        r.id === previewReport.id
          ? {
              ...r,
              comments: [
                ...r.comments,
                {
                  id: Date.now(),
                  description: previewComment,
                  createdBy: 'Yuhang Zhang',
                  timestamp: new Date().toLocaleString(),
                },
              ],
            }
          : r
      )
    );

    setPreviewReport((prev) => ({
      ...prev,
      comments: [
        ...prev.comments,
        {
          id: Date.now(),
          description: previewComment,
          createdBy: 'Yuhang Zhang',
          timestamp: new Date().toLocaleString(),
        },
      ],
    }));

    setPreviewComment('');
  };

  return (
    <>
      <Navbar />
      <PageShell>
        {/* ================= HOUSE DETAILS ================= */}
        <SectionCard title="House Details" canEdit={false}>
          <div className="stack row-2">
            <FieldRow label="Building / Apt">
              <TextInput disabled value={housingData.address.apt} />
            </FieldRow>

            <FieldRow label="Street">
              <TextInput disabled value={housingData.address.street} />
            </FieldRow>
          </div>

          <div className="stack row-2">
            <FieldRow label="City">
              <TextInput disabled value={housingData.address.city} />
            </FieldRow>

            <FieldRow label="State">
              <TextInput disabled value={housingData.address.state} />
            </FieldRow>
          </div>

          <div className="stack row-2">
            <FieldRow label="Zip">
              <TextInput disabled value={housingData.address.zip} />
            </FieldRow>
            <div />
          </div>

          <div className="divider" />

          <h3 className="h3">Roommates</h3>

          {housingData.roommates.map((r, idx) => (
            <div key={idx} className="stack row-2">
              <FieldRow label="Name">
                <TextInput disabled value={r.name} />
              </FieldRow>
              <FieldRow label="Phone">
                <TextInput disabled value={r.phone} />
              </FieldRow>
            </div>
          ))}
        </SectionCard>

        {/* ================= MY REPORTS ================= */}
        <SectionCard
          title={`My Facility Reports (${reportCount})`}
          canEdit={true}
          isEditing={editingReports}
          onEdit={() => {
            setEditingReports(true);
            setShowAddForm(false);
          }}
          onCancel={() => {
            setEditingReports(false);
            setShowAddForm(false);
            setNewReport({ title: '', description: '' });
          }}
          onSave={() => {
            setEditingReports(false);
            setShowAddForm(false);
          }}
        >
          {reports.length === 0 && <div className="empty-state">No reports submitted.</div>}

          {reports.map((r) => (
            <div key={r.id} className="doc-item">
              <div className="clickable report-main" style={{ flex: 1 }}>
                <strong className="report-title">{r.title}</strong>

                <div className="report-meta">
                  <span className="report-time">{r.createdAt}</span>
                  <StatusBadge status={r.status} />
                </div>
              </div>
              <button className="btn-ghost" onClick={() => setPreviewReport(r)}>
                Preview
              </button>
            </div>
          ))}

          {editingReports && !showAddForm && (
            <button
              className="doc-upload-row"
              onClick={() => setShowAddForm(true)}
              style={{ marginBottom: 12 }}
            >
              + Add Facility Report
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
                <div>{previewReport.createdBy}</div>
              </FieldRow>

              <FieldRow label="Timestamp">
                <div>{previewReport.createdAt}</div>
              </FieldRow>

              <FieldRow label="Status">
                <StatusBadge status={previewReport.status} />
              </FieldRow>

              <div className="divider" />

              {/* ---- Comments ---- */}
              <h3 className="h3">Comments</h3>

              {previewReport.comments.length === 0 && (
                <div className="empty-state">No comments yet.</div>
              )}

              {previewReport.comments.map((c) => (
                <div key={c.id} className="comment">
                  <div className="comment-body">{c.description}</div>
                  <div className="comment-meta">
                    <span className="comment-author">{c.createdBy}</span>
                    <span className="comment-dot">•</span>
                    <span className="comment-time">{c.timestamp}</span>
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

/* ---------------- Small Helpers ---------------- */

function AddComment({ onSubmit }) {
  const [text, setText] = useState('');

  return (
    <div className="stack">
      <textarea
        className="textarea"
        rows={2}
        placeholder="Add a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        className="btn-primary"
        onClick={() => {
          onSubmit(text);
          setText('');
        }}
      >
        Add Comment
      </button>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    Open: 'badge-open',
    'In Progress': 'badge-progress',
    Closed: 'badge-closed',
  };

  return <span className={`badge ${map[status]}`}>{status}</span>;
}
