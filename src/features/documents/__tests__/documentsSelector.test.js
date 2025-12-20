import { selectDocuments, selectDocumentByType } from '../documentsSelectors';

describe('documents selectors', () => {
  const state = {
    documents: {
      files: {
        optReceipt: { id: '1', status: 'approved' },
      },
    },
  };

  it('selectDocuments', () => {
    expect(selectDocuments(state).optReceipt.status).toBe('approved');
  });

  it('selectDocumentByType', () => {
    const selector = selectDocumentByType('optReceipt');
    expect(selector(state).id).toBe('1');
  });
});
