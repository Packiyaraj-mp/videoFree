import {body} from 'express-validator';
import GlobalErrorClass from '../utils/GlobalError';

export const registerValidation=[
    body('name')
    .trim()
    .notEmpty().withMessage('User name is required')
    .isString().withMessage('Name should be in string format')
    .isLength({ min: 3 }).withMessage('Minimum 3 characters required')
    .matches(/^[A-Za-z ]+$/).withMessage('Name should contain only letters and spaces')
    .matches(/^\S(?:.*\S)?$/).withMessage('Name should not have leading or trailing spaces'),

    body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isString().withMessage('Email should be in string format')
    .isEmail().withMessage('Invalid email format'),

     body('password')
    .notEmpty().withMessage('Password is required')
    .trim()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/^\S*$/).withMessage('Password should not contain spaces')
    .matches(/[A-Z]/).withMessage('At least one uppercase letter is required')
    .matches(/[a-z]/).withMessage('At least one lowercase letter is required')
    .matches(/\d/).withMessage('At least one digit is required')
    .matches(/[@$!%*?&]/).withMessage('At least one special character is required'),

   // Confirm Password Validation
     body('confirmPassword')
    .notEmpty().withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new GlobalErrorClass('Passwords do not match', 500);
      }
      return true;
    })
    
];

export const loginValidation=[
 
  body('email')
  .trim()
  .notEmpty().withMessage('Email is required')
  .isString().withMessage('Email should be in string format')
  .isEmail().withMessage('Invalid email format'),

   body('password')
  .notEmpty().withMessage('Password is required')
  .trim()
  .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  .matches(/^\S*$/).withMessage('Password should not contain spaces')
  .matches(/[A-Z]/).withMessage('At least one uppercase letter is required')
  .matches(/[a-z]/).withMessage('At least one lowercase letter is required')
  .matches(/\d/).withMessage('At least one digit is required')
  .matches(/[@$!%*?&]/).withMessage('At least one special character is required'),

];
export const resetPasswordValidation=[
  body('email')
  .trim()
  .notEmpty().withMessage('Email is required')
  .isString().withMessage('Email should be in string format')
  .isEmail().withMessage('Invalid email format'),

   body('password')
  .notEmpty().withMessage('Password is required')
  .trim()
  .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  .matches(/^\S*$/).withMessage('Password should not contain spaces')
  .matches(/[A-Z]/).withMessage('At least one uppercase letter is required')
  .matches(/[a-z]/).withMessage('At least one lowercase letter is required')
  .matches(/\d/).withMessage('At least one digit is required')
  .matches(/[@$!%*?&]/).withMessage('At least one special character is required'),

 // Confirm Password Validation
   body('confirmPassword')
  .notEmpty().withMessage('Confirm password is required')
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new GlobalErrorClass('Passwords do not match', 500);
    }
    return true;
  }),

  // token validation
  body('token')
  .notEmpty().withMessage('token is required')
  .isString().withMessage('token should be string')
]

export const resetEmailCodeVerifyValidation=[
  body('email')
  .trim()
  .notEmpty().withMessage('Email is required')
  .isString().withMessage('Email should be in string format')
  .isEmail().withMessage('Invalid email format'),
  body('code')
  .trim()
  .notEmpty().withMessage('code is required')
  .isString().withMessage('code should be string')
  
];

export const resetPasswordReqValidation=[
  body('email')
  .trim()
  .notEmpty().withMessage('Email is required')
  .isString().withMessage('Email should be in string format')
  .isEmail().withMessage('Invalid email format'),
 
];



