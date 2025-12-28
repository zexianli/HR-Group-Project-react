/**
 * Convert backend visa document payload to frontend docs state
 */
export function mapBackendVisaToDocs(apiData) {
  const STATUS_MAP = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
  };

  const TYPE_MAP = {
    OPT_RECEIPT: 'optReceipt',
    OPT_EAD: 'optEad',
    I_983: 'i983',
    I_20: 'i20',
  };

  // frontend default shape (must match your component exactly)
  const baseDocs = {
    optReceipt: {
      name: 'OPT Receipt',
      status: 'not_uploaded',
      filename: '',
      feedback: '',
      uploadedAt: '',
    },
    optEad: {
      name: 'OPT EAD',
      status: 'not_uploaded',
      filename: '',
      feedback: '',
      uploadedAt: '',
    },
    i983: {
      name: 'I-983',
      status: 'not_uploaded',
      filename: '',
      feedback: '',
      uploadedAt: '',
      downloads: {
        emptyTemplateUrl: '/templates/i-983-empty.pdf',
        sampleTemplateUrl: '/templates/i-983-sample.pdf',
      },
    },
    i20: {
      name: 'I-20',
      status: 'not_uploaded',
      filename: '',
      feedback: '',
      uploadedAt: '',
    },
  };

  if (!apiData?.documents) return baseDocs;

  const docs = { ...baseDocs };

  apiData.documents.forEach((doc) => {
    const key = TYPE_MAP[doc.documentType];
    if (!key) return;

    docs[key] = {
      ...docs[key],
      status: STATUS_MAP[doc.status] ?? 'not_uploaded',
      filename: doc.documentKey ? doc.documentKey.split('/').pop() : '',
      uploadedAt: doc.updatedAt ? doc.updatedAt.slice(0, 10) : '',
      feedback: doc.feedback ?? '',
    };
  });

  return docs;
}
