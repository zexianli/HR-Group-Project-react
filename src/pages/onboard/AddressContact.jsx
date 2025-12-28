// import FormControlLabel from '@mui/material/FormControlLabel';d
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import { Box, Select } from '@mui/material';
import { MenuItem } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';
import ReusableInputField from '../../components/form/ReusableInputField';
import { Controller } from 'react-hook-form';
import FormHelperText from '@mui/material/FormHelperText';

import { onboardingAddressContactSchema } from '../../utilities/zod';
import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import { useState, useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
// import { useDispatch } from 'react-redux';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

function AddressContact({ prevNextHandler }) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(onboardingAddressContactSchema),
    defaultValues: {
      cellPhone: '',
      workPhone: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      buildingApt: '',
      referenceExist: false,
      referenceFirstName: '',
      referenceLastName: '',
      referenceMiddleName: '',
      referencePhone: '',
      referenceEmail: '',
      referenceRelationship: '',
      emergencyContacts: [],
    },
  });

  const {
    fields: emergencyContactsField,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'emergencyContacts',
  });

  useEffect(() => {
    const savedAddressContactData = localStorage.getItem('addressContact');
    const savedHasReference = localStorage.getItem('referenceExist');
    if (savedAddressContactData) {
      const addressContactData = JSON.parse(savedAddressContactData);
      const hasReference = savedHasReference === 'true';
      reset({
        ...addressContactData,
        referenceExist: hasReference,
      });
    }
  }, []);

  prevNextHandler({
    onNext: async () => {
      // submit, get the form data and save it as it is
      let canGoNext = false;
      const submit = handleSubmit((data) => {
        let addressContactData;
        if (!data.referenceExist) {
          addressContactData = {
            cellPhone: data.cellPhone,
            workPhone: data.workPhone,
            street: data.street,
            city: data.city,
            state: data.state,
            zip: data.zip,
            buildingApt: data.buildingApt,
            emergencyContacts: data.emergencyContacts,
          };
        } else {
          addressContactData = {
            cellPhone: data.cellPhone,
            workPhone: data.workPhone,
            street: data.street,
            city: data.city,
            state: data.state,
            zip: data.zip,
            buildingApt: data.buildingApt,
            emergencyContacts: data.emergencyContacts,
            referenceFirstName: data.referenceFirstName,
            referenceLastName: data.referenceLastName,
            referenceMiddleName: data.referenceMiddleName,
            referencePhone: data.referencePhone,
            referenceEmail: data.referenceEmail,
            referenceRelationship: data.referenceRelationship,
          };
        }

        localStorage.setItem('addressContact', JSON.stringify(addressContactData));
        localStorage.setItem('referenceExist', data.referenceExist.toString());
        canGoNext = true;
      });
      await submit();
      return canGoNext;
    },
    onPrev: () => {
      // don't submit, just get the form data and save it as it is
      return true;
    },
  });

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const referenceExistValue = watch('referenceExist');
  const [emergencyContactId, setEmergencyContactId] = useState(0);

  function addEmergencyContact() {
    // add a value to the emergency contact
    const nextEmergencyContact = {
      id: emergencyContactId,
      firstName: '',
      lastName: '',
      middleName: '',
      phone: '',
      email: '',
      relationship: '',
    };

    append(nextEmergencyContact);

    setEmergencyContactId((prev) => prev + 1);
  }

  function handleDeleteEmergencyContact(index) {
    remove(index);
  }

  return (
    <>
      <form>
        <Grid container spacing={3}>
          {/* Current address (building/apt #, street name, city, state, zip) */}
          <ReusableInputField
            xs={12}
            md={6}
            id="cellPhone"
            label={'Cell phone'}
            placeholder="US Number, (XXX)-XXX-XXXX"
            error={!!errors.cellPhone}
            helperText={errors.cellPhone?.message}
            required
            {...register('cellPhone')}
          />
          <ReusableInputField
            xs={12}
            md={6}
            id="workPhone"
            label={'Work phone'}
            placeholder="US Number, (XXX)-XXX-XXXX"
            error={!!errors.workPhone}
            helperText={errors.workPhone?.message}
            {...register('workPhone')}
          />
          <ReusableInputField
            xs={12}
            md={6}
            id="street"
            label={'Street name'}
            placeholder="e.g, 67th Ave W"
            error={!!errors.street}
            helperText={errors.street?.message}
            required
            {...register('street')}
          />
          <ReusableInputField
            xs={12}
            md={6}
            id="buildingApt"
            label={'Building or Apt #'}
            placeholder="e.g, 12345, A-64"
            error={!!errors.buildingApt}
            helperText={errors.buildingApt?.message}
            {...register('buildingApt')}
          />
          <ReusableInputField
            xs={12}
            md={4}
            id="city"
            label={'City'}
            placeholder="e.g, Seattle"
            error={!!errors.city}
            helperText={errors.city?.message}
            required
            {...register('city')}
          />
          <ReusableInputField
            xs={12}
            md={4}
            id="state"
            label={'State'}
            placeholder="e.g, Washington, CA"
            error={!!errors.state}
            helperText={errors.state?.message}
            required
            {...register('state')}
          />
          <ReusableInputField
            xs={12}
            md={4}
            id="zip"
            label={'Zip'}
            placeholder="e.g, 98123"
            error={!!errors.zip}
            helperText={errors.zip?.message}
            required
            {...register('zip')}
          />
          {/* Reference (who referred you to this company? There can only be 1)
1. First name, last name, middle name, phone, email, relationship */}
          <FormGrid size={{ xs: 12 }}>
            <Controller
              name="referenceExist"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      name="reference-exist"
                      checked={field.value}
                      {...register('referenceExist')}
                    />
                  }
                  label="Someone referred me to this componany"
                />
              )}
            />
          </FormGrid>
          {referenceExistValue && (
            <>
              <ReusableInputField
                xs={12}
                md={4}
                id="referenceFirstName"
                label={'First Name'}
                placeholder="e.g, John"
                error={!!errors.referenceFirstName}
                helperText={errors.referenceFirstName?.message}
                required
                {...register('referenceFirstName')}
              />
              <ReusableInputField
                xs={12}
                md={4}
                id="referenceMiddleName"
                label={'Middle Name'}
                placeholder="e.g, White"
                error={!!errors.referenceMiddleName}
                helperText={errors.referenceMiddleName?.message}
                {...register('referenceMiddleName')}
              />
              <ReusableInputField
                xs={12}
                md={4}
                id="referenceLastName"
                label={'Last Name'}
                placeholder="e.g, White"
                error={!!errors.referenceLastName}
                helperText={errors.referenceLastName?.message}
                required
                {...register('referenceLastName')}
              />
              <ReusableInputField
                xs={12}
                md={6}
                id="referenceEmail"
                label={'Email'}
                placeholder="e.g, efg567@domain.com"
                error={!!errors.referenceEmail}
                helperText={errors.referenceEmail?.message}
                required
                {...register('referenceEmail')}
              />
              <ReusableInputField
                xs={12}
                md={6}
                id="referencePhone"
                label={'Phone'}
                placeholder="US Number, (XXX)-XXX-XXXX"
                error={!!errors.referencePhone}
                helperText={errors.referencePhone?.message}
                required
                {...register('referencePhone')}
              />
              <ReusableInputField
                xs={12}
                md={4}
                id="referenceRelationship"
                label={'Relationship'}
                placeholder="e.g, co-worker"
                error={!!errors.referenceRelationship}
                helperText={errors.referenceRelationship?.message}
                required
                {...register('referenceRelationship')}
              />
            </>
          )}
          <Divider sx={{ width: '100%' }} />
          {
            // code to map the form for each emergency contact
            emergencyContactsField.map(({ id }, index) => (
              <Grid container sx={{ position: 'relative' }} key={id}>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <h2>Emergency Contact</h2>
                  <DeleteIcon
                    sx={{ marginTop: '21px', cursor: 'pointer' }}
                    onClick={() => {
                      handleDeleteEmergencyContact(index);
                    }}
                  />
                </Box>
                <ReusableInputField
                  xs={12}
                  md={4}
                  id={`${id}-em-first-name`}
                  label={'First name'}
                  placeholder="e.g, John"
                  error={
                    !!errors.emergencyContacts && errors.emergencyContacts.length > index
                      ? !!errors.emergencyContacts[+index]?.firstName
                      : false
                  }
                  helperText={
                    !!errors.emergencyContacts && errors.emergencyContacts.length > index
                      ? errors.emergencyContacts[+index]?.firstName?.message
                      : ''
                  }
                  required
                  {...register(`emergencyContacts[${index}].firstName`)}
                />
                <ReusableInputField
                  xs={12}
                  md={4}
                  id={`${id}-em-middle-name`}
                  label={'Middle name'}
                  placeholder="e.g, White"
                  error={
                    !!errors.emergencyContacts && errors.emergencyContacts.length > index
                      ? !!errors.emergencyContacts[+index]?.middleName
                      : false
                  }
                  helperText={
                    !!errors.emergencyContacts && errors.emergencyContacts.length > index
                      ? errors.emergencyContacts[+index]?.middleName?.message
                      : ''
                  }
                  {...register(`emergencyContacts[${index}].middleName`)}
                />
                <ReusableInputField
                  xs={12}
                  md={4}
                  id={`${id}-em-last-name`}
                  label={'Last name'}
                  placeholder="e.g, Doe"
                  error={
                    !!errors.emergencyContacts && errors.emergencyContacts.length > index
                      ? !!errors.emergencyContacts[+index]?.lastName
                      : false
                  }
                  helperText={
                    !!errors.emergencyContacts && errors.emergencyContacts.length > index
                      ? errors.emergencyContacts[+index]?.lastName?.message
                      : ''
                  }
                  required
                  {...register(`emergencyContacts[${index}].lastName`)}
                />
                <ReusableInputField
                  xs={12}
                  md={6}
                  id={`${id}-em-phone`}
                  label={'Phone'}
                  placeholder="US Number (XXX)-XXX-XXXX"
                  error={
                    !!errors.emergencyContacts && errors.emergencyContacts.length > index
                      ? !!errors.emergencyContacts[+index]?.phone
                      : false
                  }
                  helperText={
                    !!errors.emergencyContacts && errors.emergencyContacts.length > index
                      ? errors.emergencyContacts[+index]?.phone?.message
                      : ''
                  }
                  required
                  {...register(`emergencyContacts[${index}].phone`)}
                />
                <ReusableInputField
                  xs={12}
                  md={6}
                  id={`${id}-em-email`}
                  label={'Email'}
                  placeholder="e.g, abc123@domain.com"
                  error={
                    !!errors.emergencyContacts && errors.emergencyContacts.length > index
                      ? !!errors.emergencyContacts[+index]?.email
                      : false
                  }
                  helperText={
                    !!errors.emergencyContacts && errors.emergencyContacts.length > index
                      ? errors.emergencyContacts[+index]?.email?.message
                      : ''
                  }
                  required
                  {...register(`emergencyContacts[${index}].email`)}
                />
                <ReusableInputField
                  xs={12}
                  md={4}
                  id={`${id}-em-relationship`}
                  label={'Relationship'}
                  placeholder="e.g, Siblings, Parents"
                  error={
                    !!errors.emergencyContacts && errors.emergencyContacts.length > index
                      ? !!errors.emergencyContacts[+index]?.relationship
                      : false
                  }
                  helperText={
                    !!errors.emergencyContacts && errors.emergencyContacts.length > index
                      ? errors.emergencyContacts[+index]?.relationship?.message
                      : ''
                  }
                  required
                  {...register(`emergencyContacts[${index}].relationship`)}
                />
              </Grid>
            ))
          }
          <FormGrid size={12}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{ width: 'fit-content' }}
              onClick={addEmergencyContact}
            >
              Add Emergency Contact
            </Button>
          </FormGrid>
          {!!errors.emergencyContacts && (
            <FormHelperText sx={{ color: '#d32f2f', paddingLeft: '14px', marginTop: '-20px' }}>
              {errors.emergencyContacts?.message}
            </FormHelperText>
          )}
          {/*  Emergency contact(s) (1+)
1. First name, last name, middle name, phone, email, relationship */}
        </Grid>
      </form>
    </>
  );
}

export default AddressContact;
