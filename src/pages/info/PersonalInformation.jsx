import React, { useMemo, useState } from 'react';
import '../../components/info/styles.css';
import { initialProfile, sectionOrder } from '../../assets/data/personal-info';
import Navbar from '../../components/navbar/OnboardNavBar';
import SectionCard from '../../components/info/layout/SectionCard';
import {
  deepClone,
  isPdf,
  isImage,
  FieldRow,
  TextInput,
  Select,
  DateInput,
  Modal,
} from '../../components/info/layout/ModuleAction';
import FALLBACK_AVATAR from '../../assets/data/fallback-avatar';

/**
 * PersonalInformationPage
 * - Section-level edit/cancel/save
 * - Cancel confirms discard and reverts to last saved
 * - Documents: list + download + preview modal (image/pdf) + optional upload demo
 */

function PageShell({ children }) {
  return (
    <div className="page">
      <div className="grid">{children}</div>
    </div>
  );
}

export default function PersonalInformationPage() {
  // "saved" is the source of truth (what user last saved)
  const [saved, setSaved] = useState(() => deepClone(initialProfile));
  // "draft" is editable copy (changes live here during edit)
  const [draft, setDraft] = useState(() => deepClone(initialProfile));

  // track which section is currently in edit mode
  const [editing, setEditing] = useState(() => {
    const m = {};
    for (const s of sectionOrder) m[s.key] = false;
    return m;
  });

  // document preview modal
  const [previewDoc, setPreviewDoc] = useState(null);

  const startEdit = (sectionKey) => {
    // sync draft section with saved each time you enter edit
    setDraft((prev) => ({ ...prev, [sectionKey]: deepClone(saved[sectionKey]) }));
    setEditing((prev) => ({ ...prev, [sectionKey]: true }));
  };

  const cancelEdit = (sectionKey) => {
    const ok = window.confirm(
      'Discard all changes in this section?\n\nClick OK to discard, or Cancel to keep editing.'
    );
    if (!ok) return;

    setDraft((prev) => ({ ...prev, [sectionKey]: deepClone(saved[sectionKey]) }));
    setEditing((prev) => ({ ...prev, [sectionKey]: false }));
  };

  const saveEdit = (sectionKey) => {
    setSaved((prev) => ({ ...prev, [sectionKey]: deepClone(draft[sectionKey]) }));
    setEditing((prev) => ({ ...prev, [sectionKey]: false }));
  };

  // helpers for updating nested values
  const updateDraftField = (sectionKey, field, value) => {
    setDraft((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [field]: value,
      },
    }));
  };

  const documentCount = useMemo(() => saved.documents.length, [saved.documents]);

  // Optional demo: upload local file into documents (creates object URL)
  const onUploadDoc = (file, type) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const newDoc = {
      id: `doc-${Date.now()}`,
      type: type || 'Uploaded Document',
      filename: file.name,
      url,
      mime: file.type || 'application/octet-stream',
      uploadedAt: new Date().toISOString().slice(0, 10),
    };

    // If documents section is NOT editing, we can treat upload as immediate save,
    // but your spec doesn’t mandate this. Here we add to both draft and saved if not editing;
    // if editing, add to draft only.
    setDraft((prev) => ({ ...prev, documents: [newDoc, ...prev.documents] }));
    setSaved((prev) =>
      editing.documents ? prev : { ...prev, documents: [newDoc, ...prev.documents] }
    );
  };
  return (
    <>
      <Navbar />
      <PageShell>
        {/* NAME */}
        <SectionCard
          title="Name"
          isEditing={editing.name}
          onEdit={() => startEdit('name')}
          onCancel={() => cancelEdit('name')}
          onSave={() => saveEdit('name')}
        >
          <div className="row-2">
            <div className="avatar-wrap">
              <img
                src={draft.name.profilePictureUrl || FALLBACK_AVATAR}
                alt="Profile"
                className="avatar"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_AVATAR;
                }}
              />
            </div>

            <div className="stack gap-lg">
              <FieldRow label="First name">
                <TextInput
                  disabled={!editing.name}
                  value={draft.name.firstName}
                  onChange={(v) => updateDraftField('name', 'firstName', v)}
                />
              </FieldRow>

              <FieldRow label="Middle name">
                <TextInput
                  disabled={!editing.name}
                  value={draft.name.middleName}
                  onChange={(v) => updateDraftField('name', 'middleName', v)}
                />
              </FieldRow>

              <FieldRow label="Last name">
                <TextInput
                  disabled={!editing.name}
                  value={draft.name.lastName}
                  onChange={(v) => updateDraftField('name', 'lastName', v)}
                />
              </FieldRow>

              <FieldRow label="Preferred name">
                <TextInput
                  disabled={!editing.name}
                  value={draft.name.preferredName}
                  onChange={(v) => updateDraftField('name', 'preferredName', v)}
                />
              </FieldRow>

              <FieldRow label="Email">
                <TextInput
                  disabled={!editing.name}
                  value={draft.name.email}
                  onChange={(v) => updateDraftField('name', 'email', v)}
                  placeholder="name@example.com"
                />
              </FieldRow>

              <FieldRow label="SSN">
                <TextInput
                  disabled={!editing.name}
                  value={draft.name.ssn}
                  onChange={(v) => updateDraftField('name', 'ssn', v)}
                  placeholder="XXX-XX-XXXX"
                />
              </FieldRow>

              <FieldRow label="Date of birth">
                <DateInput
                  disabled={!editing.name}
                  value={draft.name.dob}
                  onChange={(v) => updateDraftField('name', 'dob', v)}
                />
              </FieldRow>

              <FieldRow label="Gender">
                <Select
                  disabled={!editing.name}
                  value={draft.name.gender}
                  onChange={(v) => updateDraftField('name', 'gender', v)}
                  options={[
                    { value: '', label: 'Select...' },
                    { value: 'Male', label: 'Male' },
                    { value: 'Female', label: 'Female' },
                    { value: 'Non-binary', label: 'Non-binary' },
                    { value: 'Prefer not to say', label: 'Prefer not to say' },
                  ]}
                />
              </FieldRow>
              <FieldRow label="Profile URL">
                <TextInput
                  disabled={!editing.name}
                  value={draft.name.profilePictureUrl}
                  onChange={(v) => updateDraftField('name', 'profilePictureUrl', v)}
                  placeholder="Paste image URL"
                />
              </FieldRow>
            </div>
          </div>
        </SectionCard>

        {/* ADDRESS */}
        <SectionCard
          title="Address"
          isEditing={editing.address}
          onEdit={() => startEdit('address')}
          onCancel={() => cancelEdit('address')}
          onSave={() => saveEdit('address')}
        >
          <div className="stack row-2">
            <FieldRow label="Building/Apt">
              <TextInput
                disabled={!editing.address}
                value={draft.address.apt}
                onChange={(v) => updateDraftField('address', 'apt', v)}
              />
            </FieldRow>
            <FieldRow label="Street name">
              <TextInput
                disabled={!editing.address}
                value={draft.address.street}
                onChange={(v) => updateDraftField('address', 'street', v)}
              />
            </FieldRow>
          </div>
          <div className="stack row-2">
            <FieldRow label="City">
              <TextInput
                disabled={!editing.address}
                value={draft.address.city}
                onChange={(v) => updateDraftField('address', 'city', v)}
              />
            </FieldRow>
            <FieldRow label="State">
              <TextInput
                disabled={!editing.address}
                value={draft.address.state}
                onChange={(v) => updateDraftField('address', 'state', v)}
              />
            </FieldRow>
          </div>
          <div className="stack row-2">
            <FieldRow label="Zip">
              <TextInput
                disabled={!editing.address}
                value={draft.address.zip}
                onChange={(v) => updateDraftField('address', 'zip', v)}
              />
            </FieldRow>
            <div></div>
          </div>
        </SectionCard>

        {/* CONTACT INFO */}
        <SectionCard
          title="Contact Info"
          isEditing={editing.contact}
          onEdit={() => startEdit('contact')}
          onCancel={() => cancelEdit('contact')}
          onSave={() => saveEdit('contact')}
        >
          <div className="stack row-2">
            <FieldRow label="Mobile Phone">
              <TextInput
                disabled={!editing.contact}
                value={draft.contact.cellPhone}
                onChange={(v) => updateDraftField('address', 'cellPhone', v)}
              />
            </FieldRow>
            <FieldRow label="Work Phone">
              <TextInput
                disabled={!editing.contact}
                value={draft.contact.workPhone}
                onChange={(v) => updateDraftField('address', 'workPhone', v)}
              />
            </FieldRow>
          </div>
        </SectionCard>

        {/* EMPLOYMENT */}
        <SectionCard
          title="Employment"
          isEditing={editing.employment}
          onEdit={() => startEdit('employment')}
          onCancel={() => cancelEdit('employment')}
          onSave={() => saveEdit('employment')}
        >
          <div className="stack row-2">
            <FieldRow label="Visa Title">
              <TextInput
                disabled={!editing.employment}
                value={draft.employment.visaTitle}
                onChange={(v) => updateDraftField('employment', 'visaTitle', v)}
                placeholder="e.g. F-1 OPT, H-1B"
              />
            </FieldRow>

            <div></div>
          </div>
          <div className="stack row-2">
            <FieldRow label="Start Date">
              <DateInput
                disabled={!editing.employment}
                value={draft.employment.startDate}
                onChange={(v) => updateDraftField('employment', 'startDate', v)}
              />
            </FieldRow>

            <FieldRow label="End Date">
              <DateInput
                disabled={!editing.employment}
                value={draft.employment.endDate}
                onChange={(v) => updateDraftField('employment', 'endDate', v)}
              />
            </FieldRow>
          </div>
        </SectionCard>

        {/* EMERGENCY CONTACT */}
        <SectionCard
          title="Emergency Contact"
          isEditing={editing.emergency}
          onEdit={() => startEdit('emergency')}
          onCancel={() => cancelEdit('emergency')}
          onSave={() => saveEdit('emergency')}
        >
          <div className="stack row-2">
            <FieldRow label="First Name">
              <TextInput
                disabled={!editing.emergency}
                value={draft.emergency.firstName}
                onChange={(v) => updateDraftField('emergency', 'firstName', v)}
              />
            </FieldRow>

            <FieldRow label="Middle Name">
              <TextInput
                disabled={!editing.emergency}
                value={draft.emergency.middleName}
                onChange={(v) => updateDraftField('emergency', 'middleName', v)}
              />
            </FieldRow>
          </div>

          <div className="stack row-2">
            <FieldRow label="Last Name">
              <TextInput
                disabled={!editing.emergency}
                value={draft.emergency.lastName}
                onChange={(v) => updateDraftField('emergency', 'lastName', v)}
              />
            </FieldRow>

            <FieldRow label="Phone">
              <TextInput
                disabled={!editing.emergency}
                value={draft.emergency.phone}
                onChange={(v) => updateDraftField('emergency', 'phone', v)}
              />
            </FieldRow>
          </div>

          <div className="stack row-2">
            <FieldRow label="Email">
              <TextInput
                disabled={!editing.emergency}
                value={draft.emergency.email}
                onChange={(v) => updateDraftField('emergency', 'email', v)}
              />
            </FieldRow>

            <FieldRow label="Relationship">
              <TextInput
                disabled={!editing.emergency}
                value={draft.emergency.relationship}
                onChange={(v) => updateDraftField('emergency', 'relationship', v)}
                placeholder="e.g. Parent, Spouse, Friend"
              />
            </FieldRow>
          </div>
        </SectionCard>

        {/* DOCUMENTS */}
        <SectionCard
          title={`Documents (${documentCount})`}
          isEditing={editing.documents}
          onEdit={() => startEdit('documents')}
          onCancel={() => cancelEdit('documents')}
          onSave={() => saveEdit('documents')}
        >
          <div className="stack">
            {draft.documents.length === 0 ? (
              <div className="empty-state">No documents uploaded.</div>
            ) : (
              <div className="doc-list">
                {draft.documents.map((doc) => (
                  <div key={doc.id} className="doc-item">
                    <div>
                      <div className="doc-title">{doc.filename}</div>
                      <div className="doc-meta">{doc.uploadedAt}</div>
                    </div>

                    <div className="button-group">
                      <button className="btn-ghost" onClick={() => setPreviewDoc(doc)}>
                        Preview
                      </button>
                      <button
                        className="btn-primary"
                        onClick={async () => {
                          const response = await fetch(doc.url);
                          const blob = await response.blob();

                          const url = window.URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = doc.filename;

                          document.body.appendChild(link);
                          link.click();

                          document.body.removeChild(link);
                          window.URL.revokeObjectURL(url);
                        }}
                      >
                        Download
                      </button>
                      {/* <a
                        href={doc.url}
                        download={doc.filename}
                        className="btn-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        Download
                      </a> */}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {editing.documents && (
              <label className="doc-upload-row">
                <span className="doc-upload-plus">+</span>
                <span>Add document</span>

                <input
                  type="file"
                  hidden
                  onChange={(e) => {
                    onUploadDoc(e.target.files?.[0]);
                    e.target.value = ''; // allow re-upload same file
                  }}
                />
              </label>
            )}
          </div>
        </SectionCard>

        {/* DOCUMENT PREVIEW */}
        <Modal
          open={!!previewDoc}
          title={previewDoc?.filename || 'Document'}
          onClose={() => setPreviewDoc(null)}
        >
          {previewDoc && (
            <>
              {isImage(previewDoc.mime, previewDoc.url) ? (
                <img src={previewDoc.url} alt={previewDoc.filename} className="preview-img" />
              ) : isPdf(previewDoc.mime, previewDoc.url) ? (
                <iframe title="PDF Preview" src={previewDoc.url} className="preview-frame" />
              ) : (
                <div className="empty-state">Preview not available. Please download.</div>
              )}
            </>
          )}
        </Modal>
      </PageShell>
    </>
  );
}
