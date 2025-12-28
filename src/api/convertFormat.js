/* eslint-disable */
export function mapEmployeeProfileToInitialProfile(employeeProfile) {
  if (!employeeProfile) return null;

  const emergencyContact = employeeProfile.emergencyContacts?.[0] || {};

  return {
    name: {
      firstName: employeeProfile.firstName ?? '',
      middleName: employeeProfile.middleName ?? '',
      lastName: employeeProfile.lastName ?? '',
      preferredName: employeeProfile.preferredName ?? '',
      email: employeeProfile.email ?? '',
      ssn: employeeProfile.ssn ?? '',
      dob: employeeProfile.dateOfBirth ? employeeProfile.dateOfBirth.slice(0, 10) : '',
      gender: employeeProfile.gender ?? '',
      profilePictureUrl: employeeProfile.profilePictureKey
        ? `/api/files/${employeeProfile.profilePictureKey}`
        : '',
    },

    address: {
      apt: employeeProfile.address?.buildingApt ?? '',
      street: employeeProfile.address?.street ?? '',
      city: employeeProfile.address?.city ?? '',
      state: employeeProfile.address?.state ?? '',
      zip: employeeProfile.address?.zip ?? '',
    },

    contact: {
      cellPhone: employeeProfile.cellPhone ?? '',
      workPhone: employeeProfile.workPhone ?? '',
    },

    employment: {
      visaTitle:
        employeeProfile.workAuthorizationType === 'OTHER'
          ? (employeeProfile.otherWorkAuthorizationTitle ?? '')
          : (employeeProfile.workAuthorizationType ?? ''),
      startDate: employeeProfile.workAuthorizationStart
        ? employeeProfile.workAuthorizationStart.slice(0, 10)
        : '',
      endDate: employeeProfile.workAuthorizationEnd
        ? employeeProfile.workAuthorizationEnd.slice(0, 10)
        : '',
    },

    emergency: {
      firstName: emergencyContact.firstName ?? '',
      middleName: emergencyContact.middleName ?? '',
      lastName: emergencyContact.lastName ?? '',
      phone: emergencyContact.phone ?? '',
      email: emergencyContact.email ?? '',
      relationship: emergencyContact.relationship ?? '',
    },

    documents: {
      driverLicense: employeeProfile.driverLicenseDocKey
        ? {
            key: employeeProfile.driverLicenseDocKey,
            type: 'driver_license',
          }
        : null,
    },
  };
}

/**
 * Convert frontend initialProfile to backend employeeProfile payload
 * (for PUT / PATCH requests)
 */
export function mapInitialProfileToEmployeePayload(profile) {
  if (!profile) return null;

  const { name, address, contact, employment, emergency, documents } = profile;

  const isOtherVisa =
    employment?.visaTitle &&
    !['H1B', 'F1', 'OPT', 'CPT', 'GREEN_CARD', 'CITIZEN'].includes(employment.visaTitle);

  return {
    // -------- Basic Info --------
    firstName: name.firstName ?? '',
    middleName: name.middleName ?? '',
    lastName: name.lastName ?? '',
    preferredName: name.preferredName ?? '',
    ssn: name.ssn ?? '',
    gender: name.gender ?? '',

    dateOfBirth: name.dob ? new Date(name.dob).toISOString() : null,

    // -------- Contact --------
    cellPhone: contact.cellPhone ?? '',
    workPhone: contact.workPhone ?? '',

    // -------- Address --------
    address: {
      buildingApt: address.apt ?? '',
      street: address.street ?? '',
      city: address.city ?? '',
      state: address.state ?? '',
      zip: address.zip ?? '',
    },

    // -------- Employment / Visa --------
    workAuthorizationType: employment.visaTitle ?? '',

    otherWorkAuthorizationTitle: employment.visaTitle ?? '',

    workAuthorizationStart: employment.startDate
      ? new Date(employment.startDate).toISOString()
      : null,

    workAuthorizationEnd: employment.endDate ? new Date(employment.endDate).toISOString() : null,

    // -------- Emergency Contacts (array) --------
    emergencyContacts: emergency?.firstName
      ? [
          {
            firstName: emergency.firstName ?? '',
            middleName: emergency.middleName ?? '',
            lastName: emergency.lastName ?? '',
            phone: emergency.phone ?? '',
            email: emergency.email ?? '',
            relationship: emergency.relationship ?? '',
          },
        ]
      : [],

    // -------- Documents --------
    driverLicenseDocKey: documents?.driverLicense?.key ?? null,
  };
}
