import housingReducer, { setHousing, setReports } from '../housingSlice';

describe('housingSlice reducer', () => {
  const initialState = {
    house: null,
    reports: [],
    loading: false,
    error: null,
  };

  it('should return the initial state', () => {
    const state = housingReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('should handle setHousing', () => {
    const house = {
      address: '123 Main St',
      landlord: { name: 'John Doe' },
    };

    const state = housingReducer(initialState, setHousing(house));

    expect(state.house).toEqual(house);
  });

  it('should handle setReports', () => {
    const reports = [
      {
        id: 'r1',
        title: 'Broken AC',
        status: 'Open',
      },
    ];

    const state = housingReducer(initialState, setReports(reports));

    expect(state.reports.length).toBe(1);
    expect(state.reports[0].title).toBe('Broken AC');
  });
});
