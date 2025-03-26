import { useEffect, useState } from "react"
import axios from "axios"
import React from "react"
import { useOutletContext } from "react-router-dom"
import { OutletContextType } from "../layouts/MainLayout"
import {maintenanceIssues, maintenanceStatuses} from '../constants/variables.ts'

interface IMaintenance {
    id: number,
    name: string,
    value: number,
    priority:string,
    status: string
    issue:string,
    created_at:string,
    updated_at:string
}

const priorityLevels = [
    { value: 'low', label: 'Low', icon: '⬇️' },
    { value: 'medium', label: 'Medium', icon: '➡️' },
    { value: 'high', label: 'High', icon: '⬆️' }
  ];

export const Maintenance = () => {

    function formatDate(isoDate:string) {
        return isoDate.slice(0, 10); // Extracts the first 10 characters (YYYY-MM-DD format)
      }
    const hostServer = import.meta.env.VITE_SERVER_HOST
    const { setIsLoading, user } = useOutletContext<OutletContextType>()
    const [assets, setAssets] = useState<IMaintenance[]>([]);
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5;
    const lastIndexPage = currentPage * itemsPerPage;
    const firstIndexPage = lastIndexPage - itemsPerPage;
    const data = assets?.slice(firstIndexPage, lastIndexPage)
    const totalPages = Math.ceil(assets.length / itemsPerPage)
    const [addDataForm, setAddDataForm] = useState({
        name: "",
        value: "",
        priority:"",
        issue:"",
        status: "",
    })
    const [updateDataForm, setUpdateDataForm] = useState({
        name: "",
        value: "",
        priority:"",
        issue:"",
        status: "",
    })
    // Function to fetch all assets
    const fetchAssets = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${hostServer}/getMaintenanceRequest`);
            setAssets(response.data);
            console.log(response.data)
        } catch (err) {
        } finally {
            setIsLoading(false);
        }
    };


    // Function to register a new asset
    const registerProjectTask = async (e: any) => {
        try {
            setIsLoading(true);
            e.preventDefault
            await axios.post(`${hostServer}/registerMaintenanceRequest`, 
                {
                    name: addDataForm.name,
                    value: addDataForm.value,
                    priority:addDataForm.priority,
                    issue:addDataForm.issue,
                    status: addDataForm.status,
                }
            );
            fetchAssets();
            alert("Added Successfully!")
            setAddDataForm({
                name: "",
                value: "",
                priority:"",
                issue:"",
                status: "",
            })
            setIsLoading(false);

        } catch (err) {
            setIsLoading(false);
        }
    };

    // Function to update an existing asset
    const updateProjectTask = async (e: any, id: number) => {
        try {
            e.preventDefault()
            setIsLoading(true);
            await axios.post(`${hostServer}/updateMaintenanceRequest`, {
                id: id,
                name: updateDataForm.name,
                value: updateDataForm.value,
                priority:updateDataForm.priority,
                issue:updateDataForm.issue,
                status: updateDataForm.status,
            });
            fetchAssets()
            alert("Updated Successfully!")
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
        }
    };

    // Function to delete an asset
    const removeProjectTask = async (id: number) => {
        try {
            setIsLoading(true);
            await axios.delete(`${hostServer}/removeMaintenanceRequest/${id}`);
            setAssets(assets.filter(asset => asset.id !== id)); // Remove asset from state
            alert("Deleted Successfully!")
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
        }
    };

    // useEffect to fetch assets when the component mounts
    useEffect(() => {
        fetchAssets();
    }, []);
    useEffect(() => {
        console.log(updateDataForm)
    }, [updateDataForm])
    useEffect(() => {
        console.log(addDataForm)
    }, [addDataForm])
    const toggleDialog = (data: any) => {
        console.log(updateDataForm)
        const dialog = document.querySelectorAll(`.dialog-${data.id}`);
        console.log(data)
        if (dialog.length !== 0) {
            setUpdateDataForm({
                name: data.name,
                value: data.value,
                priority:data.priority,
                issue:data.issue,
                status: data.status,
            });
            dialog.forEach((item) => item.classList.toggle('show-dialog'));
        }
    };

    return (
        <>

            <div className="viewitems w-full overflow-x-hidden">
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
                                                Maintenance Requests Data
                                                </h2>
                                                <p className="text-sm text-gray-600 dark:text-neutral-400">
                                                    Create Maintenance Requests, edit and delete.
                                                </p>
                                            </div>
                                            <div>
                                                <div className="inline-flex gap-x-2">

                                                    <>
                                                        <button
                                                            type="button"
                                                            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                                            aria-haspopup="dialog"
                                                            aria-expanded="false"
                                                            aria-controls="hs-focus-management-modal"
                                                            data-hs-overlay="#hs-focus-management-modal"
                                                        >
                                                            Add Request
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
                                                                    <form onSubmit={(e) => { registerProjectTask(e) }}>
                                                                        <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
                                                                            <h3
                                                                                id="hs-focus-management-modal-label"
                                                                                className="font-bold text-gray-800 dark:text-white"
                                                                            >
                                                                                 Maintenance Request
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
                                                                            {/* add form */}

                                                                            
                                                                            <label
                                                                                htmlFor="input-label"
                                                                                className="block text-sm font-medium mb-2 dark:text-white"
                                                                            >
                                                                                Maintenance Request Name
                                                                            </label>
                                                                            <input
                                                                                onChange={(e) => {
                                                                                    setAddDataForm({
                                                                                        name: e.target.value,
                                                                                        value: addDataForm.value,
                                                                                        priority:addDataForm.priority,
                                                                                        issue:addDataForm.issue,
                                                                                        status: addDataForm.status,
                                                                                    });
                                                                                }}
                                                                                type="text"
                                                                                value={addDataForm.name}
                                                                                id="input-label"
                                                                                required
                                                                                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                                placeholder="Enter request name"
                                                                            />
                                                                            <label
                                                                                htmlFor="input-label"
                                                                                className="mt-5 block text-sm font-medium mb-2 dark:text-white"
                                                                            >
                                                                                Cost
                                                                            </label>
                                                                            <input
                                                                                value={addDataForm.value}
                                                                                onChange={(e) => {
                                                                                    setAddDataForm({
                                                                                        name: addDataForm.name,
                                                                                        value: e.target.value,
                                                                                        priority:addDataForm.priority,
                                                                                        issue:addDataForm.issue,
                                                                                        status: addDataForm.status,
                                                                                    })
                                                                                }}
                                                                                type="number"
                                                                                id="input-label"
                                                                                required
                                                                                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                                placeholder="Enter cost"
                                                                            />
                                                                            <label
                                                                                htmlFor="input-label"
                                                                                className="mt-5 block text-sm font-medium mb-2 dark:text-white"
                                                                            >
                                                                                Level of priority
                                                                            </label>
                                                                            <select
                                                                                value={addDataForm.priority || ''} // Ensure there's a default value
                                                                                onChange={(e) => {
                                                                                    setAddDataForm({
                                                                                        name:addDataForm.name,
                                                                                        value: addDataForm.value,
                                                                                        priority:e.target.value,
                                                                                        issue:addDataForm.issue,
                                                                                        status: addDataForm.status,
                                                                                    });
                                                                                }}
                                                                                className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                                                            >
                                                                                <option value="" disabled>Select Level of priority</option>
                                                                                {priorityLevels.map((e) => (
                                                                                    <option key={e.value} value={e.value}>
                                                                                        {e.label}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                            <label
                                                                                htmlFor="input-label"
                                                                                className="mt-5 block text-sm font-medium mb-2 dark:text-white"
                                                                            >
                                                                                Issue
                                                                            </label>
                                                                            <select
                                                                                value={addDataForm.issue || ''} // Ensure there's a default value
                                                                                onChange={(e) => {
                                                                                    setAddDataForm({
                                                                                        name:addDataForm.name,
                                                                                        value: addDataForm.value,
                                                                                        priority:addDataForm.priority,
                                                                                        issue:e.target.value,
                                                                                        status: addDataForm.status,
                                                                                    });
                                                                                }}
                                                                                className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                                                            >
                                                                                <option value="" disabled>Select Issue</option>
                                                                                {maintenanceIssues.map((e:any) => (
                                                                                    <option key={e.value} value={e.value}>
                                                                                        {e.label}
                                                                                    </option>
                                                                                ))}
                                                                                {/* <option value="others" >Others</option> */}
                                                                            </select>
                                                                            <label
                                                                                htmlFor="input-label"
                                                                                className="mt-5 block text-sm font-medium mb-2 dark:text-white"
                                                                            >
                                                                                Status
                                                                            </label>
                                                                            <select
                                                                                value={addDataForm.status || ''} // Ensure there's a default value
                                                                                onChange={(e) => {
                                                                                    setAddDataForm({
                                                                                        name:addDataForm.name,
                                                                                        value: addDataForm.value,
                                                                                        priority:addDataForm.priority,
                                                                                        issue:addDataForm.issue,
                                                                                        status: e.target.value,
                                                                                    });
                                                                                }}
                                                                                className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                                                            >
                                                                                <option value="" disabled>Select Issue</option>
                                                                                {maintenanceStatuses.map((e:any) => (
                                                                                    <option key={e.value} value={e.value}>
                                                                                        {e.label}
                                                                                    </option>
                                                                                ))}
                                                                                {/* <option value="others" >Others</option> */}
                                                                            </select>

                                                                                {/* add form ended */}
                                                       
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
                                                                Maintenance Request ID

                                                            </a>
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-start">
                                                            <a
                                                                className="group inline-flex items-center gap-x-2 text-xs font-semibold uppercase text-gray-800 hover:text-gray-500 focus:outline-none focus:text-gray-500 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
                                                                href="#"
                                                            >
                                                                Maintenance Request Name

                                                            </a>
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-start">
                                                            <a
                                                                className="group inline-flex items-center gap-x-2 text-xs font-semibold uppercase text-gray-800 hover:text-gray-500 focus:outline-none focus:text-gray-500 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
                                                                href="#"
                                                            >
                                                                Reported Issue

                                                            </a>
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-start">
                                                            <a
                                                                className="group inline-flex items-center gap-x-2 text-xs font-semibold uppercase text-gray-800 hover:text-gray-500 focus:outline-none focus:text-gray-500 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
                                                                href="#"
                                                            >
                                                                Cost

                                                            </a>
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-start">
                                                            <a
                                                                className="group inline-flex items-center gap-x-2 text-xs font-semibold uppercase text-gray-800 hover:text-gray-500 focus:outline-none focus:text-gray-500 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
                                                                href="#"
                                                            >
                                                                Priority

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
                                                                Updated at

                                                            </a>
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-start">
                                                            <a
                                                                className="group inline-flex items-center gap-x-2 text-xs font-semibold uppercase text-gray-800 hover:text-gray-500 focus:outline-none focus:text-gray-500 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
                                                                href="#"
                                                            >
                                                                Created at

                                                            </a>
                                                        </th>
                                                        {user.role !=="3" && <th scope="col" className="px-6 py-3 text-end" />}
                                                        {
                                                            data.length == 0 ?
                                                                <>
                                                                </> : <>


                                                                </>}
                                                    </tr>
                                                </thead>
                                                {
                                                    data.length == 0 ?
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
                                                                                            {data.id}
                                                                                        </p>
                                                                                    </div>
                                                                                </a>
                                                                            </td>
                                                                            <td className="size-px whitespace-nowrap">
                                                                                <a className="block relative z-10" href="#">
                                                                                    <div className="px-6 py-2">
                                                                                        <p className="text-sm text-gray-500 dark:text-neutral-500">
                                                                                            {data.name}
                                                                                        </p>

                                                                                    </div>
                                                                                </a>
                                                                            </td>
                                                                            <td className="size-px whitespace-nowrap">
                                                                                <a className="block relative z-10" href="#">
                                                                                    <div className="px-6 py-2">
                                                                                        <p className="text-sm text-gray-500 dark:text-neutral-500">
                                                                                            {data.issue}
                                                                                        </p>

                                                                                    </div>
                                                                                </a>
                                                                            </td>
                                                                            <td className="size-px whitespace-nowrap">
                                                                                <a className="block relative z-10" href="#">
                                                                                    <div className="px-6 py-2">
                                                                                        <p className="text-sm text-gray-500 dark:text-neutral-500">
                                                                                            {data.value}
                                                                                        </p>

                                                                                    </div>
                                                                                </a>
                                                                            </td>
                                                                            <td className="size-px whitespace-nowrap">
                                                                                <a className="block relative z-10" href="#">
                                                                                    <div className="px-6 py-2">
                                                                                        <p className="text-sm text-gray-500 dark:text-neutral-500">
                                                                                            {data.priority}
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
                                                                                            {formatDate(data.updated_at)}
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
                                                                            {user.role !=="3" &&
                                                                            <>
                                                                                                                                           <td className="size-px whitespace-nowrap">
                                                                                <div className="px-6 py-1.5">
                                                                                    <a
                                                                                        onClick={() => { removeProjectTask(data.id) }}
                                                                                        className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
                                                                                        href="#"
                                                                                    >
                                                                                        Delete
                                                                                    </a>
                                                                                </div>


                                                                            </td>
                                                                            <td className="size-px whitespace-nowrap">
                                                                                <div className="px-6 py-1.5">
                                                                                    <a
                                                                                        onClick={() => { toggleDialog(data) }}
                                                                                        className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
                                                                                        href="#"
                                                                                    >
                                                                                        Edit
                                                                                    </a>
                                                                                </div>
                                                                                <div className={`dialog-container dialog-${data.id}`} id="dialog-1">
                                                                                    <div
                                                                                        className={` dialog-container dialog-${data.id} bg-neutral-900 opacity-5 size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y`}
                                                                                    >
                                                                                    </div>
                                                                                    <div
                                                                                        className={` dialog-container dialog-${data.id} size-full fixed top-0 start-0 z-[81] overflow-x-hidden overflow-y`}
                                                                                    >
                                                                                        <div className={` dialog-container dialog-${data.id} ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto`}>
                                                                                            <div className="flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
                                                                                                <form onSubmit={(e) => { updateProjectTask(e, data.id) }}>
                                                                                                    <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
                                                                                                        <h3
                                                                                                            id="hs-focus-management-modal-label"
                                                                                                            className="font-bold text-gray-800 dark:text-white"
                                                                                                        >
                                                                                                            Maintenance Request Update
                                                                                                        </h3>
                                                                                                        <button
                                                                                                            onClick={() => { toggleDialog(data) }}
                                                                                                            type="button"
                                                                                                            className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600"
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
                                                                                Maintenance Request Name
                                                                            </label>
                                                                            <input
                                                                                onChange={(e) => {
                                                                                    setUpdateDataForm({
                                                                                        name: e.target.value,
                                                                                        value: updateDataForm.value,
                                                                                        priority:updateDataForm.priority,
                                                                                        issue:updateDataForm.issue,
                                                                                        status: updateDataForm.status,
                                                                                    });
                                                                                }}
                                                                                type="text"
                                                                                value={updateDataForm.name}
                                                                                id="input-label"
                                                                                required
                                                                                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                                placeholder="Enter request name"
                                                                            />
                                                                            <label
                                                                                htmlFor="input-label"
                                                                                className="mt-5 block text-sm font-medium mb-2 dark:text-white"
                                                                            >
                                                                                Cost
                                                                            </label>
                                                                            <input
                                                                                value={updateDataForm.value}
                                                                                onChange={(e) => {
                                                                                    setUpdateDataForm({
                                                                                        name: updateDataForm.name,
                                                                                        value: e.target.value,
                                                                                        priority:updateDataForm.priority,
                                                                                        issue:updateDataForm.issue,
                                                                                        status: updateDataForm.status,
                                                                                    })
                                                                                }}
                                                                                type="number"
                                                                                id="input-label"
                                                                                required
                                                                                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                                placeholder="Enter cost"
                                                                            />
                                                                            <label
                                                                                htmlFor="input-label"
                                                                                className="mt-5 block text-sm font-medium mb-2 dark:text-white"
                                                                            >
                                                                                Level of priority
                                                                            </label>
                                                                            <select
                                                                                value={updateDataForm.priority || ''} // Ensure there's a default value
                                                                                onChange={(e) => {
                                                                                    setUpdateDataForm({
                                                                                        name:updateDataForm.name,
                                                                                        value: updateDataForm.value,
                                                                                        priority:e.target.value,
                                                                                        issue:updateDataForm.issue,
                                                                                        status: updateDataForm.status,
                                                                                    });
                                                                                }}
                                                                                className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                                                            >
                                                                                <option value="" disabled>Select Level of priority</option>
                                                                                {priorityLevels.map((e) => (
                                                                                    <option key={e.value} value={e.value}>
                                                                                        {e.label}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                            <label
                                                                                htmlFor="input-label"
                                                                                className="mt-5 block text-sm font-medium mb-2 dark:text-white"
                                                                            >
                                                                                Issue
                                                                            </label>
                                                                            <select
                                                                                value={updateDataForm.issue || ''} // Ensure there's a default value
                                                                                onChange={(e) => {
                                                                                    setUpdateDataForm({
                                                                                        name:updateDataForm.name,
                                                                                        value: updateDataForm.value,
                                                                                        priority:updateDataForm.priority,
                                                                                        issue:e.target.value,
                                                                                        status: updateDataForm.status,
                                                                                    });
                                                                                }}
                                                                                className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                                                            >
                                                                                <option value="" disabled>Select Issue</option>
                                                                                {maintenanceIssues.map((e:any) => (
                                                                                    <option key={e.value} value={e.value}>
                                                                                        {e.label}
                                                                                    </option>
                                                                                ))}
                                                                                {/* <option value="others" >Others</option> */}
                                                                            </select>
                                                                            <label
                                                                                htmlFor="input-label"
                                                                                className="mt-5 block text-sm font-medium mb-2 dark:text-white"
                                                                            >
                                                                                Status
                                                                            </label>
                                                                            <select
                                                                                value={updateDataForm.status || ''} // Ensure there's a default value
                                                                                onChange={(e) => {
                                                                                    setUpdateDataForm({
                                                                                        name:updateDataForm.name,
                                                                                        value: updateDataForm.value,
                                                                                        priority:updateDataForm.priority,
                                                                                        issue:updateDataForm.issue,
                                                                                        status: e.target.value,
                                                                                    });
                                                                                }}
                                                                                className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                                                            >
                                                                                <option value="" disabled>Select Issue</option>
                                                                                {maintenanceStatuses.map((e:any) => (
                                                                                    <option key={e.value} value={e.value}>
                                                                                        {e.label}
                                                                                    </option>
                                                                                ))}
                                                                                {/* <option value="others" >Others</option> */}
                                                                            </select>
                                                                            {/* {updateDataForm.issue == "others" && 
                         
                                                                            <>
                                                                                                                          <label
                                                                                htmlFor="input-label"
                                                                                className="mt-5 block text-sm font-medium mb-2 dark:text-white"
                                                                            >
                                                                                Please Specify:
                                                                            </label>
                                                                            <input
                                                                                value={updateDataForm.issue=="others"?"":updateDataForm.issue}
                                                                                onChange={(e) => {
                                                                                    setUpdateDataForm({
                                                                                        name: updateDataForm.value,
                                                                                        value: updateDataForm.value,
                                                                                        priority:updateDataForm.priority,
                                                                                        issue:e.target.value,
                                                                                        status: updateDataForm.status,
                                                                                    })
                                                                                }}
                                                                                type="text"
                                                                                id="input-label"
                                                                                required
                                                                                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                                placeholder="Enter issue"
                                                                            />
                                                                            </>} */}
                                                                        </div>
                                                                                                    <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-neutral-700">
                                                                                                        <button
                                                                                                            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                                                                                                            onClick={() => { toggleDialog(data) }}
                                                                                                            type="button"
                                                                                                        >
                                                                                                            Close
                                                                                                        </button>
                                                                                                        <button
                                                                                                            type="submit"
                                                                                                            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                                                                                        >
                                                                                                            Update
                                                                                                        </button>
                                                                                                    </div>
                                                                                                </form>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                            </td>
                                                                            </>}
             
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
                                                        {assets.length}
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