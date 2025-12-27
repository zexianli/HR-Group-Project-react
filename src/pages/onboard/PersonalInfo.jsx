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
import { Controller } from 'react-hook-form';
import FormHelperText from '@mui/material/FormHelperText';
import dayjs from 'dayjs';
import { onboardingPersonalInfoSchema } from '../../utilities/zod';
import { storeFile, retrieveFile } from '../../utilities/fileParser';

import { useState, useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
// import { useDispatch } from 'react-redux';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

function PersonalInfo({ prevNextHandler }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(onboardingPersonalInfoSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      middlename: '',
      preferredname: '',
      email: 'abcd123@gmail.com', // get the default value from URL
      dateofbirth: null,
      ssn: '',
      gender: '',
      profilePicture: null,
      driverLicenseExist: false,
      driverLicenseCopy: null,
      driverLicenseNumber: '',
      driverLicenseExpDate: null,
      carmake: '',
      carmodel: '',
      carcolor: '',
    },
  });

  useEffect(() => {
    // get the data from local storage
    const savedPersonalInformationData = localStorage.getItem('personalInformation');
    const savedHasDriverLicense = localStorage.getItem('driverLicenseExist');

    // put the data into the form
    if (savedPersonalInformationData) {
      const personalInformationData = JSON.parse(savedPersonalInformationData);
      const hasDriverLicense = savedHasDriverLicense === 'true';
      const profilePicture = retrieveFile('profilePicture');
      if (profilePicture) {
        setProfilePictureCopyName(localStorage.getItem('profilePicturename'));
      }

      if (hasDriverLicense) {
        const driverLicenseCopy = retrieveFile('driverLicenseCopy');
        // populate form with driver license
        reset({
          firstname: personalInformationData.firstName,
          lastname: personalInformationData.lastName,
          middlename: personalInformationData.middleName,
          preferredname: personalInformationData.preferredName,
          ssn: personalInformationData.ssn,
          gender: personalInformationData.gender,
          email: personalInformationData.email,
          dateofbirth: dayjs(personalInformationData.dateOfBirth),
          profilePicture: profilePicture,
          driverLicenseExist: true,
          driverLicenseCopy: driverLicenseCopy,
          driverLicenseNumber: personalInformationData.driverLicense.number,
          driverLicenseExpDate: dayjs(personalInformationData.driverLicense.expirationDate),
          carmake: personalInformationData.carInformation.make,
          carmodel: personalInformationData.carInformation.model,
          carcolor: personalInformationData.carInformation.color,
        });
        setDriverLicenseCopyName(localStorage.getItem('driverLicenseCopyname'));
      } else {
        // populate form without driver license
        reset({
          firstname: personalInformationData.firstName,
          lastname: personalInformationData.lastName,
          middlename: personalInformationData.middleName,
          preferredname: personalInformationData.preferredName,
          ssn: personalInformationData.ssn,
          gender: personalInformationData.gender,
          email: personalInformationData.email,
          dateofbirth: dayjs(personalInformationData.dateOfBirth),
          profilePicture: profilePicture,
          driverLicenseCopy: null,
        });
      }
    }
    // set it as useForm default values
  }, []);

  // profile picture name
  const [profilePictureCopyName, setProfilePictureCopyName] = useState('');

  // driver license name
  const driverLicenseExist = watch('driverLicenseExist');
  const [driverLicenseCopyName, setDriverLicenseCopyName] = useState('');

  prevNextHandler({
    onNext: async () => {
      let canGoNext = false;
      const submit = handleSubmit(async (data) => {
        // store things in local storage
        let personalInfoData;
        if (!data.driverLicenseExist) {
          // personal info without license
          personalInfoData = {
            firstName: data.firstname,
            lastName: data.lastname,
            middleName: data.middlename,
            preferredName: data.preferredname,
            ssn: data.ssn,
            dateOfBirth: data.dateofbirth.toDate().toISOString(),
            gender: data.gender,
            email: data.email,
          };
          storeFile('profilePicture', data.profilePicture, profilePictureCopyName);
          localStorage.removeItem('driverLicenseCopy');
          localStorage.removeItem('driverLicenseCopyname');
        } else {
          // personal info with license
          personalInfoData = {
            firstName: data.firstname,
            lastName: data.lastname,
            middleName: data.middlename,
            preferredName: data.preferredname,
            ssn: data.ssn,
            dateOfBirth: data.dateofbirth.toDate().toISOString(),
            gender: data.gender,
            email: data.email,
            driverLicense: {
              number: data.driverLicenseNumber,
              expirationDate: data.driverLicenseExpDate, // process this to be a Date() object
            },
            carInformation: {
              make: data.carmake,
              model: data.carmodel,
              color: data.carcolor,
            },
          };
          storeFile('profilePicture', data.profilePicture, profilePictureCopyName);
          storeFile('driverLicenseCopy', data.driverLicenseCopy, driverLicenseCopyName);
        }

        localStorage.setItem('personalInformation', JSON.stringify(personalInfoData));
        localStorage.setItem('driverLicenseExist', data.driverLicenseExist.toString());

        canGoNext = true;
      });
      await submit();
      return canGoNext;
    },
    onPrev: () => {
      return true;
    },
    onSubmit: () => {
      return true;
    },
  });

  return (
    <form>
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
          {...register('preferredname')}
        />
        {/* Email, will be passed on */}
        <ReusableInputField
          xs={12}
          md={6}
          id="email"
          label="Email"
          placeholder="e.g, jwhite@gmail.com"
          value="abcd1234@gmail.com"
          type="email"
          error={false}
          disabled
          required
          {...register('email')}
        />
        {/* Date of birth^ */}
        <FormGrid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor="dateofbirth" required>
            Date of Birth
          </FormLabel>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              control={control}
              name="dateofbirth"
              render={({ field }) => (
                <DateField
                  {...field} // RHF provides value & onChange
                  id="dateofbirth"
                  error={!!errors.dateofbirth}
                  helperText={
                    errors.dateofbirth?.dateofbirth?.message ||
                    errors.dateofbirth?.[0]?.message ||
                    ''
                  }
                  size="small"
                />
              )}
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
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select {...field} displayEmpty error={!!errors.gender} size="small">
                <MenuItem value="" disabled>
                  Select gender
                </MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="I do not wish to answer">I do not wish to answer</MenuItem>
              </Select>
            )}
          />
          {!!errors.gender && (
            <FormHelperText sx={{ color: '#d32f2f', paddingLeft: '14px' }}>
              {errors.gender?.message}
            </FormHelperText>
          )}
        </FormGrid>
        {/* Profile Picture */}
        <FormGrid size={12}>
          <Button variant="contained" component="label" sx={{ width: 'fit-content' }}>
            Upload Profile Picture (.PNG, .JPG)
            <input
              type="file"
              hidden
              accept="image/png,image/jpeg,image/jpg"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setValue('profilePicture', file, { shouldValidate: true });
                setProfilePictureCopyName(e.target.files[0].name);
              }}
            />
          </Button>
          {profilePictureCopyName}
        </FormGrid>
        {/* Driver's license */}
        {/* Do you have a car, if yes show questions related to driver's license and car */}
        <FormGrid size={{ xs: 12 }}>
          <Controller
            name="driverLicenseExist"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    name="driver-license"
                    checked={field.value}
                    {...register('driverLicenseExist')}
                  />
                }
                label="I have a driver's license"
              />
            )}
          />
        </FormGrid>
        {driverLicenseExist && (
          <>
            {/* Driver license copy */}
            <FormGrid size={12}>
              <Button variant="contained" component="label" sx={{ width: 'fit-content' }}>
                Upload Driver License Copy (.PNG, .JPG)*
                <input
                  {...register('driverLicenseCopy')}
                  type="file"
                  hidden
                  onChange={(e) => {
                    setDriverLicenseCopyName(e.target.files[0].name);
                    setValue('driverLicenseCopy', e.target.files[0], {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                />
              </Button>
              {!!errors.driverLicenseCopy && (
                <FormHelperText sx={{ color: '#d32f2f', paddingLeft: '14px' }}>
                  {errors.driverLicenseCopy?.message}
                </FormHelperText>
              )}
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
            {/* Driver license exp date */}
            <FormGrid size={{ xs: 12, md: 6 }}>
              <FormLabel htmlFor="driverLicenseExpDate" required>
                Driver license expiration date
              </FormLabel>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  control={control}
                  name="driverLicenseExpDate"
                  render={({ field }) => (
                    <DateField
                      {...field} // RHF provides value & onChange
                      id="driverLicenseExpDate"
                      error={!!errors.driverLicenseExpDate}
                      helperText={errors.driverLicenseExpDate?.message}
                      size="small"
                    />
                  )}
                />
              </LocalizationProvider>
            </FormGrid>
            {/* Car information: make, model, color */}
            <ReusableInputField
              xs={12}
              md={4}
              id="car-make"
              label="Car make"
              placeholder="e.g, Ford"
              {...register('carmake')}
            />
            <ReusableInputField
              xs={12}
              md={4}
              id="car-model"
              label="Car model"
              placeholder="e.g, Fusion Hybrid"
              {...register('carmodel')}
            />
            <ReusableInputField
              xs={12}
              md={4}
              id="car-color"
              label="Car color"
              placeholder="e.g, Silver"
              {...register('carcolor')}
            />
          </>
        )}
      </Grid>
    </form>
  );
}

export default PersonalInfo;
