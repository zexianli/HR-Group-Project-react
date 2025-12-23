function AddressContact({ prevNextHandler }) {
  prevNextHandler({
    onNext: () => {
      console.log('next from Address Contact');
      return true;
    },
    onPrev: () => {
      console.log('prev from Address Contact');
      return true;
    },
    onSubmit: () => {
      console.log('submit from Address Contact');
      return true;
    },
  });
  return (
    <>
      {/* Address info^: building number, street, city, state, zip */}
      {/* Phone number: cell phone^, work phone */}
    </>
  );
}

export default AddressContact;
