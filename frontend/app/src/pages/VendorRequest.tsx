import axios from "axios";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { OutletContextType } from "../layouts/MainLayout";
import VendorI from "./Vendors";
import React from "react";

export default interface VendorRequestI {
    request_id: number;
    vendor_id: number;
    vendor_name: string;
    requested_item: string;
    request_date: string;
    needed_by_date: string;
    status: 'pending' | 'approved' | 'rejected' | 'fulfilled' | 'cancelled';
    approved_by: string | null;
    fulfilled_date: string | null;
    notes: string | null;
}

export const VendorRequests = () => {
    const hostServer = import.meta.env.VITE_SERVER_HOST;
    const { setIsLoading, user } = useOutletContext<OutletContextType>();
    const [requests, setRequests] = useState<VendorRequestI[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [vendors, setVendors] = useState<VendorI[]>([])
    const itemsPerPage = 5;
    const lastIndexPage = currentPage * itemsPerPage;
    const firstIndexPage = lastIndexPage - itemsPerPage;
    const data = requests?.slice(firstIndexPage, lastIndexPage);
    const totalPages = Math.ceil(requests.length / itemsPerPage);

    const formatDateForInput = (date: any) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Add leading zero
        const day = String(d.getDate()).padStart(2, '0');         // Add leading zero
        return `${year}-${month}-${day}`;
    };
    const [addDataForm, setAddDataForm] = useState({
        vendor_id: "",
        requested_item: "",
        needed_by_date: "",
        status: "pending",
        notes: ""
    });

    const [updateDataForm, setUpdateDataForm] = useState({
        vendor_id: "",
        requested_item: "",
        needed_by_date: "",
        status: "pending",
        notes: ""
    });

    // Fetch all vendor requests with vendor names
    const fetchVendorRequests = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${hostServer}/getVendorRequests`);
            setRequests(response.data);
        } catch (err) {
            console.error("Error fetching vendor requests:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch vendors for dropdown
    const fetchVendors = async () => {
        try {
            const response = await axios.get(`${hostServer}/getVendors`);
            setVendors(response.data);
        } catch (err) {
            console.error("Error fetching vendors:", err);
        }
    };

    // Create new vendor request
    const createVendorRequest = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            await axios.post(`${hostServer}/createVendorRequest`, addDataForm);
            fetchVendorRequests();
            alert("Request created successfully!");
            setAddDataForm({
                vendor_id: "",
                requested_item: "",
                needed_by_date: "",
                status: "pending",
                notes: ""
            });
            (document.getElementById('hs-request-modal') as HTMLElement)?.classList.add('hidden');
        } catch (err) {
            console.error("Error creating request:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Update vendor request
    const updateVendorRequest = async (e: React.FormEvent, request_id: number) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            await axios.post(`${hostServer}/updateVendorRequest`, {
                ...updateDataForm,
                request_id
            });
            fetchVendorRequests();
            alert("Request updated successfully!");
            toggleDialog(null);
        } catch (err) {
            console.error("Error updating request:", err);
        } finally {
            setIsLoading(false);
        }
    };


    // Delete vendor request
    const deleteVendorRequest = async (request_id: number) => {
        if (confirm("Are you sure you want to delete this request?")) {
            try {
                setIsLoading(true);
                await axios.delete(`${hostServer}/deleteVendorRequest/${request_id}`);
                setRequests(requests.filter(req => req.request_id !== request_id));
                alert("Request deleted successfully!");
            } catch (err) {
                console.error("Error deleting request:", err);
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Toggle edit dialog
    const toggleDialog = (request: VendorRequestI | null) => {
        if (request) {
            setUpdateDataForm({
                vendor_id: request.vendor_id.toString(),
                requested_item: request.requested_item,
                needed_by_date: request.needed_by_date,
                status: request.status,
                notes: request.notes || ""
            });
            const dialog = document.querySelector(`.dialog-${request.request_id}`);
            dialog?.classList.toggle('show-dialog');
        } else {
            const dialogs = document.querySelectorAll('[class^="dialog-"]');
            dialogs.forEach(dialog => dialog.classList.remove('show-dialog'));
        }
    };

    useEffect(() => {
        fetchVendorRequests();
        fetchVendors();
    }, []);

    return (
        <div className="viewitems w-full overflow-x-hidden">
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
                                            Vendor Requests
                                        </h2>
                                        <p className="text-sm text-gray-600 dark:text-neutral-400">
                                            Manage purchase requests from vendors.
                                        </p>
                                    </div>
                                    <div>
                                        <div className="inline-flex gap-x-2">
                                            <button
                                                type="button"
                                                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                                aria-haspopup="dialog"
                                                aria-expanded="false"
                                                aria-controls="hs-request-modal"
                                                data-hs-overlay="#hs-request-modal"
                                            >
                                                Create Request
                                            </button>
                                            
                                            {/* Create Request Modal */}
                                            <div
                                                id="hs-request-modal"
                                                className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none"
                                                role="dialog"
                                                tabIndex={-1}
                                                aria-labelledby="hs-request-modal-label"
                                            >
                                                <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
                                                    <div className="flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
                                                        <form onSubmit={createVendorRequest}>
                                                            <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
                                                                <h3 className="font-bold text-gray-800 dark:text-white">
                                                                    New Vendor Request
                                                                </h3>
                                                                <button
                                                                    type="button"
                                                                    className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600"
                                                                    aria-label="Close"
                                                                    data-hs-overlay="#hs-request-modal"
                                                                >
                                                                    <span className="sr-only">Close</span>
                                                                    <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                                                        <path d="M18 6 6 18" />
                                                                        <path d="m6 6 12 12" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                            <div className="p-4 overflow-y-auto">
                                                                <label className="block text-sm font-medium mb-2 dark:text-white">Vendor</label>
                                                                <select
                                                                    value={addDataForm.vendor_id}
                                                                    onChange={(e) => setAddDataForm({...addDataForm, vendor_id: e.target.value})}
                                                                    required
                                                                    className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                                                >
                                                                    <option value="">Select Vendor</option>
                                                                    {vendors.map(vendor => (
                                                                        <option key={vendor.vendor_id} value={vendor.vendor_id}>{vendor.name}</option>
                                                                    ))}
                                                                </select>

                                                                <label className="mt-5 block text-sm font-medium mb-2 dark:text-white">Requested Items</label>
                                                                <textarea
                                                                    value={addDataForm.requested_item}
                                                                    onChange={(e) => setAddDataForm({...addDataForm, requested_item: e.target.value})}
                                                                    required
                                                                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                    placeholder="List of requested items"
                                                                    rows={3}
                                                                ></textarea>

                                                                <label className="mt-5 block text-sm font-medium mb-2 dark:text-white">Needed By Date</label>
                                                                <input
                                                                    type="date"
                                                                    value={formatDateForInput(addDataForm.needed_by_date)}
                                                                    onChange={(e) => setAddDataForm({...addDataForm, needed_by_date: e.target.value})}
                                                                    required
                                                                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                />

                                                                <label className="mt-5 block text-sm font-medium mb-2 dark:text-white">Notes</label>
                                                                <textarea
                                                                    value={addDataForm.notes}
                                                                    onChange={(e) => setAddDataForm({...addDataForm, notes: e.target.value})}
                                                                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                    placeholder="Additional notes"
                                                                    rows={2}
                                                                ></textarea>
                                                            </div>
                                                            <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-neutral-700">
                                                                <button
                                                                    type="button"
                                                                    className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                                                                    data-hs-overlay="#hs-request-modal"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    type="submit"
                                                                    className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                                                >
                                                                    Submit Request
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
                                                <th scope="col" className="px-6 py-3 text-start">ID</th>
                                                <th scope="col" className="px-6 py-3 text-start">Vendor</th>
                                                <th scope="col" className="px-6 py-3 text-start">Requested Items</th>
                                                <th scope="col" className="px-6 py-3 text-start">Request Date</th>
                                                <th scope="col" className="px-6 py-3 text-start">Needed By</th>
                                                <th scope="col" className="px-6 py-3 text-start">Status</th>
                                                {user?.role !== "3" && <th scope="col" className="px-6 py-3 text-end">Actions</th>}
                                            </tr>
                                        </thead>
                                        {data.length === 0 ? (
                                            <tbody>
                                                <tr>
                                                    <td colSpan={7} className="text-center py-8">
                                                        <div className="h-96 w-full flex items-center justify-center">
                                                            <h1 className="text-lg">No Requests Found</h1>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        ) : (
                                            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                                                {data.map((request) => (
                                                    <tr key={request.request_id} className="bg-white hover:bg-gray-50 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                                                        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-500">
                                                            {request.request_id}
                                                        </td>
                                                        <td className="px-6 py-2 whitespace-nowrap">
                                                            <p className="text-sm text-gray-500 dark:text-neutral-500">
                                                                {request.vendor_name}
                                                            </p>
                                                        </td>
                                                        <td className="px-6 py-2">
                                                            <p className="text-sm text-gray-500 dark:text-neutral-500 line-clamp-2">
                                                                {request.requested_item}
                                                            </p>
                                                        </td>
                                                        <td className="px-6 py-2 whitespace-nowrap">
                                                            <p className="text-sm text-gray-500 dark:text-neutral-500">
                                                                {new Date(request.request_date).toLocaleDateString()}
                                                            </p>
                                                        </td>
                                                        <td className="px-6 py-2 whitespace-nowrap">
                                                            <p className="text-sm text-gray-500 dark:text-neutral-500">
                                                                {new Date(request.needed_by_date).toLocaleDateString()}
                                                            </p>
                                                        </td>
                                                        <td className="px-6 py-2 whitespace-nowrap">
                                                            <span className={`inline-flex items-center gap-1.5 py-1 px-2 rounded-full text-xs font-medium 
                                                                ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                                                                  request.status === 'approved' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                                                  request.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                                                  request.status === 'fulfilled' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                                                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                            </span>
                                                        </td>
                                                        {user?.role !== "3" && (
                                                            <td className="px-6 py-2 whitespace-nowrap text-end">
                                                                <div className="flex gap-2 justify-end">
                                                                    <button
                                                                        onClick={() => toggleDialog(request)}
                                                                        className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                    <button
                                                                        onClick={() => deleteVendorRequest(request.request_id)}
                                                                        className="inline-flex items-center gap-x-1 text-sm text-red-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-red-500"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        )}
                                    </table>
                                </div>
                                {/* End Table */}

                                {/* Footer */}
                                <div className="items-center justify-center px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-neutral-700">
                                    <div>
                                        <p className="text-center sm:text-left text-sm text-gray-600 dark:text-neutral-400">
                                            <span className="font-semibold text-gray-800 dark:text-neutral-200">
                                                {requests.length}
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
                                            <span className="font-semibold text-sm text-gray-800 dark:text-neutral-200"> 
                                                Page {currentPage} of {totalPages} 
                                            </span>
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
                {/* End Card */}
            </div>
            {/* End Table Section */}

            {/* Edit Dialogs */}
            {data.map((request) => (
                <div key={`dialog-${request.request_id}`} className={`dialog-container dialog-${request.request_id}`}>
                    <div className={`dialog-${request.request_id} bg-neutral-900 opacity-5 size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y`}></div>
                    <div className={`dialog-${request.request_id} size-full fixed top-0 start-0 z-[81] overflow-x-hidden overflow-y`}>
                        <div className={`dialog-${request.request_id} ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto`}>
                            <div className="flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
                                <form onSubmit={(e) => updateVendorRequest(e, request.request_id)}>
                                    <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
                                        <h3 className="font-bold text-gray-800 dark:text-white">
                                            Edit Request #{request.request_id}
                                        </h3>
                                        <button
                                            onClick={() => toggleDialog(null)}
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
                                    <div className="p-4 overflow-y-auto">
                                        <label className="block text-sm font-medium mb-2 dark:text-white">Vendor</label>
                                        <select
                                            value={updateDataForm.vendor_id}
                                            onChange={(e) => setUpdateDataForm({...updateDataForm, vendor_id: e.target.value})}
                                            required
                                            className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                        >
                                            {vendors.map(vendor => (
                                                <option key={vendor.vendor_id} value={vendor.vendor_id}>{vendor.name}</option>
                                            ))}
                                        </select>

                                        <label className="mt-5 block text-sm font-medium mb-2 dark:text-white">Requested Items</label>
                                        <textarea
                                            value={updateDataForm.requested_item}
                                            onChange={(e) => setUpdateDataForm({...updateDataForm, requested_item: e.target.value})}
                                            required
                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                            placeholder="List of requested items"
                                            rows={3}
                                        ></textarea>

                                        <label className="mt-5 block text-sm font-medium mb-2 dark:text-white">Needed By Date</label>
                                        <input
                                            type="date"
                                            value={formatDateForInput(updateDataForm.needed_by_date)}
                                            onChange={(e) => setUpdateDataForm({...updateDataForm, needed_by_date: e.target.value})}
                                            required
                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                        />

                                        <label className="mt-5 block text-sm font-medium mb-2 dark:text-white">Status</label>
                                        <select
                                            value={updateDataForm.status}
                                            onChange={(e) => setUpdateDataForm({...updateDataForm, status: e.target.value})}
                                            className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approved</option>
                                            <option value="rejected">Rejected</option>
                                            <option value="fulfilled">Fulfilled</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>

                                        <label className="mt-5 block text-sm font-medium mb-2 dark:text-white">Notes</label>
                                        <textarea
                                            value={updateDataForm.notes}
                                            onChange={(e) => setUpdateDataForm({...updateDataForm, notes: e.target.value})}
                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                            placeholder="Additional notes"
                                            rows={2}
                                        ></textarea>
                                    </div>
                                    <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-neutral-700">
                                        <button
                                            onClick={() => toggleDialog(null)}
                                            type="button"
                                            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};