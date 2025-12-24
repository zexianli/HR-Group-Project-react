import { z } from 'zod';

// Zod validation schema
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
