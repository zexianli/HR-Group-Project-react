export const initialDocs = {
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
      emptyTemplateUrl: '/templates/i-983-empty.pdf', // can be blank pdfs in /public/templates
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
