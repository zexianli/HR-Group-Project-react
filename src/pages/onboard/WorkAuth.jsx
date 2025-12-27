// import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { Select } from '@mui/material';
import { MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import ReusableInputField from '../../components/form/ReusableInputField';
import { Controller } from 'react-hook-form';
import FormHelperText from '@mui/material/FormHelperText';
import { onboardingWorkAuthSchema } from '../../utilities/zod';
// import { storeFile, retrieveFile } from '../../utilities/fileParser';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import ReusableFileInput from '../../components/form/ReusableFileInput';

import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
// import { useDispatch } from 'react-redux';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

function WorkAuth({ prevNextHandler }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    // reset,
    control,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(onboardingWorkAuthSchema),
    defaultValues: {
      isUSPerson: '',
      usPersonStatus: '',
      usPersonDoc: null,
      notUSPersonWorkAuth: '',
      notUSPersonWorkAuthDoc: null,
      optReceipt: null,
      otherWorkAuthVisaTitle: '',
      workAuthStartDate: null,
      workAuthEndDate: null,
    },
  });

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  prevNextHandler({
    onNext: () => {
      return true;
    },
    onPrev: () => {
      return true;
    },
    onSubmit: async () => {
      // compile PersonalInfo and AddressContact into one along with WorkAuth
      let canSubmit = false;
      const submit = handleSubmit((data) => {
        canSubmit = true;
        console.log(data);
      });
      await submit();
      return canSubmit;
    },
  });

  const isUSPerson = watch('isUSPerson');
  // us person
  const usPersonDoc = watch('usPersonDoc');
  const usPersonStatus = watch('usPersonStatus');
  // work auth
  const notUSPersonWorkAuth = watch('notUSPersonWorkAuth');
  const notUSPersonWorkAuthDoc = watch('notUSPersonWorkAuthDoc');
  // opt receipt
  const optReceipt = watch('optReceipt');

  function handleChangeIsUSPerson(e) {
    // resetting things in no opt, when saying yes
    const value = e.target.value;

    setValue('isUSPerson', value, { shouldValidate: true });

    if (value === 'yes') {
      setValue('notUSPersonWorkAuth', '');
      clearErrors('notUSPersonWorkAuth');
      setValue('notUSPersonWorkAuthDoc', null);
      setValue('optReceipt', null);
      setValue('otherWorkAuthVisaTitle', '');
    }

    if (value === 'no') {
      setValue('usPersonStatus', '');
      clearErrors('usPersonStatus');
      setValue('usPersonDoc', null);
      clearErrors('usPersonDoc');
    }
  }

  function handleUploadingFile(e, formValueName) {
    const file = e.target.files?.[0] || null;
    setValue(formValueName, file, { shouldValidate: true });
  }

  function handleChangeWorkAuth(e) {
    // resetting things in no opt, when saying yes
    const value = e.target.value;

    setValue('notUSPersonWorkAuth', value, { shouldValidate: true });
    setValue('notUSPersonWorkAuthDoc', null);
    clearErrors('notUSPersonWorkAuthDoc');
    setValue('workAuthStartDate', null);
    clearErrors('workAuthStartDate');
    setValue('workAuthEndDate', null);
    clearErrors('workAuthEndDate');

    if (value === 'F1(CPT/OPT)') {
      setValue('optReceipt', null);
      clearErrors('optReceipt');
    }

    if (value === 'Other') {
      setValue('otherWorkAuthVisaTitle', '');
      clearErrors('otherWorkAuthVisaTitle');
    }
  }

  return (
    <form>
      <Grid container spacing={3}>
        <FormGrid size={12}>
          <FormControl>
            <FormLabel id="us-person" htmlFor="us-person" error={!!errors.isUSPerson} required>
              Are you a considered a US person (citizen or permanent resident of the US)?
            </FormLabel>
            <Controller
              name="isUSPerson"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  sx={{ marginTop: '-5px' }}
                  {...field}
                  aria-labelledby="us-person"
                  name="us-person"
                  onChange={handleChangeIsUSPerson}
                >
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              )}
            />

            {!!errors.isUSPerson && (
              <FormHelperText sx={{ color: '#d32f2f' }}>
                {errors.isUSPerson?.message}
              </FormHelperText>
            )}
          </FormControl>
        </FormGrid>
        {/* if us person */}
        {isUSPerson === 'yes' && (
          <>
            <FormGrid size={{ xs: 12, md: 6 }}>
              <FormLabel htmlFor="us-person-status" required>
                What is your status as a US person?
              </FormLabel>
              <Controller
                name="usPersonStatus"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    displayEmpty
                    name="us-person-status"
                    defaultValue=""
                    error={!!errors.usPersonStatus}
                    size="small"
                  >
                    <MenuItem value="" disabled>
                      Select status
                    </MenuItem>
                    <MenuItem value="Permanent Resident">Permanent Resident</MenuItem>
                    <MenuItem value="Citizen">Citizen</MenuItem>
                  </Select>
                )}
              />
              {!!errors.usPersonStatus && (
                <FormHelperText sx={{ color: '#d32f2f', paddingLeft: '14px' }}>
                  {errors.usPersonStatus?.message}
                </FormHelperText>
              )}
            </FormGrid>
            {usPersonStatus && (
              <ReusableFileInput
                labelContent={`Upload ${usPersonStatus} Document`}
                handleUploadingFile={handleUploadingFile}
                fileVarName="usPersonDoc"
                fileName={usPersonDoc && usPersonDoc.name}
                error={errors.usPersonDoc}
                required
              />
            )}
          </>
        )}
        {/* if not us person */}
        {isUSPerson === 'no' && (
          <>
            <FormGrid size={{ xs: 12, md: 6 }}>
              <FormLabel htmlFor="not-us-person-work-auth" required>
                What is your work authorization?
              </FormLabel>
              <Controller
                name="notUSPersonWorkAuth"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    displayEmpty
                    name="not-us-person-work-auth"
                    defaultValue=""
                    error={!!errors.notUSPersonWorkAuth}
                    size="small"
                    onChange={handleChangeWorkAuth}
                  >
                    <MenuItem value="" disabled>
                      Select work authorization
                    </MenuItem>
                    <MenuItem value="H1-B">H1-B</MenuItem>
                    <MenuItem value="L2">L2</MenuItem>
                    <MenuItem value="F1(CPT/OPT)">F1(CPT/OPT)</MenuItem>
                    <MenuItem value="H4">H4</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                )}
              />
              {!!errors.notUSPersonWorkAuth && (
                <FormHelperText sx={{ color: '#d32f2f', paddingLeft: '14px' }}>
                  {errors.notUSPersonWorkAuth?.message}
                </FormHelperText>
              )}
            </FormGrid>
            {notUSPersonWorkAuth === 'H1-B' && (
              <>
                {/* upload document of H1-B */}
                <ReusableFileInput
                  labelContent={`Upload Your H1-B Document`}
                  handleUploadingFile={handleUploadingFile}
                  fileVarName="notUSPersonWorkAuthDoc"
                  fileName={notUSPersonWorkAuthDoc && notUSPersonWorkAuthDoc.name}
                  error={errors.notUSPersonWorkAuthDoc}
                  required
                />
              </>
            )}
            {notUSPersonWorkAuth === 'L2' && (
              <>
                {/* upload document of L2 */}
                <ReusableFileInput
                  labelContent={`Upload Your L2 Document`}
                  handleUploadingFile={handleUploadingFile}
                  fileVarName="notUSPersonWorkAuthDoc"
                  fileName={notUSPersonWorkAuthDoc && notUSPersonWorkAuthDoc.name}
                  error={errors.notUSPersonWorkAuthDoc}
                  required
                />
              </>
            )}
            {notUSPersonWorkAuth === 'F1(CPT/OPT)' && (
              <>
                {/* upload document of F1(CPT/OPT) */}
                <ReusableFileInput
                  labelContent={`Upload Your F1(CPT/OPT) Document`}
                  handleUploadingFile={handleUploadingFile}
                  fileVarName="notUSPersonWorkAuthDoc"
                  fileName={notUSPersonWorkAuthDoc && notUSPersonWorkAuthDoc.name}
                  error={errors.notUSPersonWorkAuthDoc}
                  required
                />
                {/* upload receipt */}
                <ReusableFileInput
                  labelContent={`Upload Your F1(CPT/OPT) receipt`}
                  handleUploadingFile={handleUploadingFile}
                  fileVarName="optReceipt"
                  fileName={optReceipt && optReceipt.name}
                  error={errors.optReceipt}
                  required
                />
              </>
            )}
            {notUSPersonWorkAuth === 'H4' && (
              <>
                {/* upload document of H1-B */}
                <ReusableFileInput
                  labelContent={`Upload Your H4 Document`}
                  handleUploadingFile={handleUploadingFile}
                  fileVarName="notUSPersonWorkAuthDoc"
                  fileName={notUSPersonWorkAuthDoc && notUSPersonWorkAuthDoc.name}
                  error={errors.notUSPersonWorkAuthDoc}
                  required
                />
              </>
            )}
            {notUSPersonWorkAuth === 'Other' && (
              <>
                {/* ask the Visa name */}
                <FormGrid size={12}>
                  <ReusableInputField
                    xs={12}
                    md={6}
                    id="other-work-visa-title"
                    label="Visa Title"
                    placeholder="e.g, J-1, K-1"
                    required
                    error={!!errors.otherWorkAuthVisaTitle}
                    helperText={errors.otherWorkAuthVisaTitle?.message}
                    {...register('otherWorkAuthVisaTitle')}
                  />
                </FormGrid>
                {/* upload document of the Visa */}
                <ReusableFileInput
                  labelContent={`Upload Your H4 Document`}
                  handleUploadingFile={handleUploadingFile}
                  fileVarName="notUSPersonWorkAuthDoc"
                  fileName={notUSPersonWorkAuthDoc && notUSPersonWorkAuthDoc.name}
                  error={errors.notUSPersonWorkAuthDoc}
                  required
                />
              </>
            )}
            {notUSPersonWorkAuth && (
              <>
                {/* start date */}
                <FormGrid size={{ xs: 12, md: 6 }}>
                  <FormLabel htmlFor="workAuthStartDate" required>
                    Start Date
                  </FormLabel>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Controller
                      control={control}
                      name="workAuthStartDate"
                      render={({ field }) => (
                        <DateField
                          {...field} // RHF provides value & onChange
                          id="workAuthStartDate"
                          error={!!errors.workAuthStartDate}
                          helperText={errors.workAuthStartDate?.message}
                          size="small"
                        />
                      )}
                    />
                  </LocalizationProvider>
                </FormGrid>
                {/* end date */}
                <FormGrid size={{ xs: 12, md: 6 }}>
                  <FormLabel htmlFor="workAuthEndDate" required>
                    Date of Birth
                  </FormLabel>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Controller
                      control={control}
                      name="workAuthEndDate"
                      render={({ field }) => (
                        <DateField
                          {...field} // RHF provides value & onChange
                          id="workAuthEndDate"
                          error={!!errors.workAuthEndDate}
                          helperText={errors.workAuthEndDate?.message}
                          size="small"
                        />
                      )}
                    />
                  </LocalizationProvider>
                </FormGrid>
              </>
            )}
          </>
        )}
      </Grid>
    </form>
  );
}

export default WorkAuth;
