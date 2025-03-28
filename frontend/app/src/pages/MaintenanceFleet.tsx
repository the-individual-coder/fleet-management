import axios from "axios";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { OutletContextType } from "../layouts/MainLayout";
import React from "react";

export default interface MaintenanceI {
    maintenance_id: number;
    vehicle_id: number;
    maintenance_type: string;
    description: string;
    scheduled_date: string;
    completed_date: string | null;
    cost: number | null;
    service_provider: string | null;
    technician_name: string | null;
    status: string;
    mileage: number | null;
    notes: string | null;
}

export const MaintenanceFleet = () => {
    const hostServer = import.meta.env.VITE_SERVER_HOST;
    const { setIsLoading, user } = useOutletContext<OutletContextType>();
    const [maintenance, setMaintenance] = useState<MaintenanceI[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const lastIndexPage = currentPage * itemsPerPage;
    const firstIndexPage = lastIndexPage - itemsPerPage;
    const data = maintenance?.slice(firstIndexPage, lastIndexPage);
    const totalPages = Math.ceil(maintenance.length / itemsPerPage);
    const formatDateForInput = (date: any) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Add leading zero
        const day = String(d.getDate()).padStart(2, '0');         // Add leading zero
        return `${year}-${month}-${day}`;
    };
    const [addDataForm, setAddDataForm] = useState({
        vehicle_id: "",
        maintenance_type: "routine",
        description: "",
        scheduled_date: "",
        completed_date: "",
        cost: "",
        service_provider: "",
        technician_name: "",
        status: "scheduled",
        mileage: "",
        notes: ""
    });

    const [updateDataForm, setUpdateDataForm] = useState({
        vehicle_id: "",
        maintenance_type: "routine",
        description: "",
        scheduled_date: "",
        completed_date: "",
        cost: "",
        service_provider: "",
        technician_name: "",
        status: "scheduled",
        mileage: "",
        notes: ""
    });

    // Fetch all maintenance records
    const fetchMaintenance = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${hostServer}/getMaintenance`);
            setMaintenance(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Register new maintenance
    const registerMaintenance = async (e: any) => {
        try {
            setIsLoading(true);
            e.preventDefault();
            await axios.post(`${hostServer}/registerMaintenance`, addDataForm);
            fetchMaintenance();
            alert("Maintenance record added successfully!");
            setAddDataForm({
                vehicle_id: "",
                maintenance_type: "routine",
                description: "",
                scheduled_date: "",
                completed_date: "",
                cost: "",
                service_provider: "",
                technician_name: "",
                status: "scheduled",
                mileage: "",
                notes: ""
            });
            setIsLoading(false);
        } catch (err) {
            console.error(err);
            setIsLoading(false);
        }
    };

    // Update maintenance
    const updateMaintenance = async (e: any, id: number) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            await axios.post(`${hostServer}/updateMaintenance`, {
                ...updateDataForm,
                maintenance_id: id
            });
            fetchMaintenance();
            alert("Maintenance record updated successfully!");
            setIsLoading(false);
        } catch (err) {
            console.error(err);
            setIsLoading(false);
        }
    };

    // Delete maintenance
    const removeMaintenance = async (id: number) => {
        try {
            setIsLoading(true);
            await axios.delete(`${hostServer}/removeMaintenance/${id}`);
            setMaintenance(maintenance.filter(record => record.maintenance_id !== id));
            alert("Maintenance record deleted successfully!");
            setIsLoading(false);
        } catch (err) {
            console.error(err);
            setIsLoading(false);
        }
    };

    // Toggle edit dialog
    const toggleDialog = (data: MaintenanceI) => {
        const dialog = document.querySelectorAll(`.dialog-${data.maintenance_id}`);
        if (dialog.length !== 0) {
            setUpdateDataForm({
                vehicle_id: data.vehicle_id.toString(),
                maintenance_type: data.maintenance_type,
                description: data.description,
                scheduled_date: data.scheduled_date,
                completed_date: data.completed_date || "",
                cost: data.cost?.toString() || "",
                service_provider: data.service_provider || "",
                technician_name: data.technician_name || "",
                status: data.status,
                mileage: data.mileage?.toString() || "",
                notes: data.notes || ""
            });
            dialog.forEach((item) => item.classList.toggle('show-dialog'));
        }
    };

    useEffect(() => {
        fetchMaintenance();
    }, []);

    return (
        <div className="viewitems w-full overflow-x-hidden">
            <div className="max-w-[85rem] h-lvh mx-auto">
                <div className="flex flex-col">
                    <div className="-m-1.5 overflow-x-hidden">
                        <div className="min-w-full inline-block align-middle w-full">
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-neutral-900 dark:border-neutral-700 lg:p-10">
                                {/* Header */}
                                <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                                            Maintenance Records
                                        </h2>
                                        <p className="text-sm text-gray-600 dark:text-neutral-400">
                                            Create, edit and delete maintenance records.
                                        </p>
                                    </div>
                                    <div>
                                        <div className="inline-flex gap-x-2">
                                            <button
                                                type="button"
                                                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                                aria-haspopup="dialog"
                                                aria-expanded="false"
                                                aria-controls="hs-focus-management-modal"
                                                data-hs-overlay="#hs-focus-management-modal"
                                            >
                                                Add Maintenance
                                            </button>
                                            {/* Add Maintenance Modal */}
                                            <div
                                                id="hs-focus-management-modal"
                                                className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none"
                                                role="dialog"
                                                tabIndex={-1}
                                                aria-labelledby="hs-focus-management-modal-label"
                                            >
                                                <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
                                                    <div className="flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
                                                        <form onSubmit={registerMaintenance}>
                                                            <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
                                                                <h3 className="font-bold text-gray-800 dark:text-white">
                                                                    Maintenance Registration
                                                                </h3>
                                                                <button
                                                                    type="button"
                                                                    className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600"
                                                                    aria-label="Close"
                                                                    data-hs-overlay="#hs-focus-management-modal"
                                                                >
                                                                    <span className="sr-only">Close</span>
                                                                    <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                                                        <path d="M18 6 6 18" />
                                                                        <path d="m6 6 12 12" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                            <div className="p-4 overflow-y-auto space-y-4">
                                                                {/* Vehicle ID */}
                                                                <div>
                                                                    <label className="block text-sm font-medium mb-2 dark:text-white">Vehicle ID</label>
                                                                    <input
                                                                        onChange={(e) => setAddDataForm({...addDataForm, vehicle_id: e.target.value})}
                                                                        value={addDataForm.vehicle_id}
                                                                        type="number"
                                                                        required
                                                                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                        placeholder="Enter vehicle ID"
                                                                    />
                                                                </div>

                                                                {/* Maintenance Type */}
                                                                <div>
                                                                    <label className="block text-sm font-medium mb-2 dark:text-white">Maintenance Type</label>
                                                                    <select
                                                                        onChange={(e) => setAddDataForm({...addDataForm, maintenance_type: e.target.value})}
                                                                        value={addDataForm.maintenance_type}
                                                                        className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                                                        required
                                                                    >
                                                                        <option value="routine">Routine</option>
                                                                        <option value="repair">Repair</option>
                                                                        <option value="overhaul">Overhaul</option>
                                                                        <option value="inspection">Inspection</option>
                                                                    </select>
                                                                </div>

                                                                {/* Description */}
                                                                <div>
                                                                    <label className="block text-sm font-medium mb-2 dark:text-white">Description</label>
                                                                    <textarea
                                                                        onChange={(e) => setAddDataForm({...addDataForm, description: e.target.value})}
                                                                        value={addDataForm.description}
                                                                        required
                                                                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                        placeholder="Enter description"
                                                                        rows={3}
                                                                    />
                                                                </div>

                                                                {/* Dates */}
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <label className="block text-sm font-medium mb-2 dark:text-white">Scheduled Date</label>
                                                                        <input
                                                                            onChange={(e) => setAddDataForm({...addDataForm, scheduled_date: e.target.value})}
                                                                            value={formatDateForInput(addDataForm.scheduled_date)}
                                                                            type="date"
                                                                            required
                                                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-medium mb-2 dark:text-white">Completed Date</label>
                                                                        <input
                                                                            onChange={(e) => setAddDataForm({...addDataForm, completed_date: e.target.value})}
                                                                            value={formatDateForInput(addDataForm.completed_date)}
                                                                            type="date"
                                                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                {/* Cost and Mileage */}
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <label className="block text-sm font-medium mb-2 dark:text-white">Cost</label>
                                                                        <input
                                                                            onChange={(e) => setAddDataForm({...addDataForm, cost: e.target.value})}
                                                                            value={addDataForm.cost}
                                                                            type="number"
                                                                            step="0.01"
                                                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                            placeholder="Enter cost"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-medium mb-2 dark:text-white">Mileage</label>
                                                                        <input
                                                                            onChange={(e) => setAddDataForm({...addDataForm, mileage: e.target.value})}
                                                                            value={addDataForm.mileage}
                                                                            type="number"
                                                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                            placeholder="Enter mileage"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                {/* Service Provider and Technician */}
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <label className="block text-sm font-medium mb-2 dark:text-white">Service Provider</label>
                                                                        <input
                                                                            onChange={(e) => setAddDataForm({...addDataForm, service_provider: e.target.value})}
                                                                            value={addDataForm.service_provider}
                                                                            type="text"
                                                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                            placeholder="Enter service provider"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-medium mb-2 dark:text-white">Technician Name</label>
                                                                        <input
                                                                            onChange={(e) => setAddDataForm({...addDataForm, technician_name: e.target.value})}
                                                                            value={addDataForm.technician_name}
                                                                            type="text"
                                                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                            placeholder="Enter technician name"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                {/* Status */}
                                                                <div>
                                                                    <label className="block text-sm font-medium mb-2 dark:text-white">Status</label>
                                                                    <select
                                                                        onChange={(e) => setAddDataForm({...addDataForm, status: e.target.value})}
                                                                        value={addDataForm.status}
                                                                        className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                                                        required
                                                                    >
                                                                        <option value="scheduled">Scheduled</option>
                                                                        <option value="in_progress">In Progress</option>
                                                                        <option value="completed">Completed</option>
                                                                        <option value="cancelled">Cancelled</option>
                                                                    </select>
                                                                </div>

                                                                {/* Notes */}
                                                                <div>
                                                                    <label className="block text-sm font-medium mb-2 dark:text-white">Notes</label>
                                                                    <textarea
                                                                        onChange={(e) => setAddDataForm({...addDataForm, notes: e.target.value})}
                                                                        value={addDataForm.notes}
                                                                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                        placeholder="Enter notes"
                                                                        rows={3}
                                                                    />
                                                                </div>
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
                                                    <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">ID</span>
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-start">
                                                    <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">Vehicle ID</span>
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-start">
                                                    <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">Type</span>
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-start">
                                                    <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">Description</span>
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-start">
                                                    <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">Scheduled</span>
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-start">
                                                    <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">Status</span>
                                                </th>
                                                {user?.role !== "3" && <th scope="col" className="px-6 py-3 text-end" />}
                                            </tr>
                                        </thead>
                                        {data.length === 0 ? (
                                            <tbody>
                                                <tr>
                                                    <td colSpan={7} className="text-center py-8">
                                                        <div className="h-96 w-full flex items-center justify-center">
                                                            <h1 className="text-lg">No Records Found</h1>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        ) : (
                                            data.map((record) => (
                                                <React.Fragment key={record.maintenance_id}>
                                                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                                                        <tr className="bg-white hover:bg-gray-50 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                                                            <td className="size-px whitespace-nowrap">
                                                                <div className="px-6 py-2">
                                                                    <p className="text-sm text-gray-500 dark:text-neutral-500">
                                                                        {record.maintenance_id}
                                                                    </p>
                                                                </div>
                                                            </td>
                                                            <td className="size-px whitespace-nowrap">
                                                                <div className="px-6 py-2">
                                                                    <p className="text-sm text-gray-500 dark:text-neutral-500">
                                                                        {record.vehicle_id}
                                                                    </p>
                                                                </div>
                                                            </td>
                                                            <td className="size-px whitespace-nowrap">
                                                                <div className="px-6 py-2">
                                                                    <p className="text-sm text-gray-500 dark:text-neutral-500">
                                                                        {record.maintenance_type.charAt(0).toUpperCase() + record.maintenance_type.slice(1)}
                                                                    </p>
                                                                </div>
                                                            </td>
                                                            <td className="size-px whitespace-nowrap">
                                                                <div className="px-6 py-2">
                                                                    <p className="text-sm text-gray-500 dark:text-neutral-500 line-clamp-2">
                                                                        {record.description}
                                                                    </p>
                                                                </div>
                                                            </td>
                                                            <td className="size-px whitespace-nowrap">
                                                                <div className="px-6 py-2">
                                                                    <p className="text-sm text-gray-500 dark:text-neutral-500">
                                                                        {new Date(record.scheduled_date).toLocaleDateString()}
                                                                    </p>
                                                                </div>
                                                            </td>
                                                            <td className="size-px whitespace-nowrap">
                                                                <div className="px-6 py-2">
                                                                    <span className={`inline-flex items-center gap-1.5 py-1 px-2 rounded-full text-xs font-medium ${
                                                                        record.status === 'scheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500' :
                                                                        record.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500' :
                                                                        record.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500' :
                                                                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500'
                                                                    }`}>
                                                                        {record.status.replace('_', ' ').charAt(0).toUpperCase() + record.status.replace('_', ' ').slice(1)}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            {user?.role !== "3" && (
                                                                <>
                                                                    <td className="size-px whitespace-nowrap">
                                                                        <div className="px-6 py-1.5">
                                                                            <button
                                                                                onClick={() => removeMaintenance(record.maintenance_id)}
                                                                                className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
                                                                            >
                                                                                Delete
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                    <td className="size-px whitespace-nowrap">
                                                                        <div className="px-6 py-1.5">
                                                                            <button
                                                                                onClick={() => toggleDialog(record)}
                                                                                className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
                                                                            >
                                                                                Edit
                                                                            </button>
                                                                        </div>
                                                                        {/* Edit Dialog */}
                                                                        <div className={`dialog-container dialog-${record.maintenance_id}`} id="dialog-1">
                                                                            <div className={`dialog-container dialog-${record.maintenance_id} bg-neutral-900 opacity-5 size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y`}></div>
                                                                            <div className={`dialog-container dialog-${record.maintenance_id} size-full fixed top-0 start-0 z-[81] overflow-x-hidden overflow-y`}>
                                                                                <div className={`dialog-container dialog-${record.maintenance_id} ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto`}>
                                                                                    <div className="flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
                                                                                        <form onSubmit={(e) => updateMaintenance(e, record.maintenance_id)}>
                                                                                            <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
                                                                                                <h3 className="font-bold text-gray-800 dark:text-white">Maintenance Update</h3>
                                                                                                <button
                                                                                                    onClick={() => toggleDialog(record)}
                                                                                                    type="button"
                                                                                                    className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600"
                                                                                                >
                                                                                                    <span className="sr-only">Close</span>
                                                                                                    <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                                                                                        <path d="M18 6 6 18" />
                                                                                                        <path d="m6 6 12 12" />
                                                                                                    </svg>
                                                                                                </button>
                                                                                            </div>
                                                                                            <div className="p-4 overflow-y-auto space-y-4">
                                                                                                {/* Vehicle ID */}
                                                                                                <div>
                                                                                                    <label className="block text-sm font-medium mb-2 dark:text-white">Vehicle ID</label>
                                                                                                    <input
                                                                                                        onChange={(e) => setUpdateDataForm({...updateDataForm, vehicle_id: e.target.value})}
                                                                                                        value={updateDataForm.vehicle_id}
                                                                                                        type="number"
                                                                                                        required
                                                                                                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                                                        placeholder="Enter vehicle ID"
                                                                                                    />
                                                                                                </div>

                                                                                                {/* Maintenance Type */}
                                                                                                <div>
                                                                                                    <label className="block text-sm font-medium mb-2 dark:text-white">Maintenance Type</label>
                                                                                                    <select
                                                                                                        onChange={(e) => setUpdateDataForm({...updateDataForm, maintenance_type: e.target.value})}
                                                                                                        value={updateDataForm.maintenance_type}
                                                                                                        className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                                                                                        required
                                                                                                    >
                                                                                                        <option value="routine">Routine</option>
                                                                                                        <option value="repair">Repair</option>
                                                                                                        <option value="overhaul">Overhaul</option>
                                                                                                        <option value="inspection">Inspection</option>
                                                                                                    </select>
                                                                                                </div>

                                                                                                {/* Description */}
                                                                                                <div>
                                                                                                    <label className="block text-sm font-medium mb-2 dark:text-white">Description</label>
                                                                                                    <textarea
                                                                                                        onChange={(e) => setUpdateDataForm({...updateDataForm, description: e.target.value})}
                                                                                                        value={updateDataForm.description}
                                                                                                        required
                                                                                                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                                                        placeholder="Enter description"
                                                                                                        rows={3}
                                                                                                    />
                                                                                                </div>

                                                                                                {/* Dates */}
                                                                                                <div className="grid grid-cols-2 gap-4">
                                                                                                    <div>
                                                                                                        <label className="block text-sm font-medium mb-2 dark:text-white">Scheduled Date</label>
                                                                                                        <input
                                                                                                            onChange={(e) => setUpdateDataForm({...updateDataForm, scheduled_date: e.target.value})}
                                                                                                            value={formatDateForInput(updateDataForm.scheduled_date)}
                                                                                                            type="date"
                                                                                                            required
                                                                                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div>
                                                                                                        <label className="block text-sm font-medium mb-2 dark:text-white">Completed Date</label>
                                                                                                        <input
                                                                                                            onChange={(e) => setUpdateDataForm({...updateDataForm, completed_date: e.target.value})}
                                                                                                            value={formatDateForInput(updateDataForm.completed_date)}
                                                                                                            type="date"
                                                                                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                                                        />
                                                                                                    </div>
                                                                                                </div>

                                                                                                {/* Cost and Mileage */}
                                                                                                <div className="grid grid-cols-2 gap-4">
                                                                                                    <div>
                                                                                                        <label className="block text-sm font-medium mb-2 dark:text-white">Cost</label>
                                                                                                        <input
                                                                                                            onChange={(e) => setUpdateDataForm({...updateDataForm, cost: e.target.value})}
                                                                                                            value={updateDataForm.cost}
                                                                                                            type="number"
                                                                                                            step="0.01"
                                                                                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                                                            placeholder="Enter cost"
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div>
                                                                                                        <label className="block text-sm font-medium mb-2 dark:text-white">Mileage</label>
                                                                                                        <input
                                                                                                            onChange={(e) => setUpdateDataForm({...updateDataForm, mileage: e.target.value})}
                                                                                                            value={updateDataForm.mileage}
                                                                                                            type="number"
                                                                                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                                                            placeholder="Enter mileage"
                                                                                                        />
                                                                                                    </div>
                                                                                                </div>

                                                                                                {/* Service Provider and Technician */}
                                                                                                <div className="grid grid-cols-2 gap-4">
                                                                                                    <div>
                                                                                                        <label className="block text-sm font-medium mb-2 dark:text-white">Service Provider</label>
                                                                                                        <input
                                                                                                            onChange={(e) => setUpdateDataForm({...updateDataForm, service_provider: e.target.value})}
                                                                                                            value={updateDataForm.service_provider}
                                                                                                            type="text"
                                                                                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                                                            placeholder="Enter service provider"
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div>
                                                                                                        <label className="block text-sm font-medium mb-2 dark:text-white">Technician Name</label>
                                                                                                        <input
                                                                                                            onChange={(e) => setUpdateDataForm({...updateDataForm, technician_name: e.target.value})}
                                                                                                            value={updateDataForm.technician_name}
                                                                                                            type="text"
                                                                                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                                                            placeholder="Enter technician name"
                                                                                                        />
                                                                                                    </div>
                                                                                                </div>

                                                                                                {/* Status */}
                                                                                                <div>
                                                                                                    <label className="block text-sm font-medium mb-2 dark:text-white">Status</label>
                                                                                                    <select
                                                                                                        onChange={(e) => setUpdateDataForm({...updateDataForm, status: e.target.value})}
                                                                                                        value={updateDataForm.status}
                                                                                                        className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                                                                                        required
                                                                                                    >
                                                                                                        <option value="scheduled">Scheduled</option>
                                                                                                        <option value="in_progress">In Progress</option>
                                                                                                        <option value="completed">Completed</option>
                                                                                                        <option value="cancelled">Cancelled</option>
                                                                                                    </select>
                                                                                                </div>

                                                                                                {/* Notes */}
                                                                                                <div>
                                                                                                    <label className="block text-sm font-medium mb-2 dark:text-white">Notes</label>
                                                                                                    <textarea
                                                                                                        onChange={(e) => setUpdateDataForm({...updateDataForm, notes: e.target.value})}
                                                                                                        value={updateDataForm.notes}
                                                                                                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                                                        placeholder="Enter notes"
                                                                                                        rows={3}
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-neutral-700">
                                                                                                <button
                                                                                                    className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                                                                                                    onClick={() => toggleDialog(record)}
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
                                                                </>
                                                            )}
                                                        </tr>
                                                    </tbody>
                                                </React.Fragment>
                                            ))
                                        )}
                                    </table>
                                </div>
                                {/* End Table */}

                                {/* Footer */}
                                <div className="items-center justify-center px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-neutral-700">
                                    <div>
                                        <p className="text-center sm:text-left text-sm text-gray-600 dark:text-neutral-400">
                                            <span className="font-semibold text-gray-800 dark:text-neutral-200">
                                                {maintenance.length}
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
                                                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
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
                                                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
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
            </div>
        </div>
    );
};