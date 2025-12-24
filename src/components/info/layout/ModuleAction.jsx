/* eslint-disable react-refresh/only-export-components */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function formatPhoneHint(value) {
  if (!value) return '';
  return value.replace(/[^\d]/g, '');
}

function isPdf(mime, url) {
  return mime === 'application/pdf' || (url || '').toLowerCase().endsWith('.pdf');
}

function isImage(mime, url) {
  const u = (url || '').toLowerCase();
  return (
    (mime || '').startsWith('image/') ||
    u.endsWith('.png') ||
    u.endsWith('.jpg') ||
    u.endsWith('.jpeg') ||
    u.endsWith('.webp') ||
    u.endsWith('.gif')
  );
}

function FieldRow({ label, children }) {
  return (
    <div className="field-row">
      <div className="field-label">{label}</div>
      <div>{children}</div>
    </div>
  );
}

function TextInput({ value, onChange, disabled, placeholder }) {
  return (
    <input
      className="input"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder={placeholder}
    />
  );
}

function Select({ value, onChange, disabled, options }) {
  return (
    <select
      className="input"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function DateInput({ value, onChange, disabled }) {
  return (
    <input
      type="date"
      className="input"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  );
}

function Modal({ open, title, onClose, children }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">{title}</div>
            <div className="modal-sub">Preview</div>
          </div>
          <button className="btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export {
  deepClone,
  formatPhoneHint,
  isPdf,
  isImage,
  FieldRow,
  TextInput,
  Select,
  DateInput,
  Modal,
};
