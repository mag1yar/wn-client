import * as yup from 'yup';

export const LoginFormSchema = yup.object().shape({
  email: yup.string().email('Неверный формат почты').required('Поле не должно быть пустым'),
  password: yup.string().required('Поле не должно быть пустым'),
});

export const SignUpFormSchema = yup.object().shape({
  login: yup
    .string()
    .min(3, 'Логин должен содержать минимум 3 символа')
    .required('Поле не должно быть пустым'),
  email: yup.string().email('Неверный формат почты!').required('Поле не должно быть пустым'),
  password: yup.string().min(8).required('Поле не должно быть пустым'),
  passwordConfirmation: yup.string().oneOf([yup.ref('password'), null], 'Пароли не совпадают'),
});
