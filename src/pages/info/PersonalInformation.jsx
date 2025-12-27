/* eslint-disable */
import { useMemo, useState, useEffect } from 'react';
import '../../components/info/styles.css';
import Navbar from '../../components/navbar/OnboardNavBar';
import SectionCard from '../../components/info/layout/SectionCard';
import { previewDocuments } from '../../api/previewDocuments';
import { uploadDocuments } from '../../api/uploadDocuments';
import {
  deepClone,
  FieldRow,
  TextInput,
  Select,
  DateInput,
  Modal,
} from '../../components/info/layout/ModuleAction';
import FALLBACK_AVATAR from '../../assets/data/fallback-avatar';
import { initialProfile } from '../../assets/data/personal-info';
import '../../components/info/styles.css';
import { getEmployeeProfile, updateEmployeeProfile } from '../../api/employeeInfomation';

/**
 * PersonalInformationPage
 */

function PageShell({ children }) {
  return (
    <div className="page">
      <div className="grid">{children}</div>
    </div>
  );
}

const sectionOrder = [
  { key: 'name' },
  { key: 'address' },
  { key: 'contact' },
  { key: 'employment' },
  { key: 'emergency' },
  { key: 'documents' },
];

const DOCUMENT_TYPES = ['driver_license', 'opt_receipt', 'opt_ead', 'i983', 'i20'];

export default function PersonalInformationPage() {
  // source of truth
  const [saved, setSaved] = useState(() => deepClone(initialProfile));
  // editable copy
  const [draft, setDraft] = useState(() => deepClone(initialProfile));

  const [editing, setEditing] = useState(() =>
    Object.fromEntries(sectionOrder.map((s) => [s.key, false]))
  );

  const [previewDocType, setPreviewDocType] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadDocType, setUploadDocType] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  /* ---------------- section edit handlers ---------------- */

  const startEdit = (sectionKey) => {
    setDraft((prev) => ({
      ...prev,
      [sectionKey]: deepClone(saved[sectionKey]),
    }));
    setEditing((prev) => ({ ...prev, [sectionKey]: true }));
  };

  const cancelEdit = (sectionKey) => {
    if (!window.confirm('Discard all changes in this section?')) return;

    setDraft((prev) => ({
      ...prev,
      [sectionKey]: deepClone(saved[sectionKey]),
    }));
    setEditing((prev) => ({ ...prev, [sectionKey]: false }));
  };

  const saveEdit = (sectionKey) => {
    setSaved((prev) => ({
      ...prev,
      [sectionKey]: deepClone(draft[sectionKey]),
    }));
    setEditing((prev) => ({ ...prev, [sectionKey]: false }));
  };

  const updateDraftField = (sectionKey, field, value) => {
    setDraft((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [field]: value,
      },
    }));
  };

  /* ---------------- avatar logic ---------------- */
  async function loadAvatar() {
    const response = await previewDocuments('profile_picture');
    if (!response) return;

    setSaved((prev) => ({
      ...prev,
      name: {
        ...prev.name,
        profilePictureUrl: response,
      },
    }));

    setDraft((prev) => ({
      ...prev,
      name: {
        ...prev.name,
        profilePictureUrl: response,
      },
    }));
  }

  const handleAvatarUpload = async (file) => {
    if (!file) return;
    const response = await uploadDocuments(file, 'profile_picture');
    if (!response) return;
    updateDraftField('name', 'profilePictureUrl', response);
    loadAvatar();
  };

  useEffect(() => {
    loadAvatar();
  }, []);

  useEffect(() => {
    async function loadDocuments() {
      const results = await Promise.all(
        DOCUMENT_TYPES.map(async (type) => {
          const url = await previewDocuments(type);
          if (!url) return [type, null];

          return [
            type,
            {
              id: `${type}-${Date.now()}`,
              filename: type.replace('_', ' ').toUpperCase(),
              url,
              mime: url.endsWith('.pdf') ? 'application/pdf' : 'image/*',
              uploadedAt: new Date().toISOString().slice(0, 10),
              type,
            },
          ];
        })
      );

      const docsMap = Object.fromEntries(results);
      console.log(docsMap);

      setSaved((prev) => ({
        ...prev,
        documents: docsMap,
      }));

      setDraft((prev) => ({
        ...prev,
        documents: docsMap,
      }));
    }

    loadDocuments();
  }, []);

  useEffect(() => {
    if (!previewDocType) return;

    async function loadPreviewDoc() {
      const response = await previewDocuments(previewDocType);
      console.log('response', response);
      if (!response) {
        setPreviewDoc(null);
        return;
      }

      setPreviewDoc(response);
    }

    loadPreviewDoc();
  }, [previewDocType]);

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
                  e.currentTarget.src = FALLBACK_AVATAR;
                }}
              />

              {editing.name && (
                <label className="avatar-upload-btn">
                  Upload Profile
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      handleAvatarUpload(e.target.files?.[0]);
                      e.target.value = '';
                    }}
                  />
                </label>
              )}
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
                />
              </FieldRow>

              <FieldRow label="SSN">
                <TextInput
                  disabled={!editing.name}
                  value={draft.name.ssn}
                  onChange={(v) => updateDraftField('name', 'ssn', v)}
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
            <div />
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
            <div />
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
        <SectionCard title={`Documents`} canEdit={false}>
          {Object.entries(draft.documents)
            .filter(([, doc]) => !!doc)
            .map(([type, doc]) => (
              <div key={type} className="doc-item">
                <div>
                  <div className="doc-title">{type.replace('_', ' ').toUpperCase()}</div>
                  <div className="doc-meta">{doc.uploadedAt}</div>
                </div>

                <div className="button-group">
                  <button
                    className="btn-ghost"
                    onClick={() => {
                      console.log('Preview clicked, doc =', doc);
                      console.log('doc.type =', doc.type);
                      setPreviewDocType(doc.type);
                    }}
                  >
                    Preview
                  </button>

                  <a
                    href="#"
                    className="btn-primary"
                    onClick={async (e) => {
                      e.preventDefault(); // ⛔ prevent redirect

                      try {
                        const response = await fetch(doc.url, {
                          credentials: 'include', // keep if auth/cookies required
                        });

                        const blob = await response.blob();
                        const blobUrl = window.URL.createObjectURL(blob);

                        const link = document.createElement('a');
                        link.href = blobUrl;
                        link.download = doc.url || 'document';
                        document.body.appendChild(link);
                        link.click();

                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(blobUrl);
                      } catch (err) {
                        console.error('Download failed:', err);
                        alert('Failed to download file');
                      }
                    }}
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          {Object.values(draft.documents).every((d) => !d) && (
            <div className="empty-state">No documents uploaded.</div>
          )}
          <button
            className="doc-upload-row"
            onClick={() => {
              setUploadDocType('');
              setUploadFile(null);
              setShowUploadModal(true);
            }}
          >
            Add Documents
          </button>
        </SectionCard>

        {/* PREVIEW */}
        <Modal
          open={!!previewDoc}
          title={previewDocType}
          onClose={() => {
            setPreviewDocType(null);
            setPreviewDoc(null);
          }}
        >
          <iframe
            title="PDF Preview"
            src={previewDoc}
            className="preview-frame preview-frame--large"
          />
        </Modal>
        <Modal
          open={showUploadModal}
          title="Upload Document"
          onClose={() => setShowUploadModal(false)}
        >
          <div className="stack gap-lg">
            {/* Document Type Dropdown */}
            <FieldRow label="Document Type">
              <Select
                value={uploadDocType}
                onChange={(v) => setUploadDocType(v)}
                options={[
                  { value: '', label: 'Select document type' },
                  { value: 'driver_license', label: 'Driver License' },
                  { value: 'opt_receipt', label: 'OPT Receipt' },
                  { value: 'opt_ead', label: 'OPT EAD' },
                  { value: 'i983', label: 'I-983' },
                  { value: 'i20', label: 'I-20' },
                ]}
              />
            </FieldRow>

            {/* File input */}
            <FieldRow label="File">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              />
            </FieldRow>

            {/* Actions */}
            <div className="button-group">
              <button
                className="btn-ghost"
                onClick={() => setShowUploadModal(false)}
                disabled={uploading}
              >
                Cancel
              </button>

              <button
                className="btn-primary"
                disabled={!uploadDocType || !uploadFile || uploading}
                onClick={async () => {
                  try {
                    setUploading(true);

                    await uploadDocuments(uploadFile, uploadDocType);

                    // refresh documents after upload
                    const url = await previewDocuments(uploadDocType);
                    if (url) {
                      setDraft((prev) => ({
                        ...prev,
                        documents: {
                          ...prev.documents,
                          [uploadDocType]: {
                            id: `${uploadDocType}-${Date.now()}`,
                            type: uploadDocType,
                            url,
                            filename: uploadDocType.toUpperCase(),
                            uploadedAt: new Date().toISOString().slice(0, 10),
                            mime: url.endsWith('.pdf') ? 'application/pdf' : 'image/*',
                          },
                        },
                      }));
                    }

                    setShowUploadModal(false);
                  } finally {
                    setUploading(false);
                  }
                }}
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </Modal>
      </PageShell>
    </>
  );
}
