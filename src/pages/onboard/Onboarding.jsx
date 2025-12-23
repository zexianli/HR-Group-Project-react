import OuterLayout from '../../components/onboard/OuterLayout';
import PersonalInfo from './PersonalInfo';
import AddressContact from './AddressContact';
import WorkAuth from './WorkAuth';
import { Box } from '@mui/material';
import { useState } from 'react';

function Onboarding() {
  // a stepper
  // there will be four pages
  // first page -> HP-33
  // second page -> HP-34
  // third page -> HP-35
  // fourth page -> confirming page
  const pages = [
    { name: 'Personal Information', ui: <PersonalInfo /> },
    { name: 'Address and Contact', ui: <AddressContact /> },
    { name: 'Work Authorization', ui: <WorkAuth /> },
  ];

  // states
  const [currPageIndex, setCurrPageIndex] = useState(0);

  // functions
  function handleNext() {
    setCurrPageIndex((prev) => prev + 1);
  }

  function handlePrev() {
    setCurrPageIndex((prev) => prev - 1);
  }

  return (
    <>
      <OuterLayout
        pagesName={pages.map(({ name }) => name)}
        handleNext={handleNext}
        handlePrev={handlePrev}
        currPageIndex={currPageIndex}
      >
        {/* This is the code for rendering things  */}
        <Box
          sx={{
            flex: '1',
            overflow: 'auto',
            backgroundColor: 'white',
            border: 'solid 1px #abcdcf',
            borderRadius: '10px',
            padding: '30px',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) ',
          }}
        >
          {pages[currPageIndex].ui}
        </Box>
      </OuterLayout>
    </>
  );
}

export default Onboarding;
