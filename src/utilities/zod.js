import { z } from 'zod';

// Zod validation schema for personal info, onboarding
export const onboardingPersonalInfoSchema = z
  .object({
    firstname: z
      .string()
      .min(3, 'First name must be at least 3 characters long')
      .max(12, 'First name can be at most 12 characters long')
      .regex(/^[A-Za-z]+$/, 'Only letters allowed'),
    lastname: z
      .string()
      .min(3, 'Last name must be at least 3 characters long')
      .max(12, 'Last name can be at most 12 characters long')
      .regex(/^[A-Za-z]+$/, 'Only letters allowed'),
    middlename: z.union([
      z.literal(''),
      z
        .string()
        .min(3, 'Middle name must be at least 3 characters long')
        .max(12, 'Middle name can be at most 12 characters long')
        .regex(/^[A-Za-z]+$/, 'Only letters allowed'),
    ]),
    preferredname: z.string().optional(),
    email: z.string().optional(),
    // date of birth
    dateofbirth: z.any().refine((val) => val !== null, {
      message: 'Please enter your date of birth',
      path: ['dateofbirth'],
    }),
    ssn: z.string().regex(/^\d{9}$/, 'Must be exactly 9 digits'),
    gender: z.string().min(1, 'Please select a value'),
    profilePicture: z
      .instanceof(File)
      .optional()
      .nullable()
      .refine((file) => !file || file.size <= 5 * 1024 * 1024, 'File must be less than 5MB')
      .refine(
        (file) => !file || ['image/png', 'image/jpeg'].includes(file.type),
        'Only PNG and JPG allowed'
      ),
    driverLicenseExist: z.boolean(),
    driverLicenseCopy: z.any().nullable(),
    driverLicenseNumber: z.string().optional(),
    driverLicenseExpDate: z.any().nullable(),
    carmake: z.string().optional(),
    carcolor: z.string().optional(),
    carmodel: z.string().optional(),
  })
  .refine(
    (data) => {
      return !data.driverLicenseExist || data.driverLicenseCopy;
    },
    {
      message: 'Upload your driver license copy',
      path: ['driverLicenseCopy'],
    }
  )
  .refine(
    (data) => {
      if (!data.driverLicenseExist || /^[A-Z0-9]+$/.test(data.driverLicenseNumber)) {
        return true;
      }
      return false;
    },
    {
      message: 'Enter your driver license number with the right format',
      path: ['driverLicenseNumber'],
    }
  )
  .refine((data) => !data.driverLicenseExist || data.driverLicenseExpDate, {
    message: 'Enter your driver license expiration date',
    path: ['driverLicenseExpDate'],
  });

// Zod validation schema for address contact, onboarding
export const onboardingAddressContactSchema = z
  .object({
    // cell phone number
    cellPhone: z.string().regex(/^\d{10}$/, 'Required and must be exactly 10 digits'),
    // work phone number
    workPhone: z.union([z.literal(''), z.string().regex(/^\d{10}$/, 'Must be exactly 10 digits')]),
    street: z
      .string()
      .min(3, 'Enter street name with minimum of 3 characters long')
      .max(20, 'Street name can be at most 20 characters long')
      .regex(/^[A-Za-z0-9 ]+$/, 'Only letters and digits allowed'),
    city: z
      .string()
      .min(3, 'Enter city with minimum of 3 characters')
      .max(12, 'City can be at most 12 characters long')
      .regex(/^[A-Za-z]+$/, 'Only letters allowed'),
    state: z
      .string()
      .min(1, 'Enter state with minimum of 2 characters')
      .max(12, 'State can be at most 12 characters long')
      .regex(/^[A-Za-z]+$/, 'Only letters allowed'),
    zip: z.string().regex(/^\d{5}$/, 'Must be exactly 5 digits'),
    buildingApt: z.string().refine((val) => val === '' || /^[A-Z0-9/-]+$/.test(val), {
      message: 'Only uppercase letters, numbers, - or / allowed',
    }),
    referenceExist: z.boolean(),
    referenceFirstName: z.string(),
    referenceLastName: z.string(),
    referenceMiddleName: z.string(),
    referencePhone: z.string(),
    referenceEmail: z.string(),
    referenceRelationship: z.string(),
    // emergency contact
    emergencyContacts: z
      .array(
        z.object({
          id: z.number(),
          firstName: z
            .string()
            .min(1, 'First name is required')
            .max(12, 'First name can be at most 12 characters long')
            .regex(/^[A-Za-z]+$/, 'Only letters allowed'),
          lastName: z
            .string()
            .min(1, 'Last name is required')
            .max(12, 'First name can be at most 12 characters long')
            .regex(/^[A-Za-z]+$/, 'Only letters allowed'),
          middleName: z.string().optional(), // optional
          phone: z.string().regex(/^\d{10}$/, 'Required and must be exactly 10 digits'),
          email: z
            .string()
            .min(1, 'Email is required')
            .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email format invalid (e.g., abc123@gmail.com)'),
          relationship: z.string().min(1, 'Relationship is required'),
        })
      )
      .min(1, 'Emergency Contact(s) is required'),
  })
  .superRefine((data, ctx) => {
    if (data.referenceExist) {
      if (!data.referenceFirstName || data.referenceFirstName.trim() === '') {
        ctx.addIssue({
          path: ['referenceFirstName'],
          message: "Enter Reference's first name",
        });
      } else if (!/^[A-Za-z]+$/.test(data.referenceFirstName.trim())) {
        ctx.addIssue({
          path: ['referenceFirstName'],
          message: 'Only letters allowed',
        });
      }

      if (!data.referenceLastName || data.referenceLastName.trim() === '') {
        ctx.addIssue({
          path: ['referenceLastName'],
          message: "Enter Reference's last name",
        });
      } else if (!/^[A-Za-z]+$/.test(data.referenceLastName.trim())) {
        ctx.addIssue({
          path: ['referenceLastName'],
          message: 'Only letters allowed',
        });
      }

      if (!data.referencePhone || !/^\d{10}$/.test(data.referencePhone)) {
        ctx.addIssue({
          path: ['referencePhone'],
          message: 'Required and must be exactly 10 digits',
        });
      }

      if (!data.referenceEmail || data.referenceEmail.trim() === '') {
        ctx.addIssue({
          path: ['referenceEmail'],
          message: "Enter Reference's email",
        });
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.referenceEmail.trim())) {
        ctx.addIssue({
          path: ['referenceEmail'],
          message: 'Email format invalid (e.g., abcd1234@domain.com)',
        });
      }

      if (!data.referenceRelationship || data.referenceRelationship.trim() === '') {
        ctx.addIssue({
          path: ['referenceRelationship'],
          message: 'Enter your relationship with the reference',
        });
      } else if (!/^[A-Za-z-]+$/.test(data.referenceLastName.trim())) {
        ctx.addIssue({
          path: ['referenceRelationship'],
          message: 'Only letters allowed',
        });
      }
    }
  });
