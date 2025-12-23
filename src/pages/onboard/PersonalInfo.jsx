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

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

function PersonalInfo({ prevNextHandler }) {
  prevNextHandler({
    onNext: () => {
      console.log('next from Personal Info');
      return true;
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

  return (
    <Grid container spacing={3}>
      {/* Name field: first name^, last name^, middle name, preferred name */}
      <ReusableInputField
        xs={12}
        md={6}
        id="first-name"
        label={'First name'}
        placeholder="e.g, John"
        required
      />
      <ReusableInputField
        xs={12}
        md={6}
        id="last-name"
        label={'Last name'}
        placeholder="e.g, Doe"
        required
      />
      <ReusableInputField
        xs={12}
        md={6}
        id="middle-name"
        label={'Middle name'}
        placeholder="e.g, White"
      />
      <ReusableInputField
        xs={12}
        md={6}
        id="preferred-name"
        label={'Preferred name'}
        placeholder="e.g, John"
      />
      {/* Profile picture */}
      {/* Email */}
      <ReusableInputField
        xs={12}
        md={6}
        id="email"
        label="Email"
        placeholder="e.g, jwhite@gmail.com"
        type="email"
        required
      />
      {/* Date of birth^*/}
      <FormGrid size={{ xs: 12, md: 6 }}>
        <FormLabel htmlFor="date-of-birth" required>
          Date of Birth
        </FormLabel>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateField id="date-of-birth" name="date-of-birth" size="small" required />
        </LocalizationProvider>
      </FormGrid>
      {/* SSN^ */}
      <ReusableInputField
        xs={12}
        md={6}
        id="ssn"
        label="SSN"
        placeholder="(XXX)-XX-XXXX"
        required
      />
      {/* Gender: dropdown (male, female, I do not wish to answer) */}
      <FormGrid size={{ xs: 12, md: 6 }}>
        <FormLabel htmlFor="gender" required>
          Gender
        </FormLabel>
        <Select
          //   labelId="gender"
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
              console.log('hello');
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
  );
}

export default PersonalInfo;
