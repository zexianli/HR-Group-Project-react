// import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { Select } from '@mui/material';
import { MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import ReusableInputField from '../../components/form/ReusableInputField';

import { useState } from 'react';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

function PersonalInfo() {
  const [gender, setGender] = useState('');

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
      {/* Driver's license */}
      {/* Do you have a car, if yes show questions related to driver's license and car */}
      {/* Car information: make, model, color */}
      <FormGrid size={{ xs: 12, md: 4 }}>
        <FormLabel htmlFor="car-make">Car make</FormLabel>
        <OutlinedInput
          id="car-make"
          name="car-make"
          type="text"
          placeholder="e.g, Ford"
          size="small"
        />
      </FormGrid>
      <FormGrid size={{ xs: 12, md: 4 }}>
        <FormLabel htmlFor="car-model">Car model</FormLabel>
        <OutlinedInput
          id="car-model"
          name="car-model"
          type="text"
          placeholder="e.g, Fusion Hybrid"
          size="small"
        />
      </FormGrid>
      <FormGrid size={{ xs: 12, md: 4 }}>
        <FormLabel htmlFor="car-color">Car color</FormLabel>
        <OutlinedInput
          id="car-color"
          name="car-color"
          type="text"
          placeholder="e.g, Silver"
          size="small"
        />
      </FormGrid>
    </Grid>
  );
}

export default PersonalInfo;
