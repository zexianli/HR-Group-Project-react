const initialProfile = {
  name: {
    firstName: '',
    middleName: '',
    lastName: '',
    preferredName: '',
    email: '',
    ssn: '',
    dob: '',
    gender: '',
    profilePictureUrl: '',
  },
  address: {
    apt: '',
    street: '',
    city: '',
    state: '',
    zip: '',
  },
  contact: {
    cellPhone: '',
    workPhone: '',
  },
  employment: {
    visaTitle: '',
    startDate: '',
    endDate: '',
  },
  emergency: {
    firstName: '',
    middleName: '',
    lastName: '',
    phone: '',
    email: '',
    relationship: '',
  },
  documents: {},
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
