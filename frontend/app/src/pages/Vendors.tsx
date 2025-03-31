import axios from "axios";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { OutletContextType } from "../layouts/MainLayout";
import React from "react";
import {useAuditLog} from '../hooks/useAuditLog.ts'
        const { logAction } = useAuditLog(); 
export default interface VendorI {
    vendor_id: number;
    name: string;
    contact_person: string;
    email: string;
    phone: string;
    address: string;
    service_type: 'parts' | 'fuel' | 'maintenance' | 'other';
    is_approved: boolean;
    created_at: string;
}

export const Vendor = () => {
    const hostServer = import.meta.env.VITE_SERVER_HOST;
    const { setIsLoading, user } = useOutletContext<OutletContextType>();
    const [vendors, setVendors] = useState<VendorI[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const lastIndexPage = currentPage * itemsPerPage;
    const firstIndexPage = lastIndexPage - itemsPerPage;
    const data = vendors?.slice(firstIndexPage, lastIndexPage);
    const totalPages = Math.ceil(vendors.length / itemsPerPage);

    const [addDataForm, setAddDataForm] = useState({
        name: "",
        contact_person: "",
        email: "",
        phone: "",
        address: "",
        service_type: "parts",
        is_approved: false
    });

    const [updateDataForm, setUpdateDataForm] = useState({
        name: "",
        contact_person: "",
        email: "",
        phone: "",
        address: "",
        service_type: "parts",
        is_approved: false
    });

    // Fetch all vendors
    const fetchVendors = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${hostServer}/getVendors`);
            setVendors(response.data);
        } catch (err) {
            console.error("Error fetching vendors:", err);
        } finally {
            setIsLoading(false);
        }
    };
// Vendor Management Operations with Logging

// Register new vendor
const registerVendor = async (e: React.FormEvent) => {
    try {
        e.preventDefault();
        setIsLoading(true);
        await axios.post(`${hostServer}/registerVendor`, addDataForm);
        fetchVendors();
        alert("Vendor added successfully!");
        
        logAction(user, `Registered new vendor: ${addDataForm.name} (${addDataForm.service_type}) - Contact: ${addDataForm.contact_person}`);
        
        setAddDataForm({
            name: "",
            contact_person: "",
            email: "",
            phone: "",
            address: "",
            service_type: "parts",
            is_approved: false
        });
        (document.getElementById('hs-focus-management-modal') as HTMLElement)?.classList.add('hidden');
    } catch (err) {
        console.error("Error adding vendor:", err);
    } finally {
        setIsLoading(false);
    }
};

// Update vendor details
const updateVendor = async (e: React.FormEvent, vendor_id: number) => {
    try {
        e.preventDefault();
        setIsLoading(true);
        await axios.post(`${hostServer}/updateVendor`, {
            ...updateDataForm, 
            vendor_id: vendor_id
        });
        fetchVendors();
        alert("Vendor updated successfully!");
        
        logAction(user, `Updated vendor ID ${vendor_id} (${updateDataForm.name || 'name unchanged'}) - Approval: ${updateDataForm.is_approved !== undefined ? updateDataForm.is_approved : 'unchanged'}`);
        
        toggleDialog(null);
    } catch (err) {
        console.error("Error updating vendor:", err);
    } finally {
        setIsLoading(false);
    }
};

// Delete vendor
const removeVendor = async (vendor_id: number) => {
    if (confirm("Are you sure you want to permanently delete this vendor?")) {
        try {
            setIsLoading(true);
            await axios.delete(`${hostServer}/removeVendor/${vendor_id}`);
            setVendors(vendors.filter(vendor => vendor.vendor_id !== vendor_id));
            alert("Vendor deleted successfully!");
            
            logAction(user, `Deleted vendor ID ${vendor_id} (Permanent deletion)`);
            
        } catch (err) {
            console.error("Error deleting vendor:", err);
        } finally {
            setIsLoading(false);
        }
    }
};
    // Toggle approval status
    const toggleApproval = async (vendor_id: number, currentStatus: boolean) => {
        try {
            setIsLoading(true);
            await axios.post(`${hostServer}/toggleVendorApproval`, {
                vendor_id,
                is_approved: !currentStatus
            });
            fetchVendors();
            alert(`Vendor ${!currentStatus ? 'approved' : 'disapproved'} successfully!`);
        } catch (err) {
            console.error("Error toggling approval:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Toggle edit dialog
    const toggleDialog = (data: VendorI | null) => {
        if (data) {
            setUpdateDataForm({
                name: data.name,
                contact_person: data.contact_person,
                email: data.email,
                phone: data.phone,
                address: data.address,
                service_type: data.service_type,
                is_approved: data.is_approved
            });
            const dialog = document.querySelector(`.dialog-${data.vendor_id}`);
            dialog?.classList.toggle('show-dialog');
        } else {
            const dialogs = document.querySelectorAll('[class^="dialog-"]');
            dialogs.forEach(dialog => dialog.classList.remove('show-dialog'));
        }
    };

    useEffect(() => {
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
                                            Vendors Data
                                        </h2>
                                        <p className="text-sm text-gray-600 dark:text-neutral-400">
                                            Manage vendors, edit and approve.
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
                                                Add Vendor
                                            </button>
                                            
                                            {/* Add Vendor Modal */}
                                            <div
                                                id="hs-focus-management-modal"
                                                className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none"
                                                role="dialog"
                                                tabIndex={-1}
                                                aria-labelledby="hs-focus-management-modal-label"
                                            >
                                                <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
                                                    <div className="flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
                                                        <form onSubmit={registerVendor}>
                                                            <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
                                                                <h3 className="font-bold text-gray-800 dark:text-white">
                                                                    Vendor Registration
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
                                                            <div className="p-4 overflow-y-auto">
                                                                {/* Form fields for adding vendor */}
                                                                <label className="block text-sm font-medium mb-2 dark:text-white">Name</label>
                                                                <input
                                                                    onChange={(e) => setAddDataForm({...addDataForm, name: e.target.value})}
                                                                    value={addDataForm.name}
                                                                    type="text"
                                                                    required
                                                                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                    placeholder="Vendor name"
                                                                />

                                                                <label className="mt-5 block text-sm font-medium mb-2 dark:text-white">Contact Person</label>
                                                                <input
                                                                    onChange={(e) => setAddDataForm({...addDataForm, contact_person: e.target.value})}
                                                                    value={addDataForm.contact_person}
                                                                    type="text"
                                                                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                    placeholder="Contact person"
                                                                />

                                                                <label className="mt-5 block text-sm font-medium mb-2 dark:text-white">Email</label>
                                                                <input
                                                                    onChange={(e) => setAddDataForm({...addDataForm, email: e.target.value})}
                                                                    value={addDataForm.email}
                                                                    type="email"
                                                                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                    placeholder="Email address"
                                                                />

                                                                <label className="mt-5 block text-sm font-medium mb-2 dark:text-white">Phone</label>
                                                                <input
                                                                    onChange={(e) => setAddDataForm({...addDataForm, phone: e.target.value})}
                                                                    value={addDataForm.phone}
                                                                    type="tel"
                                                                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                    placeholder="Phone number"
                                                                />

                                                                <label className="mt-5 block text-sm font-medium mb-2 dark:text-white">Address</label>
                                                                <textarea
                                                                    onChange={(e) => setAddDataForm({...addDataForm, address: e.target.value})}
                                                                    value={addDataForm.address}
                                                                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                    placeholder="Full address"
                                                                    rows={3}
                                                                ></textarea>

                                                                <label className="mt-5 block text-sm font-medium mb-2 dark:text-white">Service Type</label>
                                                                <select
                                                                    value={addDataForm.service_type}
                                                                    onChange={(e) => setAddDataForm({...addDataForm, service_type: e.target.value as any})}
                                                                    className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                                                >
                                                                    <option value="parts">Parts</option>
                                                                    <option value="fuel">Fuel</option>
                                                                    <option value="maintenance">Maintenance</option>
                                                                    <option value="other">Other</option>
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
                                                <th scope="col" className="px-6 py-3 text-start">Name</th>
                                                <th scope="col" className="px-6 py-3 text-start">Contact</th>
                                                <th scope="col" className="px-6 py-3 text-start">Email</th>
                                                <th scope="col" className="px-6 py-3 text-start">Phone</th>
                                                <th scope="col" className="px-6 py-3 text-start">Service Type</th>
                                                <th scope="col" className="px-6 py-3 text-start">Status</th>
                                                {user?.role !== "3" && <th scope="col" className="px-6 py-3 text-end">Actions</th>}
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
                                            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                                                {data.map((vendor) => (
                                                    <tr key={vendor.vendor_id} className="bg-white hover:bg-gray-50 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                                                        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-500">
                                                            {vendor.vendor_id}
                                                        </td>
                                                        <td className="px-6 py-2 whitespace-nowrap">
                                                            <p className="text-sm text-gray-500 dark:text-neutral-500">
                                                                {vendor.name}
                                                            </p>
                                                        </td>
                                                        <td className="px-6 py-2 whitespace-nowrap">
                                                            <p className="text-sm text-gray-500 dark:text-neutral-500">
                                                                {vendor.contact_person || '-'}
                                                            </p>
                                                        </td>
                                                        <td className="px-6 py-2 whitespace-nowrap">
                                                            <p className="text-sm text-gray-500 dark:text-neutral-500">
                                                                {vendor.email || '-'}
                                                            </p>
                                                        </td>
                                                        <td className="px-6 py-2 whitespace-nowrap">
                                                            <p className="text-sm text-gray-500 dark:text-neutral-500">
                                                                {vendor.phone || '-'}
                                                            </p>
                                                        </td>
                                                        <td className="px-6 py-2 whitespace-nowrap">
                                                            <span className={`inline-flex items-center gap-1.5 py-1 px-2 rounded-full text-xs font-medium capitalize 
                                                                ${vendor.service_type === 'parts' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 
                                                                  vendor.service_type === 'fuel' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                                  vendor.service_type === 'maintenance' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                                                                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                                                                {vendor.service_type}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-2 whitespace-nowrap">
                                                            <span 
                                                                onClick={() => user?.role !== "3" && toggleApproval(vendor.vendor_id, vendor.is_approved)}
                                                                className={`inline-flex items-center gap-1.5 py-1 px-2 rounded-full text-xs font-medium cursor-pointer 
                                                                    ${vendor.is_approved ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                                                                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}
                                                            >
                                                                {vendor.is_approved ? 'Approved' : 'Pending'}
                                                            </span>
                                                        </td>
                                                        {user?.role !== "3" && (
                                                            <td className="px-6 py-2 whitespace-nowrap text-end">
                                                                <div className="flex gap-2 justify-end">
                                                                    <button
                                                                        onClick={() => toggleDialog(vendor)}
                                                                        className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                    <button
                                                                        onClick={() => removeVendor(vendor.vendor_id)}
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
                                                {vendors.length}
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
            {data.map((vendor) => (
                <div key={`dialog-${vendor.vendor_id}`} className={`dialog-container dialog-${vendor.vendor_id}`}>
                    <div className={`dialog-${vendor.vendor_id} bg-neutral-900 opacity-5 size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y`}></div>
                    <div className={`dialog-${vendor.vendor_id} size-full fixed top-0 start-0 z-[81] overflow-x-hidden overflow-y`}>
                        <div className={`dialog-${vendor.vendor_id} ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto`}>
                            <div className="flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
                                <form onSubmit={(e) => updateVendor(e, vendor.vendor_id)}>
                                    <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
                                        <h3 className="font-bold text-gray-800 dark:text-white">
                                            Edit Vendor
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
                                        <label className="block text-sm font-medium mb-2 dark:text-white">Name</label>
                                        <input
                                            onChange={(e) => setUpdateDataForm({...updateDataForm, name: e.target.value})}
                                            value={updateDataForm.name}
                                            type="text"
                                            required
                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                            placeholder="Vendor name"
                                        />

                                        <label className="mt-5 block text-sm font-medium mb-2 dark:text-white">Contact Person</label>
                                        <input
                                            onChange={(e) => setUpdateDataForm({...updateDataForm, contact_person: e.target.value})}
                                            value={updateDataForm.contact_person}
                                            type="text"
                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                            placeholder="Contact person"
                                        />

                                        <label className="mt-5 block text-sm font-medium mb-2 dark:text-white">Email</label>
                                        <input
                                            onChange={(e) => setUpdateDataForm({...updateDataForm, email: e.target.value})}
                                            value={updateDataForm.email}
                                            type="email"
                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                            placeholder="Email address"
                                        />

                                        <label className="mt-5 block text-sm font-medium mb-2 dark:text-white">Phone</label>
                                        <input
                                            onChange={(e) => setUpdateDataForm({...updateDataForm, phone: e.target.value})}
                                            value={updateDataForm.phone}
                                            type="tel"
                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                            placeholder="Phone number"
                                        />

                                        <label className="mt-5 block text-sm font-medium mb-2 dark:text-white">Address</label>
                                        <textarea
                                            onChange={(e) => setUpdateDataForm({...updateDataForm, address: e.target.value})}
                                            value={updateDataForm.address}
                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                            placeholder="Full address"
                                            rows={3}
                                        ></textarea>

                                        <label className="mt-5 block text-sm font-medium mb-2 dark:text-white">Service Type</label>
                                        <select
                                            value={updateDataForm.service_type}
                                            onChange={(e) => setUpdateDataForm({...updateDataForm, service_type: e.target.value as any})}
                                            className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                        >
                                            <option value="parts">Parts</option>
                                            <option value="fuel">Fuel</option>
                                            <option value="maintenance">Maintenance</option>
                                            <option value="other">Other</option>
                                        </select>

                                        <label className="mt-5 block text-sm font-medium mb-2 dark:text-white">Approval Status</label>
                                        <select
                                            value={updateDataForm.is_approved ? '1' : '0'}
                                            onChange={(e) => setUpdateDataForm({...updateDataForm, is_approved: e.target.value === '1'})}
                                            className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                        >
                                            <option value="0">Pending</option>
                                            <option value="1">Approved</option>
                                        </select>
                                    </div>
                                    <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-neutral-700">
                                        <button
                                            onClick={() => toggleDialog(null)}
                                            type="button"
                                            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
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
            ))}
        </div>
    );
};