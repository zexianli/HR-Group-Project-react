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

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  submitOnboarding,
  uploadFile,
  uploadOPTFile,
} from '../../features/onboarding/onboardingAPI';
import { retrieveFile } from '../../utilities/fileParser';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../../features/auth/authSlice';
// import { useDispatch } from 'react-redux';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

function WorkAuth({ prevNextHandler, handleCheckUser }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token, role } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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
      otherWorkAuthVisaTitle: '',
      workAuthStartDate: null,
      workAuthEndDate: null,
    },
  });

  prevNextHandler({
    onNext: () => {
      console.log('next from Work Auth');
      return true;
    },
    onPrev: () => {
      handleCheckUser();
      return true;
    },
    onSubmit: async () => {
      handleCheckUser();
      // compile PersonalInfo and AddressContact into one along with WorkAuth
      let canSubmit = false;
      const submit = handleSubmit(async (data) => {
        const savedPersonalInformationData = localStorage.getItem('personalInformation');
        const savedAddressContactData = localStorage.getItem('addressContact');
        if (savedPersonalInformationData && savedAddressContactData) {
          const personalInformation = JSON.parse(savedPersonalInformationData);
          const addressContact = JSON.parse(savedAddressContactData);
          const { ...personalInformationRest } = personalInformation;
          const {
            buildingApt,
            state,
            city,
            zip,
            street,
            referenceFirstName,
            referenceLastName,
            referenceMiddleName,
            referencePhone,
            referenceEmail,
            referenceRelationship,
            emergencyContacts,
            ...addressContactRest
          } = addressContact;

          const reformedPersonalInformation = {
            ...personalInformationRest,
            ssn:
              personalInformation.ssn.slice(0, 3) +
              '-' +
              personalInformation.ssn.slice(3, 5) +
              '-' +
              personalInformation.ssn.slice(5),
          };
          const reformedAddressContact = {
            ...addressContactRest,
            reference: {
              firstName: referenceFirstName,
              lastName: referenceLastName,
              middleName: referenceMiddleName,
              phone: referencePhone,
              email: referenceEmail,
              relationship: referenceRelationship,
            },
            address: {
              buildingApt,
              state,
              city,
              zip,
              street,
            },
            emergencyContacts: emergencyContacts.map(({ id, ...rest }) => {
              console.log(id);
              return rest;
            }),
          };
          // console.log('personal info', reformedPersonalInformation);
          // console.log('address contact', addressContact);
          // console.log('work auth', data);
          const workAuth = {
            ...data,
            workAuthEndDate:
              data.workAuthEndDate && data.workAuthEndDate.toDate().toISOString().slice(0, 10),
            workAuthStartDate:
              data.workAuthStartDate && data.workAuthStartDate.toDate().toISOString().slice(0, 10),
          };
          const {
            notUSPersonWorkAuth,
            usPersonStatus,
            otherWorkAuthVisaTitle,
            workAuthEndDate,
            workAuthStartDate,
            notUSPersonWorkAuthDoc,
            usPersonDoc,
            isUSPerson,
            ...workAuthRest
          } = workAuth;
          console.log(isUSPerson);
          const newNotUSPersonWorkAuth =
            notUSPersonWorkAuth === 'F1(CPT/OPT)'
              ? 'F1_CPT_OPT'
              : notUSPersonWorkAuth.toUpperCase();
          const newUSPersonStatus =
            usPersonStatus === 'Permanent Resident' ? 'GREEN_CARD' : usPersonStatus.toUpperCase();
          const workAuthorizationType = newNotUSPersonWorkAuth || newUSPersonStatus;

          // call the API to submit onboard
          // navigate to a page for
          try {
            // make sure the token is valid
            // if not, go to login
            // // call the submitOnboarding API

            // const token = localStorage.getItem('token');

            const profilePicture = retrieveFile('profilePicture');
            const driverLicenseCopy = retrieveFile('driverLicenseCopy');

            if (profilePicture) {
              // personal picture file upload
              const ppFormData = new FormData();
              ppFormData.append('docType', 'profile_picture');
              ppFormData.append('file', profilePicture);

              const postPPResponse = await uploadFile(ppFormData, token);
              console.log('upload profile picture', postPPResponse);
            }

            if (driverLicenseCopy) {
              // driver license file upload
              const dlFormData = new FormData();
              dlFormData.append('docType', 'driver_license');
              dlFormData.append('file', driverLicenseCopy);

              const postDLResponse = await uploadFile(dlFormData, token);
              console.log('upload driver license', postDLResponse);
            }

            if (notUSPersonWorkAuthDoc || usPersonDoc) {
              // wrok auth file upload
              const waFormData = new FormData();
              const workAuthType =
                workAuthorizationType === 'F1_CPT_OPT'
                  ? 'opt_receipt'
                  : workAuthorizationType.toLowerCase();
              waFormData.append('docType', workAuthType);
              waFormData.append('file', notUSPersonWorkAuthDoc || usPersonDoc);

              // console.log(workAuthType);
              // console.log(notUSPersonWorkAuthDoc || usPersonDoc);
              const postWAResponse =
                workAuthType === 'opt_receipt'
                  ? await uploadOPTFile(waFormData, token)
                  : await uploadFile(waFormData, token);

              console.log('upload work auth', postWAResponse);
            }

            const onboardingData = {
              ...reformedPersonalInformation,
              ...reformedAddressContact,
              ...workAuthRest,
              gender: personalInformation.gender.toUpperCase(),
              workAuthorizationType,
              otherWorkAuthorizationTitle: otherWorkAuthVisaTitle,
              workAuthorizationStart: workAuthStartDate,
              workAuthorizationEnd: workAuthEndDate,
            };

            console.log(onboardingData);
            const submitOnboardingResponse = await submitOnboarding(onboardingData, token);
            console.log('submit onboarding', submitOnboardingResponse);
            user.onboardingStatus = 'PENDING';
            dispatch(setCredentials({ user, token, role }));
            // remove every onboarding related things from the local storage
            localStorage.removeItem('personalInformation');
            localStorage.removeItem('profilePicture');
            localStorage.removeItem('profilePicturename');
            localStorage.removeItem('driverLicenseExist');
            localStorage.removeItem('driverLicenseCopy');
            localStorage.removeItem('driverLicenseCopyname');
            localStorage.removeItem('addressContact');
            localStorage.removeItem('referenceExist');
            // navigate to onboard pending
            navigate('/onboarding/finish', { state: { fromOnboarding: true }, replace: true });
          } catch (error) {
            // token expired, need to login again
            if (
              error.response.data.message === 'Invalid or expired token' &&
              error.response.status === 401
            ) {
              navigate('/login', { replace: true });
            }
          }
        }
        // else {
        //   // tell them personal info and address contact has issues (this might be becaus ethe user malformed things in local storage)
        // }

        canSubmit = true;
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

  function handleChangeIsUSPerson(e) {
    // resetting things in no opt, when saying yes
    const value = e.target.value;

    setValue('isUSPerson', value, { shouldValidate: true });

    if (value === 'yes') {
      setValue('notUSPersonWorkAuth', '');
      clearErrors('notUSPersonWorkAuth');
      setValue('notUSPersonWorkAuthDoc', null);
      clearErrors('notUSPersonWorkAuthDoc');
      setValue('otherWorkAuthVisaTitle', '');
      clearErrors('otherWorkAuthVisaTitle');
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
                    onChange={(e) => {
                      const value = e.target.value;
                      setValue('usPersonStatus', value);
                      clearErrors('usPersonStatus');

                      setValue('usPersonDoc', null);
                      clearErrors('usPersonDoc');
                    }}
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
                labelContent={`Upload ${usPersonStatus} Document (.PDF, .JPG, .PNG)`}
                handleUploadingFile={handleUploadingFile}
                accept="image/png,image/jpeg,image/jpg,application/pdf"
                file={usPersonDoc}
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
                    <MenuItem value="H1B">H1B</MenuItem>
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
            {notUSPersonWorkAuth === 'H1B' && (
              <>
                {/* upload document of H1B */}
                <ReusableFileInput
                  labelContent={`Upload Your H1B Document (.PDF)`}
                  handleUploadingFile={handleUploadingFile}
                  accept="application/pdf"
                  file={notUSPersonWorkAuthDoc}
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
                  labelContent={`Upload Your L2 Document (.PDF)`}
                  handleUploadingFile={handleUploadingFile}
                  accept="application/pdf"
                  file={notUSPersonWorkAuthDoc}
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
                  labelContent={`Upload Your F1(CPT/OPT) Receipt (.PDF)`}
                  handleUploadingFile={handleUploadingFile}
                  accept="application/pdf"
                  file={notUSPersonWorkAuthDoc}
                  fileVarName="notUSPersonWorkAuthDoc"
                  fileName={notUSPersonWorkAuthDoc && notUSPersonWorkAuthDoc.name}
                  error={errors.notUSPersonWorkAuthDoc}
                  required
                />
              </>
            )}
            {notUSPersonWorkAuth === 'H4' && (
              <>
                {/* upload document of H4 */}
                <ReusableFileInput
                  labelContent={`Upload Your H4 Document (.PDF)`}
                  handleUploadingFile={handleUploadingFile}
                  accept="application/pdf"
                  file={notUSPersonWorkAuthDoc}
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
                  labelContent={`Upload Your Visa Document(.PDF)`}
                  handleUploadingFile={handleUploadingFile}
                  accept="application/pdf"
                  file={notUSPersonWorkAuthDoc}
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
                    End Date
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
