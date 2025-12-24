export const OPT_FLOW = [
  { key: 'optReceipt', label: 'OPT Receipt' },
  { key: 'optEad', label: 'OPT EAD' },
  { key: 'i983', label: 'I-983' },
  { key: 'i20', label: 'I-20' },
];

export const INITIAL_VISA_STATE = {
  visaType: 'PR',
  documents: {
    optReceipt: {
      status: 'pending',
      feedback: '',
      file: null,
    },
    optEad: {
      status: 'not_uploaded',
      feedback: '',
      file: null,
    },
    i983: {
      status: 'not_uploaded',
      feedback: '',
      file: null,
    },
    i20: {
      status: 'not_uploaded',
      feedback: '',
      file: null,
    },
  },
};
