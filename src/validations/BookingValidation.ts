import * as Yup from 'yup';

const validationSchema = (availableSlots:any) => Yup.object().shape({
  numberOfSlots: Yup.number()
    .required('Number of slots is required')
    .positive('Number of slots must be positive')
    .integer('Number of slots must be an integer')
    .max(availableSlots, `Number of slots must be less than or equal to ${availableSlots}`), // Add this line
  checkInDate: Yup.date()
    .required('Check-in date is required')
    .min(new Date(), 'Check-in date must be in the future'),
  checkOutDate: Yup.date()
    .required('Check-out date is required')
    .min(Yup.ref('checkInDate'), 'Check-out date must be after check-in date'),
});

export default validationSchema;
