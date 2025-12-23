function WorkAuth({ prevNextHandler }) {
  prevNextHandler({
    onNext: () => {
      console.log('next from Work Auth');
      return true;
    },
    onPrev: () => {
      console.log('prev from Work Auth');
      return true;
    },
    onSubmit: () => {
      console.log('submit from Work Auth');
      return true;
    },
  });
  return (
    <>
      {/* Work auth dropdown: (choices TBD) */}
      {/* Fill upload(s) for work auth documents */}
    </>
  );
}

export default WorkAuth;
