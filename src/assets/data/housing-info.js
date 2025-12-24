export const housingData = {
  address: {
    apt: 'Apt 305',
    street: '1234 West Adams Blvd',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90007',
  },
  roommates: [
    { name: 'John Smith', phone: '213-555-1234' },
    { name: 'Emily Chen', phone: '213-555-5678' },
  ],
};

export const initialReports = [
  {
    id: 1,
    title: 'Air conditioner not working',
    description: 'Living room AC is not cooling.',
    createdBy: 'Yuhang Zhang',
    createdAt: '2025-01-10 14:32',
    status: 'Open',
    comments: [
      {
        id: 1,
        description: 'Maintenance ticket created.',
        createdBy: 'HR',
        timestamp: '2025-01-10 16:05',
      },
    ],
  },
];
