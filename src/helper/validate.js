import toast from "react-hot-toast";
import { authenticate } from "./helper";

// validate login page username
export async function usernameValidate(values) {
    const errors = usernameVerify({}, values)

    if (values.username) {
        // check user exist or not 
        const { status } = await authenticate(values.username)

        if (status !== 200) {
            errors.exist = toast.error('User Doesn\'t Exist...!')
        }
    }

    return errors;
}

/* validate password */
export async function passwordValidate(values) {
    const errors = passwordVerify({}, values)

    return errors;
}

/** reset password  */
export async function resetPasswordValidation(values) {
    const errors = passwordVerify({}, values)

    if (values.password !== values.confirm_pwd) {
        errors.exist = toast.error("Password not match...!")
    }

    return errors;
}

/*** validate register form */

export async function registerValidation(values) {
    const errors = usernameVerify({}, values);
    passwordVerify(errors, values)
    emailverify(errors, values);

    return errors
}

/** Validate Email */

export async function profileValidation(values) {
    const errors = emailverify({}, values);

    return errors;
}

/********************************************* */

/* validate password */
function passwordVerify(errors = {}, values) {
    const specialChar = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/

    if (!values.password) {
        errors.password = toast.error("Passsword is Required...!")
    } else if (values.password.includes(" ")) {
        errors.password = toast.error("Wrong Passoword...!")
    } else if (values.password.length < 4) {
        errors.password = toast.error("Password must be more than 4 characters...!")
    } else if (!specialChar.test(values.password)) {
        errors.password = toast.error("Passsword must have special characters...!")
    }

    return errors;
}

// validate username
function usernameVerify(error = {}, values) {
    if (!values.username) {
        error.username = toast.error('Username Required...!')
    } else if (values.username.includes(" ")) {
        error.username = toast.error('Invalid User...!')
    }

    return error;
}


/** validate email  **/
function emailverify(error = {}, values) {

    const emailRegEx = /^[A-Z0-9._-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i

    if (!values.email) {
        error.email = toast.error("Email Requiered...!")
    } else if (values.email.includes(" ")) {
        error.email = toast.error("Wrong Email...!")
    } else if (!emailRegEx.test(values.email)) {
        error.email = toast.error("Invalid Email...!")
    }

    return error
}