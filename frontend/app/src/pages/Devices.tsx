import { useEffect, useState } from "react"

import { useOutletContext } from "react-router-dom";
import { devices, OutletContextType } from "../layouts/MainLayout";
import React from "react";
import axios from "axios";
export const ViewSales = () => {
    const { user, setIsLoading } = useOutletContext<OutletContextType>()
    // const [isImported, setIsImported] = useState<boolean>(false);
    // const fileInput = useRef<HTMLInputElement>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5;
    const hostServer = import.meta.env.VITE_SERVER_HOST
    const lastIndexPage = currentPage * itemsPerPage;
    const firstIndexPage = lastIndexPage - itemsPerPage;
    const [usersDataStorage, setUsersDataStorage] = useState<devices[]>([])
    const data = usersDataStorage?.slice(firstIndexPage, lastIndexPage)
    const totalPages = Math.ceil(usersDataStorage.length / itemsPerPage)

    const [addUserForm, setAddUserForm] = useState({
        deviceName: "",
        status: "",
        createdBy: "",
    })
    useEffect(() => {
        getDevicesData()
        setAddUserForm({
            deviceName: addUserForm.deviceName,
            status: addUserForm.status,
            createdBy: user?.username,
        })
    }, [user])

    const getDevicesData = async () => {
        try {
            setIsLoading(true)
            const res = (await axios.get(`${hostServer}/getDevices`)).data
            setUsersDataStorage(res)
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            console.log(error)
        }

    }
    const removeData = async (id: number) => {
        try {
            setIsLoading(true)
            const res = await axios.delete(`${hostServer}/removeDevice/${id}`)
            console.log(res)
            alert("Deleted Successfully!")
            setIsLoading(false)
            location.reload()
        } catch (error) {
            setIsLoading(false)
            console.log(error)
        }
    }
    const addData = async (e: any) => {
        if(user){
            e.preventDefault()
            try {
                setIsLoading(true)
                 await axios.post(`${hostServer}/registerDevice`, {
                    deviceName: addUserForm.deviceName,
                    status: addUserForm.status,
                    username: addUserForm.createdBy
                })
                alert("Created Successfully!")
                setIsLoading(false)
                location.reload()
            } catch (error) {
                setIsLoading(false)
                console.log(error)
            }
        }

    }

      
      
    // const convertToCSV = (data: any) => {
    //     const header = Object.keys(data[0]).join(",") + "\n";
    //     const rows = data.map((row: { [s: string]: unknown; } | ArrayLike<unknown>) => Object.values(row).join(",")).join("\n");
    //     return header + rows;
    // };
    // const deleteData = () => {
    //     let dataFromLocal = localStorage.getItem("importSalesData");
    //     if (dataFromLocal?.length !== 0) {
    //         localStorage.removeItem("importSalesData")
    //         setImportSalesData([])
    //     }
    // }
    // const downloadCSV = (storageData: any) => {
    //     const csvData = convertToCSV(storageData);
    //     const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    //     const url = URL.createObjectURL(blob);
    //     const link = document.createElement("a");
    //     link.setAttribute("href", url);
    //     link.setAttribute("download", "Sales.csv");
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    // };
    // useEffect(() => {
    //     let dataFromLocal = localStorage.getItem("importSalesData");
    //     if (importSalesData.length !== 0) {
    //         localStorage.setItem("importSalesData", JSON.stringify(importSalesData))
    //         let data = localStorage.getItem("importSalesData");
    //         if (data) {
    //             setImportSalesData(JSON.parse(data))
    //         }
    //     }
    //     else {
    //         if (dataFromLocal) {
    //             let data = localStorage.getItem("importSalesData");
    //             if (data) {
    //                 setImportSalesData(JSON.parse(data))
    //             }
    //         }
    //     }
    // }, [isImported])
    function formatDate(isoDate:string) {
        console.log(isoDate.slice(0, 10))
        return isoDate.slice(0, 10); // Extracts the first 10 characters (YYYY-MM-DD format)
      }
    // const handleImportFile = () => {
    //     if (fileInput.current) {
    //         fileInput.current.click();
    //     }
    // };
    // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = event.target.files?.[0];
    //     if (file) {
    //         // Use PapaParse to parse the CSV file
    //         Papa.parse(file, {
    //             header: true, // Set to true if the first row contains headers
    //             dynamicTyping: true, // Automatically converts numbers to type Number
    //             complete: (results: any) => {
    //                 setImportSalesData(results.data); // Store parsed data in state
    //                 setIsImported(!isImported)
    //                 results.data); // Log the parsed data
    //             },
    //             error: (error: any) => {
    //                 console.error('Error parsing CSV:', error);
    //             },
    //         });
    //     }
    // }

    return (
        <>
            <div className="viewsales w-full overflow-x-hidden">
                <>
                    {/* Table Section */}
                    <div className="max-w-[85rem] h-lvh mx-auto">
                        {/* Card */}
                        <div className="flex flex-col">
                            <div className="-m-1.5 overflow-x-hidden">
                                <div className="min-w-full inline-block align-middle w-full">
                                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-neutral-900 dark:border-neutral-700 lg:p-10">
                                        {/* Header */}
                                        <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                                                    Devices Data
                                                </h2>
                                                <p className="text-sm text-gray-600 dark:text-neutral-400">
                                                    Add devices, edit and delete.
                                                </p>
                                            </div>
                                            <div>
                                                <div className="inline-flex gap-x-2">
                                                    {/* <div className="hs-dropdown [--placement:bottom-right] relative inline-block">
                                                        <button
                                                            id="hs-as-table-table-export-dropdown"
                                                            type="button"
                                                            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                                                            aria-haspopup="menu"
                                                            aria-expanded="false"
                                                            aria-label="Dropdown"
                                                        >

                                                            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
                                                                className="shrink-0 size-3.5 text-gray-800 dark:text-neutral-200"

                                                                width={24}
                                                                height={24}
                                                            >
                                                                <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                                                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                                                <g id="SVGRepo_iconCarrier">
                                                                    {" "}
                                                                    <path d="M11 0H5V12H15V4L11 0Z" fill="#1f2937" />{" "}
                                                                    <path d="M1 4V16H11V14H3V4H1Z" fill="#1f2937" />{" "}
                                                                </g>
                                                            </svg>

                                                            File
                                                        </button>
                                                        <div
                                                            className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden divide-y divide-gray-200 min-w-48 z-20 bg-white shadow-md rounded-lg p-2 mt-2 dark:divide-neutral-700 dark:bg-neutral-800 dark:border dark:border-neutral-700"
                                                            role="menu"
                                                            aria-orientation="vertical"
                                                            aria-labelledby="hs-as-table-table-export-dropdown"
                                                        >
                                                            <div className="py-2 first:pt-0 last:pb-0">
                                                                <span className="block py-2 px-3 text-xs font-medium uppercase text-gray-400 dark:text-neutral-600">
                                                                    Options
                                                                </span>
                                                                <a
                                                                    onClick={handleImportFile}
                                                                    className="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300"
                                                                    href="#"
                                                                >
                                                                    <svg fill="#1f2937" viewBox="0 0 1920 1920"
                                                                        className="shrink-0 size-4"
                                                                        width={24}
                                                                        height={24}
                                                                        xmlns="http://www.w3.org/2000/svg">
                                                                        <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                                                                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                                                        <g id="SVGRepo_iconCarrier">
                                                                            {" "}
                                                                            <path
                                                                                d="m807.186 686.592 272.864 272.864H0v112.94h1080.05l-272.864 272.978 79.736 79.849 409.296-409.183-409.296-409.184-79.736 79.736ZM1870.419 434.69l-329.221-329.11C1509.688 74.07 1465.979 56 1421.48 56H451.773v730.612h112.94V168.941h790.584v451.762h451.762v1129.405H564.714v-508.233h-112.94v621.173H1920V554.52c0-45.176-17.619-87.754-49.58-119.83Zm-402.181-242.37 315.443 315.442h-315.443V192.319Z"
                                                                                fillRule="evenodd"
                                                                            />{" "}
                                                                        </g>
                                                                    </svg>
                                                                    <input accept=".csv" type="file" className="hidden" onChange={handleFileChange} ref={fileInput} />
                                                                    Import
                                                                </a>
                                                                <a
                                                                    className="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300"
                                                                    href="#"
                                                                    onClick={() => downloadCSV(importSalesData)}
                                                                >
                                                                    <svg
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        className="shrink-0 size-4"
                                                                        width={24}
                                                                        height={24}
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        stroke="#1f2937"
                                                                    >
                                                                        <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                                                                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                                                        <g id="SVGRepo_iconCarrier">
                                                                            {" "}
                                                                            <path
                                                                                d="M8 22.0002H16C18.8284 22.0002 20.2426 22.0002 21.1213 21.1215C22 20.2429 22 18.8286 22 16.0002V15.0002C22 12.1718 22 10.7576 21.1213 9.8789C20.3529 9.11051 19.175 9.01406 17 9.00195M7 9.00195C4.82497 9.01406 3.64706 9.11051 2.87868 9.87889C2 10.7576 2 12.1718 2 15.0002L2 16.0002C2 18.8286 2 20.2429 2.87868 21.1215C3.17848 21.4213 3.54062 21.6188 4 21.749"
                                                                                stroke="#1f2937"
                                                                                strokeWidth="1.5"
                                                                                strokeLinecap="round"
                                                                            />{" "}
                                                                            <path
                                                                                d="M12 2L12 15M12 15L9 11.5M12 15L15 11.5"
                                                                                stroke="#1f2937"
                                                                                strokeWidth="1.5"
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                            />{" "}
                                                                        </g>
                                                                    </svg>

                                                                    Export
                                                                </a>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                                            aria-haspopup="dialog"
                                                            aria-expanded="false"
                                                            aria-controls="hs-focus-management-modal-1"
                                                            data-hs-overlay="#hs-focus-management-modal-1"
                                                        >
                                                            Truncate <span className="hidden sm:block">Data</span>
                                                        </button>


                                                        <div
                                                            id="hs-focus-management-modal-1"
                                                            className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none"
                                                            role="dialog"
                                                            tabIndex={-1}
                                                            aria-labelledby="hs-focus-management-modal-1-label"
                                                        >
                                                            <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
                                                                <div className="flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
                                                                    <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
                                                                        <h3
                                                                            id="hs-focus-management-modal-1-label"
                                                                            className="font-bold text-gray-800 dark:text-white"
                                                                        >
                                                                            Delete all data
                                                                        </h3>
                                                                        <button
                                                                            type="button"
                                                                            className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600"
                                                                            aria-label="Close"
                                                                            data-hs-overlay="#hs-focus-management-modal-1"
                                                                        >
                                                                            <span className="sr-only">Close</span>
                                                                            <svg
                                                                                className="shrink-0 size-4"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                width={24}
                                                                                height={24}
                                                                                viewBox="0 0 24 24"
                                                                                fill="none"
                                                                                stroke="currentColor"
                                                                                strokeWidth={2}
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                            >
                                                                                <path d="M18 6 6 18" />
                                                                                <path d="m6 6 12 12" />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                    <div className="p-4 overflow-y-auto">
                                                                        <h3
                                                                            className="block text-sm font-medium mb-2 dark:text-white"
                                                                        >
                                                                            Are you sure you want to delete all of the data?
                                                                        </h3>
                                                                    </div>
                                                                    <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-neutral-700">
                                                                        <button
                                                                            type="button"
                                                                            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                                                                            data-hs-overlay="#hs-focus-management-modal-1"
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                        <button
                                                                            onClick={deleteData}
                                                                            type="button"
                                                                            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:bg-red-700 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                                                                            data-hs-overlay="#hs-focus-management-modal-1"
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </> */}
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                                            aria-haspopup="dialog"
                                                            aria-expanded="false"
                                                            aria-controls="hs-focus-management-modal"
                                                            data-hs-overlay="#hs-focus-management-modal"
                                                        >
                                                            Add Device
                                                        </button>
                                                        <div
                                                            id="hs-focus-management-modal"
                                                            className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none"
                                                            role="dialog"
                                                            tabIndex={-1}
                                                            aria-labelledby="hs-focus-management-modal-label"
                                                        >
                                                            <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
                                                                <div className="flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
                                                                    <form onSubmit={(e) => { addData(e) }}>
                                                                        <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
                                                                            <h3
                                                                                id="hs-focus-management-modal-label"
                                                                                className="font-bold text-gray-800 dark:text-white"
                                                                            >
                                                                                Device Creation
                                                                            </h3>
                                                                            <button
                                                                                type="button"
                                                                                className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600"
                                                                                aria-label="Close"
                                                                                data-hs-overlay="#hs-focus-management-modal"
                                                                            >
                                                                                <span className="sr-only">Close</span>
                                                                                <svg
                                                                                    className="shrink-0 size-4"
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    width={24}
                                                                                    height={24}
                                                                                    viewBox="0 0 24 24"
                                                                                    fill="none"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth={2}
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                >
                                                                                    <path d="M18 6 6 18" />
                                                                                    <path d="m6 6 12 12" />
                                                                                </svg>
                                                                            </button>
                                                                        </div>
                                                                        <div className="p-4 overflow-y-auto">
                                                                            <label
                                                                                htmlFor="input-label"
                                                                                className="block text-sm font-medium mb-2 dark:text-white"
                                                                            >
                                                                                Device Name
                                                                            </label>
                                                                            <input
                                                                                onChange={(e) => {
                                                                                    setAddUserForm({
                                                                                        deviceName: e.target.value,
                                                                                        status: addUserForm.status,
                                                                                        createdBy: addUserForm.createdBy,
                                                                                    })
                                                                                }}
                                                                                type="text"
                                                                                id="input-label"
                                                                                required
                                                                                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                                placeholder="Enter device name"
                                                                            />
                                                                            <label
                                                                                htmlFor="input-label"
                                                                                className="mt-5 block text-sm font-medium mb-2 dark:text-white"
                                                                            >
                                                                                Status
                                                                            </label>
                                                                            <select

                                                                                onChange={(e) => {
                                                                                    setAddUserForm({
                                                                                        deviceName: addUserForm.deviceName,
                                                                                        status: e.target.value,
                                                                                        createdBy: addUserForm.createdBy,

                                                                                    })
                                                                                }}
                                                                                className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                                                                                <option selected disabled>Choose a status</option>
                                                                                <option value="active">Active</option>
                                                                                <option value="inactive">Inactive</option>

                                                                            </select>
                                                                        </div>
                                                                        <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-neutral-700">
                                                                            <button
                                                                                type="button"
                                                                                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                                                                                data-hs-overlay="#hs-focus-management-modal"
                                                                            >
                                                                                Close
                                                                            </button>
                                                                            <button
                                                                                type="submit"
                                                                                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                                                            >
                                                                                Submit
                                                                            </button>
                                                                        </div>
                                                                    </form>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>

                                                </div>
                                            </div>
                                        </div>
                                        {/* End Header */}
                                        {/* Table */}
                                        <div className="table-data overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                                                <thead className="bg-gray-50 dark:bg-neutral-800">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-3 text-start">
                                                            <a
                                                                className="group inline-flex items-center gap-x-2 text-xs font-semibold uppercase text-gray-800 hover:text-gray-500 focus:outline-none focus:text-gray-500 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
                                                                href="#"
                                                            >
                                                                Device ID

                                                            </a>
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-start">
                                                            <a
                                                                className="group inline-flex items-center gap-x-2 text-xs font-semibold uppercase text-gray-800 hover:text-gray-500 focus:outline-none focus:text-gray-500 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
                                                                href="#"
                                                            >
                                                                Device Name

                                                            </a>
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-start">
                                                            <a
                                                                className="group inline-flex items-center gap-x-2 text-xs font-semibold uppercase text-gray-800 hover:text-gray-500 focus:outline-none focus:text-gray-500 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
                                                                href="#"
                                                            >
                                                                Status

                                                            </a>
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-start">
                                                            <a
                                                                className="group inline-flex items-center gap-x-2 text-xs font-semibold uppercase text-gray-800 hover:text-gray-500 focus:outline-none focus:text-gray-500 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
                                                                href="#"
                                                            >
                                                                Created By

                                                            </a>
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-start">
                                                            <a
                                                                className="group inline-flex items-center gap-x-2 text-xs font-semibold uppercase text-gray-800 hover:text-gray-500 focus:outline-none focus:text-gray-500 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
                                                                href="#"
                                                            >
                                                                Created Date

                                                            </a>
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-end" />
                                                        {
                                                            data.length == 0 ?
                                                                <>
                                                                </> : <>


                                                                </>}
                                                    </tr>
                                                </thead>
                                                {
                                                    usersDataStorage.length == 0 ?
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    &nbsp;&nbsp;&nbsp;
                                                                </td>

                                                                <td>
                                                                    &nbsp;&nbsp;&nbsp;
                                                                </td>

                                                                <td>
                                                                    <div className="h-96 w-full flex items-center" >
                                                                        <h1 className="text-lg">No Records Found</h1>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    &nbsp;&nbsp;&nbsp;
                                                                </td>


                                                                <td>
                                                                    &nbsp;&nbsp;&nbsp;
                                                                </td>

                                                            </tr>
                                                        </tbody>


                                                        : data.map((data, i) => {
                                                            return (
                                                                <React.Fragment key={i}>
                                                                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                                                                        <tr className="bg-white hover:bg-gray-50 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                                                                            <td className="size-px whitespace-nowrap">
                                                                                <a className="block relative z-10" href="#">
                                                                                    <div className="px-6 py-2">
                                                                                        <p className="text-sm text-gray-500 dark:text-neutral-500">
                                                                                            {data.device_id}
                                                                                        </p>
                                                                                    </div>
                                                                                </a>
                                                                            </td>
                                                                            <td className="size-px whitespace-nowrap">
                                                                                <a className="block relative z-10" href="#">
                                                                                    <div className="px-6 py-2">
                                                                                        <p className="text-sm text-gray-500 dark:text-neutral-500">
                                                                                            {data.device_name}
                                                                                        </p>

                                                                                    </div>
                                                                                </a>
                                                                            </td>
                                                                            <td className="size-px whitespace-nowrap">
                                                                                <a className="block relative z-10" href="#">
                                                                                    <div className="px-6 py-2">
                                                                                        <p className="text-sm text-gray-500 dark:text-neutral-500">
                                                                                            {data.status}
                                                                                        </p>

                                                                                    </div>
                                                                                </a>
                                                                            </td>
                                                                            <td className="size-px whitespace-nowrap">
                                                                                <a className="block relative z-10" href="#">
                                                                                    <div className="px-6 py-2">
                                                                                        <p className="text-sm text-gray-500 dark:text-neutral-500">
                                                                                            {data.created_by}
                                                                                        </p>

                                                                                    </div>
                                                                                </a>
                                                                            </td>
                                                                            <td className="size-px whitespace-nowrap">
                                                                                <a className="block relative z-10" href="#">
                                                                                    <div className="px-6 py-2">
                                                                                        <p className="text-sm text-gray-500 dark:text-neutral-500">
                                                                                            {formatDate(data.created_at)}
                                                                                        </p>

                                                                                    </div>
                                                                                </a>
                                                                            </td>
                                                                            <td className="size-px whitespace-nowrap">
                                                                                <div className="px-6 py-1.5">
                                                                                    <a
                                                                                        onClick={() => { removeData(data.device_id) }}
                                                                                        className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
                                                                                        href="#"
                                                                                    >
                                                                                        Delete
                                                                                    </a>
                                                                                </div>


                                                                            </td>
                                                                        </tr>

                                                                    </tbody>
                                                                </React.Fragment>
                                                            )
                                                        })
                                                }


                                            </table>
                                        </div>
                                        {/* End Table */}
                                        {/* Footer */}
                                        <div className="items-center justify-center px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-neutral-700">
                                            <div>
                                                <p className="text-center sm:text-left text-sm text-gray-600 dark:text-neutral-400">
                                                    <span className="font-semibold text-gray-800 dark:text-neutral-200">
                                                        {usersDataStorage.length}
                                                    </span>{" "}
                                                    results
                                                </p>
                                            </div>
                                            <div>
                                                <div className="inline-flex justify-center items-center gap-x-2">
                                                    <button
                                                        onClick={() => setCurrentPage(currentPage - 1)}
                                                        disabled={currentPage === 1}
                                                        type="button"
                                                        className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                                                    >
                                                        <svg
                                                            className="shrink-0 size-4"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width={24}
                                                            height={24}
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <path d="m15 18-6-6 6-6" />
                                                        </svg>
                                                        Prev
                                                    </button>
                                                    <span className="font-semibold text-sm text-gray-800 dark:text-neutral-200"> Page {currentPage} of {totalPages} </span>
                                                    <button
                                                        onClick={() => setCurrentPage(currentPage + 1)}
                                                        disabled={currentPage === totalPages}
                                                        type="button"
                                                        className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                                                    >
                                                        Next
                                                        <svg
                                                            className="shrink-0 size-4"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width={24}
                                                            height={24}
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <path d="m9 18 6-6-6-6" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        {/* End Footer */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* End Card */}
                    </div>
                    {/* End Table Section */}
                </>

            </div>
        </>
    )

}