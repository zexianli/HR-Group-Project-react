export function normalizeDocuments(list) {
  const safeList = Array.isArray(list) ? list : [];

  const DOCUMENT_TYPES = ['driver_license', 'opt_receipt', 'opt_ead', 'i983', 'i20'];

  const mapped = Object.fromEntries(
    safeList.map((doc) => {
      const key = doc.documentType.toLowerCase(); // OPT_EAD → opt_ead

      return [
        key,
        {
          documentType: key,
          downloadUrl: doc.downloadUrl,
          uploadedAt: doc.uploadedAt ? doc.uploadedAt.slice(0, 10) : null,
          status: doc.status,
          reviewedAt: doc.reviewedAt,
          feedback: doc.feedback,
        },
      ];
    })
  );

  // Ensure all document slots exist
  return Object.fromEntries(DOCUMENT_TYPES.map((type) => [type, mapped[type] || null]));
}
