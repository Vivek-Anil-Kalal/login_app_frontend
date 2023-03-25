import React, { useEffect, useState } from 'react'
import styles from '../styles/Username.module.css'
import { toast, Toaster } from 'react-hot-toast'
import { useAuthStore } from '../store/store'
import { generateOTP, verifyOTP } from '../helper/helper'
import { useNavigate } from 'react-router-dom'

const Recovery = () => {

  const navigate = useNavigate();
  const { username } = useAuthStore(state => state.auth)
  const [OTP, setOTP] = useState();

  // we are calling generate otp in useEffect because this page loads it will send the OTP to the user email address
  useEffect(() => {

    // first go to ethreal and then creat your testing mail and enter email and password to .env file
    generateOTP(username).then((OTP) => {
      console.log(OTP);
      if (OTP) return toast.success("OTP has been sent to your Email...")
      toast.error("Problem while generating OTP!")
    })
  }, [username])

  async function onSubmit(e) {
    e.preventDefault();

    try {
      let { status } = await verifyOTP({ username, code: OTP })
      if (status === 201) {
        toast.success("Verified Successfully...")
        navigate('/reset')
      }
    } catch (error) {
      toast.error("Wrong OTP! Check email again...!")
    }

  }

  // handler function of resending OTP
  function resendOTP() {
    let sendPromise = generateOTP(username);

    toast.promise(sendPromise, {
      loading: 'Sending OTP',
      success: <b>OTP Sent Successfully</b>,
      error: <b>Couldn't Send the OTP!</b>
    })

    sendPromise.then((OTP) => {
      console.log(OTP);
    })
  }

  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder="false"></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Recovery</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-5">
              Enter OTP to recover password.
            </span>
          </div>

          <form className="pt-20" onSubmit={onSubmit}>
            <div className="profile flex justify-center py-4">
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <div className="input text-center">
                <span className='py-4 text-sm text-left'>
                  Enter 6 digit OTP sent to your email address.
                </span>

                <input onChange={(e) => setOTP(e.target.value)} className={styles.textbox} type="number" name="OTP" placeholder='Enter OTP' />
              </div>
              <button className={`${styles.btn} bg-green-600 drop-shadow-xl`} type="submit">Recover</button>
            </div>

          </form>
          <div className="text-center py-4">
            <span>Can't get OTP? <button onClick={resendOTP} className="text-red-500">Resend</button></span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Recovery