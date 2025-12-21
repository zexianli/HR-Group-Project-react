export const selectDocuments = (state) => state.documents.files;
export const selectDocumentByType = (type) => (state) => state.documents.files[type];
export const selectDocumentsLoading = (state) => state.documents.loading;
