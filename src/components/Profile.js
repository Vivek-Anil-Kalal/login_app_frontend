import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { profile } from '../assets'
import styles from '../styles/Username.module.css'
import { toast, Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { profileValidation } from '../helper/validate'
import convertToBase64 from '../helper/convert'
import extend from '../styles/Profile.module.css'
import useFetch from '../hooks/fetch.hook'
import { updateUser } from '../helper/helper'
import { BallTriangle } from 'react-loader-spinner'

const Profile = () => {

  const navigate = useNavigate();
  const [file, setFile] = useState()
  const [{ isLoading, apiData, serverError }] = useFetch()

  const formik = useFormik({
    initialValues: {
      firstName: apiData?.firstName || '',
      lastName: apiData?.lastName || '',
      email: apiData?.email || '',
      mobile: apiData?.mobile || '',
      address: apiData?.address || ''
    },
    enableReinitialize: true,
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      values = await Object.assign(values, { profile: file || apiData?.profile || '' })
      let updatePromise = updateUser(values);

      toast.promise(updatePromise, {
        loading: 'Updating Profile...',
        success: <b>Profile Updated Successfully...</b>,
        error: <b>Couldn't Update the Profile...</b>
      })
      // console.log(values);
    }
  })


  /*** formik doesn't support the file upload so we need to create this handler */

  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0])
    setFile(base64);
  }

  // user logout handler function
  function logoutUser() {
    localStorage.removeItem('token')
    navigate('/')
  }

  if (isLoading) return (
    <div className='flex justify-center items-center h-screen'>

      <BallTriangle
        height={100}
        width={100}
        radius={5}
        color="#4fa94d"
        ariaLabel="ball-triangle-loading"
        wrapperClass={{}}
        wrapperStyle=""
        visible={true}
      />
    </div>
  )
  if (serverError) return <h1 className='text-xl font-bold text-red-500'>{serverError.message}</h1>

  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder="false"></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={`${styles.glass} ${extend.glass} `} style={{ width: "45%", paddingTop: "3em" }}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Profile</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-5">
              You Can Update the Details.
            </span>
          </div>

          <form onSubmit={formik.handleSubmit} className="py-1">
            <div className="profile flex justify-center py-4">

              <label htmlFor="profile">
                <img src={apiData?.profile || file || profile} className={`${styles.profile_img} ${extend.profile_img}`} alt="avatar" />
              </label>
              <input onChange={onUpload} type="file" name='profile' id="profile" />

            </div>

            <div className="textbox flex flex-col items-center gap-6">

              <div className="name flex sm:w-3/4 w-[450px] sm:ml-0 ml-[120px] sm:flex-row flex-col gap-10">
                <input {...formik.getFieldProps('firstName')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='FirstName' />
                <input {...formik.getFieldProps('lastName')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='LastName' />
              </div>

              <div className="name flex sm:w-3/4 w-[450px] sm:ml-0 ml-[120px] sm:flex-row flex-col gap-10">
                <input {...formik.getFieldProps('mobile')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='Mobile No.' />
                <input {...formik.getFieldProps('email')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='Email*' />
              </div>

              <div className='w-[450px] sm:ml-0 ml-[120px]'>
                <input {...formik.getFieldProps('address')} className={`${styles.textbox} ${extend.textbox} w-[350px]`} type="text" placeholder='Address' />
              </div>
              <div className=' w-[450px] sm:ml-0 ml-[120px]'>
                <button className={`${styles.btn}`} type='submit'>Update</button>
              </div>

            </div>

            <div className="text-center py-4">
              {/* Link is better than using a (anchor tag) because anchor tag reloads the browser when the request made */}
              <span className=''>Come Back Later? <Link to="/" onClick={logoutUser} className="text-red-500">Logout</Link></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile