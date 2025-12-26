const initialProfile = {
  name: {
    firstName: 'Yuhang',
    middleName: '',
    lastName: 'Zhang',
    preferredName: 'Leo',
    email: 'leo.zhang@example.com',
    ssn: '123-45-6789',
    dob: '1999-01-01',
    gender: 'Male',
    profilePictureUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBRA2TmZWxhMbzalqzdjW_zZJBp7U3ZdE--w&s',
  },
  address: {
    apt: 'Apt 1203',
    street: '123 Main St',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90007',
  },
  contact: {
    cellPhone: '(213) 555-0101',
    workPhone: '(213) 555-0199',
  },
  employment: {
    visaTitle: 'F-1 OPT',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
  },
  emergency: {
    firstName: 'Jane',
    middleName: '',
    lastName: 'Zhang',
    phone: '(626) 555-0123',
    email: 'jane@example.com',
    relationship: 'Sister',
  },
  documents: [
    {
      id: 'doc-1',
      filename: 'drivers_license.png',
      // image example:
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Example.jpg/640px-Example.jpg',
      mime: 'image/jpeg',
      uploadedAt: '2025-12-10',
    },
    {
      id: 'doc-2',
      filename: 'work_auth.pdf',
      // pdf example:
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      mime: 'application/pdf',
      uploadedAt: '2025-12-12',
    },
  ],
};

const sectionOrder = [
  { key: 'name', title: 'Name' },
  { key: 'address', title: 'Address' },
  { key: 'contact', title: 'Contact Info' },
  { key: 'employment', title: 'Employment' },
  { key: 'emergency', title: 'Emergency Contact' },
  { key: 'documents', title: 'Documents' },
];

export { initialProfile, sectionOrder };
