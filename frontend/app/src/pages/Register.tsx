import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FadeLoader } from "react-spinners";

export const RegisterPage = () => {
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
   const [rePassword, setRePassword] = useState('')
   const hostServer = import.meta.env.VITE_SERVER_HOST
  const [wrongCredentials, setWrongCredentials] = useState(false)
  const navigate = useNavigate()
  useEffect(()=>{
    authCheck()
  }, [])
  const authCheck = async () => {
    try {
      const res = (await axios.get(`${hostServer}/alreadyauthenticated`)).data
      if(res.auth){
        navigate("/")
      }
    } catch (error) {
      console.log(error)
    }

  }
  const handleRegister = async (e:any) => {
    setIsLoading(true)
    e.preventDefault()
    try {
      if(rePassword !== password){
        setWrongCredentials(true)
        setTimeout(()=>{
          setWrongCredentials(false)
        },3000)
      }else{
          await axios.post(`${hostServer}/register`,
          {
          email:email,
          username:username,
          password:password
        })
        navigate("/login")
      }

      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }

          
    }
   

    return(
<>
{isLoading &&
      <>
        <div className="loader z-[101] h-lvh w-lvw fixed flex items-center justify-center opacity-50">
          <FadeLoader color="#2563eb" />
        </div>
      <div className='h-lvh w-lvw z-[100] opacity-50 fixed top-0 bg-neutral-600'></div>
      </>
      }
<div className="login grid place-content-center h-lvh">
    <div className="login-container sm:w-96 sm:h-[35rem]">

    <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
  <div className="p-4 sm:p-7">
    <div className="text-center">
      <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
        Sign up
      </h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
        Already have an account?
        <Link
          className="ml-1 text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
          to="/login"
        >
          Sign in here
        </Link>
      </p>
    </div>
    <div className="mt-5">
      <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-neutral-500 dark:before:border-neutral-600 dark:after:border-neutral-600">
        Or
      </div>
      {/* Form */}
      <form onSubmit={(e)=>{handleRegister(e)}}>
        <div className="grid gap-y-4">
        <div>
            <label
              htmlFor="email"
              className="block text-sm mb-2 dark:text-white"
            >
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                id="email"
                name="email"
                placeholder="Enter your username"
                onChange={(e)=>{setUsername(e.target.value)}}
                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                required
                aria-describedby="email-error"
              />
              <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                <svg
                  className="size-5 text-red-500"
                  width={16}
                  height={16}
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                </svg>
              </div>
            </div>
            <p className="hidden text-xs text-red-600 mt-2" id="email-error">
              Please include a valid email address so we can get back to you
            </p>
          </div>
          {/* Form Group */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm mb-2 dark:text-white"
            >
              Email address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                onChange={(e)=>{setEmail(e.target.value)}}
                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                required
                aria-describedby="email-error"
              />
              <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                <svg
                  className="size-5 text-red-500"
                  width={16}
                  height={16}
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                </svg>
              </div>
            </div>
            <p className="hidden text-xs text-red-600 mt-2" id="email-error">
              Please include a valid email address so we can get back to you
            </p>
          </div>
          {/* End Form Group */}
          {/* Form Group */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm mb-2 dark:text-white"
            >
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                onChange={(e)=>{setPassword(e.target.value)}}
                name="password"
                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                required
                aria-describedby="password-error"
              />
              <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                <svg
                  className="size-5 text-red-500"
                  width={16}
                  height={16}
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                </svg>
              </div>
            </div>
            <p className="hidden text-xs text-red-600 mt-2" id="password-error">
              8+ characters required
            </p>
          </div>
          {/* End Form Group */}
          {/* Form Group */}
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm mb-2 dark:text-white"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                onChange={(e)=>{setRePassword(e.target.value)}}
                id="confirm-password"
                name="confirm-password"
                placeholder="Re-Enter your password"
                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                required
                aria-describedby="confirm-password-error"
              />
              <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                <svg
                  className="size-5 text-red-500"
                  width={16}
                  height={16}
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                </svg>
              </div>
            </div>

            {
              wrongCredentials && <>
                          <p
              className=" text-xs text-red-600 mt-2"
              id="confirm-password-error"
            >
              Please make sure that the passwords are matched!
            </p>
              </>
            }

          </div>
          {/* End Form Group */}
          {/* Checkbox */}

          {/* End Checkbox */}
          <button
            type="submit"
            className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
          >
            Sign up
          </button>
        </div>
      </form>
      {/* End Form */}
    </div>
  </div>
</div>

    </div>
</div>


</>
    )

}