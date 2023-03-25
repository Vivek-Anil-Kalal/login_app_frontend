import axios from 'axios'
import jwt_decode from 'jwt-decode'

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN

/** to get username from token */
export async function getUsername() {
    let token = localStorage.getItem('token')

    if (!token) return Promise.reject("Cannot find token!")
    let decode = jwt_decode(token)
    // console.log(decode);
    return decode;
}

/** Make API Request  */
export async function authenticate(username) {
    try {

        return await axios.post('/api/authenticate', { username })
    } catch (error) {
        return {
            error: "Username doesn't exist...!"
        }
    }
}

/** get user details */
export async function getUser({ username }) {
    try {
        const { data } = await axios.get(`/api/user/${username}`)

        return { data };
    } catch (error) {
        return { error: "Password Doesn't Match...!" }
    }
}

/** get user details */
export async function registerUser(credential) {
    try {
        const { data: { msg }, status } = await axios.post(`/api/register`, credential)

        const { username, email } = credential;

        /** send mail */
        if (status === 201) {
            await axios.post('/api/registerMail', { username, userEmail: email, text: msg })
        }

        return Promise.resolve(msg);

    } catch (error) {
        return Promise.reject({ error })
    }
}

/** Login Function */
export async function verifyPassword({ username, password }) {
    try {
        if (username) {
            const { data } = await axios.post('/api/login', { username, password })

            return Promise.resolve({ data });
        }
    } catch (error) {
        return Promise.reject({ error: "Password Dosen't match..." })
    }
}

/** update user profile function */
export async function updateUser(response) {
    try {

        const token = await localStorage.getItem('token')
        const data = await axios.put('/api/updateuser', response, { headers: { "Authorization": `Bearer ${token}` } })

        return Promise.resolve({ data })
    } catch (error) {
        return Promise.reject({ error: "Coudln't Update Profile..." })
    }
}

/** generate OTP */
export async function generateOTP(username) {
    try {

        const { data: { code }, status } = await axios.get('/api/generateOTP', { params: { username } })
        console.log("Here");
        // send mail with OTP
        if (status === 201) {
            // this will collect email from user
            let { data: { email } } = await getUser({ username });
            let text = `Your Password Recovery OTP is ${code}. Verify and recover Password`;

            // and this will send mail to user
            await axios.post('/api/registerMail', { username, userEmail: email, text, subject: "Password Recovery OTP" })
        }

        return Promise.resolve(code)
    } catch (error) {
        return Promise.reject({ error: "Problem in Generating OTP Please Resend it.." })
    }

    // try {
    //     console.log(username);
    //     const { data: { code }, status } = await axios.get('/api/generateOTP', { params: { username } });

    //     // send mail with the OTP
    //     if (status === 201) {
    //         let { data: { email } } = await getUser({ username });
    //         let text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`;
    //         await axios.post('/api/registerMail', { username, userEmail: email, text, subject: "Password Recovery OTP" })
    //     }
    //     return Promise.resolve(code);
    // } catch (error) {
    //     return Promise.reject({ error });
    // }
}

/** Verify OTP */
export async function verifyOTP({ username, code }) {
    try {
        const { data, status } = await axios.get('/api/verifyOTP', { params: { username, code } })

        return { data, status };
    } catch (error) {
        // DIFFERENT
        return Promise.resolve({ error: "Couldn't Verify OTP" })
    }
}

/**reset Password */
export async function resetPassword({ username, password }) {
    try {
        const { data, status } = await axios.put('/api/resetPassword', { username, password })
        return Promise.resolve({ data, status });
    } catch (error) {
        return Promise.reject({ error: "Password Can't be Reset...! Please Try Again..." })
    }
}