import axios from "axios"
import { useEffect, useState } from "react"
import { OutletContextType, users } from "../layouts/MainLayout"
import { useNavigate, useOutletContext } from "react-router-dom"
import React from "react"

export const EditUsers = () => {
  const { setIsLoading } = useOutletContext<OutletContextType>()
  const hostServer = import.meta.env.VITE_SERVER_HOST
  const [devices, setDevices] = useState<users[]>([])
  const [deviceID, setDeviceID] = useState(0)
  const [deviceName, setDeviceName] = useState("")
  const [deviceStatus, setDeviceStatus] = useState('')
  const [deviceRole, setDeviceRole] = useState('')
  const role = [{label:"Super Admin", value:"1"},{label:"Admin", value:"2"}, {label:"Staff", value:"3"}]
  const navigate = useNavigate()
  useEffect(() => {
    getDevicesData()

  }, [])
  const selectedData = (id: number) => {
    if (devices.length === 0) {
      console.log("No devices available");
      return;
    }
  
    const selectedDevice = devices.find((device) => device.user_id === id);
  
    if (selectedDevice) {
      console.log(selectedDevice);
      // You can also extract the name or any other property if needed
      const name = selectedDevice.username || ""; // Assuming the device has a 'name' property
      setDeviceID(selectedDevice.user_id)
      setDeviceName(name)
      setDeviceStatus(selectedDevice.email)
      setDeviceRole(selectedDevice.role)
    } else {
      console.log(`Device with ID ${id} not found`);
    }
  };
  const getDevicesData = async () => {
    try {
      setIsLoading(true)
      const res = (await axios.get(`${hostServer}/getUsers`)).data
      setDevices(res)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }

  }
  const handleUpdate = async (e: any) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${hostServer}/updateUser`, {
        username: deviceName,
        email:deviceStatus,
        userID: deviceID,
        role:deviceRole
      })
      console.log(res)
      alert("Updated Successfully!")
      navigate("/users/view")
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <>
        {/* Card Section */}
        <div className="w-full px-4 py-10 sm:px-6 lg:px-8 lg:py-5 mx-auto">
          {/* Card */}
          <div className="bg-white rounded-xl shadow p-4 sm:p-7 dark:bg-neutral-900">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                Edit Accounts
              </h2>
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                Manage accounts name and email.
              </p>
            </div>
            <form onSubmit={(e) => { handleUpdate(e) }}>
              {/* Section */}
              <div className="py-6 first:pt-0 last:pb-0 border-t first:border-transparent border-gray-200 dark:border-neutral-700 dark:first:border-transparent">
                <label
                  htmlFor="af-payment-billing-address"
                  className="inline-block text-sm font-medium dark:text-white"
                >
                  Choose user
                </label>
                <div className="mt-2 space-y-3">
                  <select required onChange={(e) => { selectedData(Number(e.target.value)) }} className="py-2 px-3 pe-9 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                    <option selected disabled>Select User</option>
                    {devices.length !== 0 && <>

                      {devices.map((e, i) => {
                        return (
                          <React.Fragment key={i}>
                            <option value={e.user_id}>{e.username}</option>

                          </React.Fragment>
                        )
                      })}
                    </>}
                  </select>
                  <label
                    htmlFor="af-payment-billing-address"
                    className="inline-block text-sm font-medium dark:text-white"
                  >
                     Username
                  </label>
                  <div className="mt-2 space-y-3"></div>
                  <input required placeholder="Enter username" value={deviceName} onChange={(e) => { setDeviceName(e.target.value) }} className="py-2 px-3 pe-9 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" />


                  <label
                    htmlFor="af-payment-billing-address"
                    className="inline-block text-sm font-medium dark:text-white"
                  >
                     Email
                  </label>
                  <div className="mt-2 space-y-3"></div>
                  <input required placeholder="Enter email" value={deviceStatus} onChange={(e) => { setDeviceStatus(e.target.value) }} className="py-2 px-3 pe-9 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" />

                  <label
                    htmlFor="af-payment-billing-address"
                    className="inline-block text-sm font-medium dark:text-white"
                  >
                     Role
                  </label>
                  <div className="mt-2 space-y-3"></div>
                  <select required value={deviceRole} onChange={(e) => { setDeviceRole((e.target.value)) }} className="py-2 px-3 pe-9 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                    <option selected disabled>Select Role</option>
                    {role.length !== 0 && <>

                      {role.map((e, i) => {
                        return (
                          <React.Fragment key={i}>
                            <option value={e.value}>{e.label}</option>

                          </React.Fragment>
                        )
                      })}
                    </>}
                  </select>


                </div>
              </div>
              {/* End Section */}

              <div className="mt-5 flex justify-end gap-x-2">
                <button
                  type="button"
                  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
          {/* End Card */}
        </div>
        {/* End Card Section */}
      </>

    </>
  )

}