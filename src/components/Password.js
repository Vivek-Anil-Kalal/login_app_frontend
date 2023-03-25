import React from 'react'
import { Link , useNavigate } from 'react-router-dom'
import { profile } from '../assets'
import styles from '../styles/Username.module.css'
import toast , { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { passwordValidate } from '../helper/validate'
import { useAuthStore } from '../store/store.js'
import { verifyPassword } from '../helper/helper'
import useFetch from '../hooks/fetch.hook'

const Password = () => {

  const navigate = useNavigate();
  const { username } = useAuthStore(state => state.auth)
  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`)

  const formik = useFormik({
    initialValues: {
      password: ''
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {

      let loginPromise = verifyPassword({ username, password: values.password })

      toast.promise(loginPromise,{
        loading : 'Checking...',
        success : <b>Login Successfully...</b>,
        error : <b>Password not Match...</b>
      })

      loginPromise.then(res => {
        let {token} = res.data ;
        localStorage.setItem('token', token);
        
        navigate('/profile');
      })
    }
  })

  if (isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>
  if (serverError) return <h1 className='text-xl font-bold text-red-500'>{serverError.message}</h1>

  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder="false"></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Hello {apiData?.firstName || apiData?.username}</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-5">
              Explore More by connecting with us.
            </span>
          </div>

          <form onSubmit={formik.handleSubmit} className="py-1">
            <div className="profile flex justify-center py-4">
              <img src={apiData?.profile || profile} className={styles.profile_img} alt="avatar" />
            </div>

            <div className="textbox flex flex-col items-center gap-3">
              <input {...formik.getFieldProps('password')} className={styles.textbox} type="password" name="password" placeholder='Password' />
              <button className={`${styles.btn} bg-green-600 drop-shadow-xl`} type="submit">Let's Go</button>
            </div>

            <div className="text-center py-4">
              {/* Link is better than using a (anchor tag) because anchor tag reloads the browser when the request made */}
              <span className=''>Forgort Password <Link to="/recovery" className="text-red-500">Recover Now</Link></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Password