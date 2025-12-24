// import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { Select } from '@mui/material';
import { MenuItem } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';
import ReusableInputField from '../../components/form/ReusableInputField';

import { useState } from 'react';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
// import { useDispatch } from 'react-redux';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

// Zod validation schema
const onboardingPersonalInfoSchema = z
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
    // date of birth
    dateofbirth: z
      .any()
      .refine((val) => val, { message: 'Please enter your date of birth', path: ['dateofbirth'] }),
    ssn: z.string().regex(/^\d{9}$/, 'Must be exactly 9 digits'),
    gender: z.string().min(1, 'Please select a value'),
    hasDriverLicense: z.boolean(),
    driverLicenseCopy: z.any().nullable(),
    driverLicenseNumber: z.string().optional(),
    driverLicenseExpDate: z.any().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.hasDriverLicense) {
      if (!data.driverLicenseCopy) {
        ctx.addIssue({
          path: ['driverLicenseCopy'],
          message: 'Driver license copy is required',
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.driverLicenseNumber) {
        ctx.addIssue({
          path: ['driverLicenseNumber'],
          message: 'Driver license number is required',
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.driverLicenseExpDate) {
        ctx.addIssue({
          path: ['driverLicenseExpDate'],
          message: 'Driver license expiration date is required',
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

function PersonalInfo({ prevNextHandler }) {
  const {
    register,
    handleSubmit,
    // setError,
    // watch,
    // formState: { errors, isSubmitting },
    formState: { errors },
  } = useForm({
    resolver: zodResolver(onboardingPersonalInfoSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      middlename: '',
      dateofbirth: null,
      ssn: '',
      gender: '',
      hasDriverLicense: false,
      driverLicenseCopy: null,
      driverLicenseNumber: '',
      driverLicenseExpDate: null,
    },
  });

  prevNextHandler({
    onNext: () => {
      // console.log('ngentot');
      // check everything
      const submit = handleSubmit((data) => {
        console.log(data);
      });

      submit();

      // console.log('hello');
      return false;
    },
    onPrev: () => {
      console.log('prev from Personal Info');
      return true;
    },
    onSubmit: () => {
      console.log('submit from Personal Info');
      return true;
    },
  });

  // gender
  const [gender, setGender] = useState('');

  // profile picture
  const [profilePictureCopy, setProfilePictureCopy] = useState(null);
  const [profilePictureCopyName, setProfilePictureCopyName] = useState('');
  console.log(profilePictureCopy);

  // driver license
  const [hasDriverLicense, setHasDriverLicense] = useState(false);
  const [driverLicenseCopy, setDriverLicenseCopy] = useState(null);
  const [driverLicenseCopyName, setDriverLicenseCopyName] = useState('');
  console.log(driverLicenseCopy);

  const onSubmit = async (data) => {
    console.log(data);
    console.log('Hello World');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        {/* Name field: first name^, last name^, middle name, preferred name */}
        <ReusableInputField
          xs={12}
          md={6}
          id="firstname"
          label={'First name'}
          placeholder="e.g, John"
          error={!!errors.firstname}
          helperText={errors.firstname?.message}
          required
          {...register('firstname')}
        />
        <ReusableInputField
          xs={12}
          md={6}
          id="lastname"
          label={'Last name'}
          placeholder="e.g, Doe"
          error={!!errors.lastname}
          helperText={errors.lastname?.message}
          required
          {...register('lastname')}
        />
        <ReusableInputField
          xs={12}
          md={6}
          id="middlename"
          label={'Middle name'}
          placeholder="e.g, White"
          error={!!errors.middlename}
          helperText={errors.middlename?.message}
          {...register('middlename')}
        />
        <ReusableInputField
          xs={12}
          md={6}
          id="preferredname"
          label={'Preferred name'}
          placeholder="e.g, John"
          error={false}
        />
        {/* Email, will be passed on */}
        <ReusableInputField
          xs={12}
          md={6}
          id="email"
          label="Email"
          placeholder="e.g, jwhite@gmail.com"
          type="email"
          error={false}
          disabled
          required
        />
        {/* Date of birth^ */}
        <FormGrid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor="date-of-birth" required>
            Date of Birth
          </FormLabel>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateField
              id="dateofbirth"
              name="dateofbirth"
              size="small"
              onChange={(value) => {
                console.log(value);
              }}
              required
            />
          </LocalizationProvider>
        </FormGrid>
        {/* SSN^ */}
        <ReusableInputField
          xs={12}
          md={6}
          id="ssn"
          label="SSN"
          placeholder="(XXX)-XX-XXXX"
          error={!!errors.ssn}
          helperText={errors.ssn?.message}
          {...register('ssn')}
          required
        />
        {/* Gender: dropdown (male, female, I do not wish to answer) */}
        <FormGrid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor="gender" required>
            Gender
          </FormLabel>
          <Select
            id="gender"
            name="gender"
            value={gender}
            onChange={(e) => {
              setGender(e.target.value);
            }}
            displayEmpty
            size="small"
          >
            <MenuItem value="" disabled>
              Select gender
            </MenuItem>
            <MenuItem value={'Male'}>Male</MenuItem>
            <MenuItem value={'Female'}>Female</MenuItem>
            <MenuItem value={'No answer'}>I do not wish to answer</MenuItem>
          </Select>
        </FormGrid>
        {/* Profile Picture */}
        <FormGrid size={12}>
          <Button variant="contained" component="label" sx={{ width: 'fit-content' }}>
            Upload Profile Picture (.PNG, .JPG)
            <input
              type="file"
              hidden
              onChange={(e) => {
                setProfilePictureCopy(e.target.files[0]);
                setProfilePictureCopyName(e.target.files[0].name);
              }}
            />
          </Button>
          {profilePictureCopyName}
        </FormGrid>
        {/* Driver's license */}
        {/* Do you have a car, if yes show questions related to driver's license and car */}
        <FormGrid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Checkbox
                name="driver-license"
                checked={hasDriverLicense}
                onChange={(e) => {
                  setHasDriverLicense(e.target.checked);
                  setDriverLicenseCopy(null);
                  setDriverLicenseCopyName('');
                }}
              />
            }
            label="I have a driver's license"
          />
        </FormGrid>
        {hasDriverLicense && (
          <>
            {/* Driver license copy */}
            <FormGrid size={12}>
              <Button variant="contained" component="label" sx={{ width: 'fit-content' }}>
                Upload Driver License Copy (.PNG, .JPG)*
                <input
                  type="file"
                  hidden
                  onChange={(e) => {
                    setDriverLicenseCopy(e.target.files[0]);
                    setDriverLicenseCopyName(e.target.files[0].name);
                  }}
                />
              </Button>
              {driverLicenseCopyName}
            </FormGrid>
            {/* Driver's License Number, expiration date */}
            <ReusableInputField
              xs={12}
              md={6}
              id="dl-number"
              label="Driver license number"
              placeholder="e.g, ESL36278E65Y"
              error={!!errors.driverLicenseNumber}
              helperText={errors.driverLicenseNumber?.message}
              {...register('driverLicenseNumber')}
              required
            />
            <FormGrid size={{ xs: 12, md: 6 }}>
              <FormLabel htmlFor="dl-exp-date" required>
                Driver license expiration date
              </FormLabel>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateField id="dl-exp-date" name="dl-exp-date" size="small" required />
              </LocalizationProvider>
            </FormGrid>
            {/* Car information: make, model, color */}
            <ReusableInputField
              xs={12}
              md={4}
              id="car-make"
              label="Car make"
              placeholder="e.g, Ford"
            />
            <ReusableInputField
              xs={12}
              md={4}
              id="car-model"
              label="Car model"
              placeholder="e.g, Fusion Hybrid"
            />
            <ReusableInputField
              xs={12}
              md={4}
              id="car-color"
              label="Car color"
              placeholder="e.g, Silver"
            />
          </>
        )}
      </Grid>
    </form>
  );
}

export default PersonalInfo;
