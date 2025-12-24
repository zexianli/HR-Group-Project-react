import '../styles.css';

function SectionCard({ title, isEditing, onEdit, onCancel, onSave, children, canEdit = true }) {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="h2">{title}</h2>
        {canEdit &&
          (!isEditing ? (
            <button className="btn-primary" onClick={onEdit}>
              Edit
            </button>
          ) : (
            <div className="button-group">
              <button className="btn-ghost" onClick={onCancel}>
                Cancel
              </button>
              <button className="btn-primary" onClick={onSave}>
                Save
              </button>
            </div>
          ))}
      </div>

      <div className="card-body">{children}</div>
    </div>
  );
}

export default SectionCard;
