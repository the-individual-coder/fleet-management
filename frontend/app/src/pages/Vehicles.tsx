import axios from "axios";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { OutletContextType } from "../layouts/MainLayout";
import React from "react";

export default interface VehicleI {
    vehicle_id: number;
    license_plate: string;
    make: string;
    model: string;
    year: number;
    vehicle_type: string;
    current_mileage: number;
    fuel_type: string;
    status: string;
    last_maintenance_date: string;
    next_maintenance_date: string;
    purchase_date: string;
    purchase_price: number;
    notes: string;
}

export const Vehicles = () => {
    const hostServer = import.meta.env.VITE_SERVER_HOST;
    const { setIsLoading, user } = useOutletContext<OutletContextType>();
    const [vehicles, setVehicles] = useState<VehicleI[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const lastIndexPage = currentPage * itemsPerPage;
    const firstIndexPage = lastIndexPage - itemsPerPage;
    const data = vehicles?.slice(firstIndexPage, lastIndexPage);
    const totalPages = Math.ceil(vehicles.length / itemsPerPage);

    const [addDataForm, setAddDataForm] = useState({
        license_plate: "",
        make: "",
        model: "",
        year: "",
        vehicle_type: "",
        current_mileage: "",
        fuel_type: "",
        status: "available",
        last_maintenance_date: "",
        next_maintenance_date: "",
        purchase_date: "",
        purchase_price: "",
        notes: ""
    });

    const [updateDataForm, setUpdateDataForm] = useState({
        license_plate: "",
        make: "",
        model: "",
        year: "",
        vehicle_type: "",
        current_mileage: "",
        fuel_type: "",
        status: "available",
        last_maintenance_date: "",
        next_maintenance_date: "",
        purchase_date: "",
        purchase_price: "",
        notes: ""
    });

    // Function to fetch all vehicles
    const fetchVehicles = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${hostServer}/getVehicles`);
            setVehicles(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Function to register a new vehicle
    const registerVehicle = async (e: any) => {
        try {
            setIsLoading(true);
            e.preventDefault();
            await axios.post(`${hostServer}/registerVehicle`, addDataForm);
            fetchVehicles();
            alert("Vehicle added successfully!");
            setAddDataForm({
                license_plate: "",
                make: "",
                model: "",
                year: "",
                vehicle_type: "",
                current_mileage: "",
                fuel_type: "",
                status: "available",
                last_maintenance_date: "",
                next_maintenance_date: "",
                purchase_date: "",
                purchase_price: "",
                notes: ""
            });
            setIsLoading(false);
        } catch (err) {
            console.error(err);
            setIsLoading(false);
        }
    };

    // Function to update a vehicle
    const updateVehicle = async (e: any, id: number) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            await axios.post(`${hostServer}/updateVehicle`, {
                ...updateDataForm,
                vehicle_id: id
            });
            fetchVehicles();
            alert("Vehicle updated successfully!");
            setIsLoading(false);
        } catch (err) {
            console.error(err);
            setIsLoading(false);
        }
    };

    // Function to delete a vehicle
    const removeVehicle = async (id: number) => {
        try {
            setIsLoading(true);
            await axios.delete(`${hostServer}/removeVehicle/${id}`);
            setVehicles(vehicles.filter(vehicle => vehicle.vehicle_id !== id));
            alert("Vehicle deleted successfully!");
            setIsLoading(false);
        } catch (err) {
            console.error(err);
            setIsLoading(false);
        }
    };

    // Toggle edit dialog
    const toggleDialog = (data: VehicleI) => {
        const dialog = document.querySelectorAll(`.dialog-${data.vehicle_id}`);
        if (dialog.length !== 0) {
            setUpdateDataForm({
                license_plate: data.license_plate,
                make: data.make,
                model: data.model,
                year: data.year.toString(),
                vehicle_type: data.vehicle_type,
                current_mileage: data.current_mileage?.toString() || "",
                fuel_type: data.fuel_type,
                status: data.status,
                last_maintenance_date: data.last_maintenance_date || "",
                next_maintenance_date: data.next_maintenance_date || "",
                purchase_date: data.purchase_date || "",
                purchase_price: data.purchase_price?.toString() || "",
                notes: data.notes || ""
            });
            dialog.forEach((item) => item.classList.toggle('show-dialog'));
        }
    };

    useEffect(() => {
        fetchVehicles();
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
                                            Vehicles Data
                                        </h2>
                                        <p className="text-sm text-gray-600 dark:text-neutral-400">
                                            Create vehicles, edit and delete.
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
                                                Add Vehicle
                                            </button>
                                            {/* Add Vehicle Modal */}
                                            <div
                                                id="hs-focus-management-modal"
                                                className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none"
                                                role="dialog"
                                                tabIndex={-1}
                                                aria-labelledby="hs-focus-management-modal-label"
                                            >
                                                <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
                                                    <div className="flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
                                                        <form onSubmit={registerVehicle}>
                                                            <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
                                                                <h3 className="font-bold text-gray-800 dark:text-white">
                                                                    Vehicle Registration
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
                                                                {/* License Plate */}
                                                                <div>
                                                                    <label className="block text-sm font-medium mb-2 dark:text-white">License Plate</label>
                                                                    <input
                                                                        onChange={(e) => setAddDataForm({...addDataForm, license_plate: e.target.value})}
                                                                        value={addDataForm.license_plate}
                                                                        type="text"
                                                                        required
                                                                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                        placeholder="Enter license plate"
                                                                    />
                                                                </div>

                                                                {/* Make and Model */}
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <label className="block text-sm font-medium mb-2 dark:text-white">Make</label>
                                                                        <input
                                                                            onChange={(e) => setAddDataForm({...addDataForm, make: e.target.value})}
                                                                            value={addDataForm.make}
                                                                            type="text"
                                                                            required
                                                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                            placeholder="Enter make"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-medium mb-2 dark:text-white">Model</label>
                                                                        <input
                                                                            onChange={(e) => setAddDataForm({...addDataForm, model: e.target.value})}
                                                                            value={addDataForm.model}
                                                                            type="text"
                                                                            required
                                                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                            placeholder="Enter model"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                {/* Year and Type */}
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <label className="block text-sm font-medium mb-2 dark:text-white">Year</label>
                                                                        <input
                                                                            onChange={(e) => setAddDataForm({...addDataForm, year: e.target.value})}
                                                                            value={addDataForm.year}
                                                                            type="number"
                                                                            required
                                                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                            placeholder="Enter year"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-medium mb-2 dark:text-white">Vehicle Type</label>
                                                                        <input
                                                                            onChange={(e) => setAddDataForm({...addDataForm, vehicle_type: e.target.value})}
                                                                            value={addDataForm.vehicle_type}
                                                                            type="text"
                                                                            required
                                                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                            placeholder="Enter type"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                {/* Mileage and Fuel Type */}
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <label className="block text-sm font-medium mb-2 dark:text-white">Current Mileage</label>
                                                                        <input
                                                                            onChange={(e) => setAddDataForm({...addDataForm, current_mileage: e.target.value})}
                                                                            value={addDataForm.current_mileage}
                                                                            type="number"
                                                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                            placeholder="Enter mileage"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-medium mb-2 dark:text-white">Fuel Type</label>
                                                                        <select
                                                                            onChange={(e) => setAddDataForm({...addDataForm, fuel_type: e.target.value})}
                                                                            value={addDataForm.fuel_type}
                                                                            className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                                                            required
                                                                        >
                                                                            <option value="">Select fuel type</option>
                                                                            <option value="gasoline">Gasoline</option>
                                                                            <option value="diesel">Diesel</option>
                                                                            <option value="electric">Electric</option>
                                                                            <option value="hybrid">Hybrid</option>
                                                                        </select>
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
                                                                        <option value="available">Available</option>
                                                                        <option value="in_use">In Use</option>
                                                                        <option value="maintenance">Maintenance</option>
                                                                        <option value="out_of_service">Out of Service</option>
                                                                    </select>
                                                                </div>

                                                                {/* Maintenance Dates */}
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <label className="block text-sm font-medium mb-2 dark:text-white">Last Maintenance Date</label>
                                                                        <input
                                                                            onChange={(e) => setAddDataForm({...addDataForm, last_maintenance_date: e.target.value})}
                                                                            value={addDataForm.last_maintenance_date}
                                                                            type="date"
                                                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-medium mb-2 dark:text-white">Next Maintenance Date</label>
                                                                        <input
                                                                            onChange={(e) => setAddDataForm({...addDataForm, next_maintenance_date: e.target.value})}
                                                                            value={addDataForm.next_maintenance_date}
                                                                            type="date"
                                                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                {/* Purchase Info */}
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <label className="block text-sm font-medium mb-2 dark:text-white">Purchase Date</label>
                                                                        <input
                                                                            onChange={(e) => setAddDataForm({...addDataForm, purchase_date: e.target.value})}
                                                                            value={addDataForm.purchase_date}
                                                                            type="date"
                                                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-medium mb-2 dark:text-white">Purchase Price</label>
                                                                        <input
                                                                            onChange={(e) => setAddDataForm({...addDataForm, purchase_price: e.target.value})}
                                                                            value={addDataForm.purchase_price}
                                                                            type="number"
                                                                            step="0.01"
                                                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                            placeholder="Enter price"
                                                                        />
                                                                    </div>
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
                                                    <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">License Plate</span>
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-start">
                                                    <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">Make/Model</span>
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-start">
                                                    <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">Year</span>
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-start">
                                                    <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">Type</span>
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-start">
                                                    <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">Mileage</span>
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
                                                    <td colSpan={8} className="text-center py-8">
                                                        <div className="h-96 w-full flex items-center justify-center">
                                                            <h1 className="text-lg">No Records Found</h1>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        ) : (
                                            data.map((vehicle) => (
                                                <React.Fragment key={vehicle.vehicle_id}>
                                                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                                                        <tr className="bg-white hover:bg-gray-50 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                                                            <td className="size-px whitespace-nowrap">
                                                                <div className="px-6 py-2">
                                                                    <p className="text-sm text-gray-500 dark:text-neutral-500">
                                                                        {vehicle.vehicle_id}
                                                                    </p>
                                                                </div>
                                                            </td>
                                                            <td className="size-px whitespace-nowrap">
                                                                <div className="px-6 py-2">
                                                                    <p className="text-sm text-gray-500 dark:text-neutral-500">
                                                                        {vehicle.license_plate}
                                                                    </p>
                                                                </div>
                                                            </td>
                                                            <td className="size-px whitespace-nowrap">
                                                                <div className="px-6 py-2">
                                                                    <p className="text-sm font-medium text-gray-800 dark:text-neutral-200">
                                                                        {vehicle.make}
                                                                    </p>
                                                                    <p className="text-sm text-gray-500 dark:text-neutral-500">
                                                                        {vehicle.model}
                                                                    </p>
                                                                </div>
                                                            </td>
                                                            <td className="size-px whitespace-nowrap">
                                                                <div className="px-6 py-2">
                                                                    <p className="text-sm text-gray-500 dark:text-neutral-500">
                                                                        {vehicle.year}
                                                                    </p>
                                                                </div>
                                                            </td>
                                                            <td className="size-px whitespace-nowrap">
                                                                <div className="px-6 py-2">
                                                                    <p className="text-sm text-gray-500 dark:text-neutral-500">
                                                                        {vehicle.vehicle_type}
                                                                    </p>
                                                                </div>
                                                            </td>
                                                            <td className="size-px whitespace-nowrap">
                                                                <div className="px-6 py-2">
                                                                    <p className="text-sm text-gray-500 dark:text-neutral-500">
                                                                        {vehicle.current_mileage?.toLocaleString() || '-'}
                                                                    </p>
                                                                </div>
                                                            </td>
                                                            <td className="size-px whitespace-nowrap">
                                                                <div className="px-6 py-2">
                                                                    <span className={`inline-flex items-center gap-1.5 py-1 px-2 rounded-full text-xs font-medium ${
                                                                        vehicle.status === 'available' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500' :
                                                                        vehicle.status === 'in_use' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500' :
                                                                        vehicle.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500' :
                                                                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500'
                                                                    }`}>
                                                                        {vehicle.status.replace('_', ' ').charAt(0).toUpperCase() + vehicle.status.replace('_', ' ').slice(1)}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            {user.role !== "3" && (
                                                                <>
                                                                    <td className="size-px whitespace-nowrap">
                                                                        <div className="px-6 py-1.5">
                                                                            <button
                                                                                onClick={() => removeVehicle(vehicle.vehicle_id)}
                                                                                className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
                                                                            >
                                                                                Delete
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                    <td className="size-px whitespace-nowrap">
                                                                        <div className="px-6 py-1.5">
                                                                            <button
                                                                                onClick={() => toggleDialog(vehicle)}
                                                                                className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
                                                                            >
                                                                                Edit
                                                                            </button>
                                                                        </div>
                                                                        {/* Edit Dialog */}
                                                                        <div className={`dialog-container dialog-${vehicle.vehicle_id}`} id="dialog-1">
                                                                            <div className={`dialog-container dialog-${vehicle.vehicle_id} bg-neutral-900 opacity-5 size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y`}></div>
                                                                            <div className={`dialog-container dialog-${vehicle.vehicle_id} size-full fixed top-0 start-0 z-[81] overflow-x-hidden overflow-y`}>
                                                                                <div className={`dialog-container dialog-${vehicle.vehicle_id} ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto`}>
                                                                                    <div className="flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
                                                                                        <form onSubmit={(e) => updateVehicle(e, vehicle.vehicle_id)}>
                                                                                            <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
                                                                                                <h3 className="font-bold text-gray-800 dark:text-white">Vehicle Update</h3>
                                                                                                <button
                                                                                                    onClick={() => toggleDialog(vehicle)}
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
                                                                                                {/* License Plate */}
                                                                                                <div>
                                                                                                    <label className="block text-sm font-medium mb-2 dark:text-white">License Plate</label>
                                                                                                    <input
                                                                                                        onChange={(e) => setUpdateDataForm({...updateDataForm, license_plate: e.target.value})}
                                                                                                        value={updateDataForm.license_plate}
                                                                                                        type="text"
                                                                                                        required
                                                                                                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                                                        placeholder="Enter license plate"
                                                                                                    />
                                                                                                </div>

                                                                                                {/* Make and Model */}
                                                                                                <div className="grid grid-cols-2 gap-4">
                                                                                                    <div>
                                                                                                        <label className="block text-sm font-medium mb-2 dark:text-white">Make</label>
                                                                                                        <input
                                                                                                            onChange={(e) => setUpdateDataForm({...updateDataForm, make: e.target.value})}
                                                                                                            value={updateDataForm.make}
                                                                                                            type="text"
                                                                                                            required
                                                                                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                                                            placeholder="Enter make"
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div>
                                                                                                        <label className="block text-sm font-medium mb-2 dark:text-white">Model</label>
                                                                                                        <input
                                                                                                            onChange={(e) => setUpdateDataForm({...updateDataForm, model: e.target.value})}
                                                                                                            value={updateDataForm.model}
                                                                                                            type="text"
                                                                                                            required
                                                                                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                                                            placeholder="Enter model"
                                                                                                        />
                                                                                                    </div>
                                                                                                </div>

                                                                                                {/* Year and Type */}
                                                                                                <div className="grid grid-cols-2 gap-4">
                                                                                                    <div>
                                                                                                        <label className="block text-sm font-medium mb-2 dark:text-white">Year</label>
                                                                                                        <input
                                                                                                            onChange={(e) => setUpdateDataForm({...updateDataForm, year: e.target.value})}
                                                                                                            value={updateDataForm.year}
                                                                                                            type="number"
                                                                                                            required
                                                                                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                                                            placeholder="Enter year"
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div>
                                                                                                        <label className="block text-sm font-medium mb-2 dark:text-white">Vehicle Type</label>
                                                                                                        <input
                                                                                                            onChange={(e) => setUpdateDataForm({...updateDataForm, vehicle_type: e.target.value})}
                                                                                                            value={updateDataForm.vehicle_type}
                                                                                                            type="text"
                                                                                                            required
                                                                                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                                                            placeholder="Enter type"
                                                                                                        />
                                                                                                    </div>
                                                                                                </div>

                                                                                                {/* Mileage and Fuel Type */}
                                                                                                <div className="grid grid-cols-2 gap-4">
                                                                                                    <div>
                                                                                                        <label className="block text-sm font-medium mb-2 dark:text-white">Current Mileage</label>
                                                                                                        <input
                                                                                                            onChange={(e) => setUpdateDataForm({...updateDataForm, current_mileage: e.target.value})}
                                                                                                            value={updateDataForm.current_mileage}
                                                                                                            type="number"
                                                                                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                                                            placeholder="Enter mileage"
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div>
                                                                                                        <label className="block text-sm font-medium mb-2 dark:text-white">Fuel Type</label>
                                                                                                        <select
                                                                                                            onChange={(e) => setUpdateDataForm({...updateDataForm, fuel_type: e.target.value})}
                                                                                                            value={updateDataForm.fuel_type}
                                                                                                            className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                                                                                            required
                                                                                                        >
                                                                                                            <option value="gasoline">Gasoline</option>
                                                                                                            <option value="diesel">Diesel</option>
                                                                                                            <option value="electric">Electric</option>
                                                                                                            <option value="hybrid">Hybrid</option>
                                                                                                        </select>
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
                                                                                                        <option value="available">Available</option>
                                                                                                        <option value="in_use">In Use</option>
                                                                                                        <option value="maintenance">Maintenance</option>
                                                                                                        <option value="out_of_service">Out of Service</option>
                                                                                                    </select>
                                                                                                </div>

                                                                                                {/* Maintenance Dates */}
                                                                                                <div className="grid grid-cols-2 gap-4">
                                                                                                    <div>
                                                                                                        <label className="block text-sm font-medium mb-2 dark:text-white">Last Maintenance Date</label>
                                                                                                        <input
                                                                                                            onChange={(e) => setUpdateDataForm({...updateDataForm, last_maintenance_date: e.target.value})}
                                                                                                            value={updateDataForm.last_maintenance_date}
                                                                                                            type="date"
                                                                                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div>
                                                                                                        <label className="block text-sm font-medium mb-2 dark:text-white">Next Maintenance Date</label>
                                                                                                        <input
                                                                                                            onChange={(e) => setUpdateDataForm({...updateDataForm, next_maintenance_date: e.target.value})}
                                                                                                            value={updateDataForm.next_maintenance_date}
                                                                                                            type="date"
                                                                                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                                                        />
                                                                                                    </div>
                                                                                                </div>

                                                                                                {/* Purchase Info */}
                                                                                                <div className="grid grid-cols-2 gap-4">
                                                                                                    <div>
                                                                                                        <label className="block text-sm font-medium mb-2 dark:text-white">Purchase Date</label>
                                                                                                        <input
                                                                                                            onChange={(e) => setUpdateDataForm({...updateDataForm, purchase_date: e.target.value})}
                                                                                                            value={updateDataForm.purchase_date}
                                                                                                            type="date"
                                                                                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div>
                                                                                                        <label className="block text-sm font-medium mb-2 dark:text-white">Purchase Price</label>
                                                                                                        <input
                                                                                                            onChange={(e) => setUpdateDataForm({...updateDataForm, purchase_price: e.target.value})}
                                                                                                            value={updateDataForm.purchase_price}
                                                                                                            type="number"
                                                                                                            step="0.01"
                                                                                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                                                            placeholder="Enter price"
                                                                                                        />
                                                                                                    </div>
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
                                                                                                    onClick={() => toggleDialog(vehicle)}
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
                                                {vehicles.length}
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