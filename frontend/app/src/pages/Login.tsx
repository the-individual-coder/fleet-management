
import { useEffect, useState , useRef } from "react"
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FadeLoader } from "react-spinners";
export const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [seePassword, setSeePassword] = useState(false)
  const [wrongCredentials, setWrongCredentials] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()
  const eye = useRef<HTMLInputElement>(null)
  const hostServer = import.meta.env.VITE_SERVER_HOST
  useEffect(()=>{
    authCheck()
  }, [])
  useEffect(()=>{
  
    const isRemembered = localStorage.getItem('rememberMe')
    const storedUsername = localStorage.getItem('username')
    if(isRemembered){
      console.log(storedUsername)
      if(storedUsername){
        setEmail(storedUsername)
        setRememberMe(JSON.parse(isRemembered))
      }


    }
  },[])
  useEffect(()=>{

      if(eye.current) {
        if(seePassword)   eye.current.type = 'text' 
        else eye.current.type = 'password'
      }

  }, [seePassword])

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
  const handleLogin = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      const result =  await axios.post(`${hostServer}/login`,
        {
        email:email,
        password:password
      })
      if(result.data.success){
        if(rememberMe){
          localStorage.setItem('rememberMe', JSON.stringify(rememberMe))
          localStorage.setItem('username', email)
        }else{
          localStorage.removeItem('rememberMe')
          localStorage.removeItem('username')
        }


        navigate("/")
      }
      if(result.data.message){
        setWrongCredentials(true)
        setTimeout(()=>{
          setWrongCredentials(false)
        },2000)
     
      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      setWrongCredentials(true)
      setTimeout(()=>{
        setWrongCredentials(false)
      },2000)
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
        Login
      </h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
        Don't have an account yet?
        <Link
          className="ml-1 text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
          to="/register"
        >
          Sign up here
        </Link>
      </p>
    </div>
    <div className="mt-5">
      {/* <button
        type="button"
        className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
      >
        <svg
          className="w-4 h-auto"
          width={46}
          height={47}
          viewBox="0 0 46 47"
          fill="none"
        >
          <path
            d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z"
            fill="#4285F4"
          />
          <path
            d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z"
            fill="#34A853"
          />
          <path
            d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z"
            fill="#FBBC05"
          />
          <path
            d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z"
            fill="#EB4335"
          />
        </svg>
        Login with Google
      </button> */}
      <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-neutral-500 dark:before:border-neutral-600 dark:after:border-neutral-600">
        Or
      </div>
      {/* Form */}
      <form onSubmit={(e)=>{handleLogin(e)}}>
        <div className="grid gap-y-4">
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
              onChange={(e)=>{setEmail(e.target.value)}}
              value={email}
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email address"
                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm"
                required
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
            <div className="flex justify-between items-center">
              <label
                htmlFor="password"
                className="block text-sm mb-2 dark:text-white"
              >
                Password
              </label>
              {/* <a
                className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
                href="../examples/html/recover-account.html"
              >
                Forgot password?
              </a> */}
            </div>
            <div className="relative">
            <div style={{cursor:"pointer"}}  className="z-100  absolute top-3 inset-y-0 end-0  pe-3">
              {seePassword? <svg onClick={()=>setSeePassword(false)} style={{cursor:"pointer"}} height={24} width={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 16.01C14.2091 16.01 16 14.2191 16 12.01C16 9.80087 14.2091 8.01001 12 8.01001C9.79086 8.01001 8 9.80087 8 12.01C8 14.2191 9.79086 16.01 12 16.01Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M2 11.98C8.09 1.31996 15.91 1.32996 22 11.98" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M22 12.01C15.91 22.67 8.09 22.66 2 12.01" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>:
              <svg onClick={()=>setSeePassword(true)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={24} height={24}>
              <g id="SVGRepo_bgCarrier" strokeWidth={0} />
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M14.83 9.17999C14.2706 8.61995 13.5576 8.23846 12.7813 8.08386C12.0049 7.92926 11.2002 8.00851 10.4689 8.31152C9.73758 8.61453 9.11264 9.12769 8.67316 9.78607C8.23367 10.4444 7.99938 11.2184 8 12.01C7.99916 13.0663 8.41619 14.08 9.16004 14.83"
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />{" "}
                <path
                  d="M12 16.01C13.0609 16.01 14.0783 15.5886 14.8284 14.8384C15.5786 14.0883 16 13.0709 16 12.01"
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />{" "}
                <path
                  d="M17.61 6.39004L6.38 17.62C4.6208 15.9966 3.14099 14.0944 2 11.99C6.71 3.76002 12.44 1.89004 17.61 6.39004Z"
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />{" "}
                <path
                  d="M20.9994 3L17.6094 6.39"
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />{" "}
                <path
                  d="M6.38 17.62L3 21"
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />{" "}
                <path
                  d="M19.5695 8.42999C20.4801 9.55186 21.2931 10.7496 21.9995 12.01C17.9995 19.01 13.2695 21.4 8.76953 19.23"
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />{" "}
              </g>
            </svg>
            }
              </div>
              <input
              ref={eye}
              placeholder="Enter your password"
               onChange={(e)=>{setPassword(e.target.value)}}
                type="password"
                id="password"
                name="password"
                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                required
                aria-describedby="password-error"
              />

            </div>
            {
              wrongCredentials && <>
                          <p className="text-xs text-red-600 mt-2" id="password-error">
              You may have entered the wrong email address or password.
            </p>
              </>
            }

          </div>
          {/* End Form Group */}
          {/* Checkbox */}
          <div className="flex items-center">
            <div className="flex">
              <input
              onChange={(e)=>{setRememberMe(e.target.checked)}}
              checked={rememberMe}
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
              />
            </div>
            <div className="ms-3">
              <label htmlFor="remember-me" className="text-sm dark:text-white">
                Remember me
              </label>
            </div>
          </div>
          {/* End Checkbox */}
          <button
            type="submit"
            className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
          >
            Login
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