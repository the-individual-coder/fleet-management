import axios from "axios";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { OutletContextType } from "../layouts/MainLayout";
import React from "react";

export default interface ReservationI {
  reservation_id: number;
  vehicle_id: number;
  vehicle_name: string;
  plate_number: string;
  user_name: string;
  purpose: string;
  start_date: string;
  end_date: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  approved_by: string | null;
  created_at: string;
  actual_start_date: string | null;
  actual_end_date: string | null;
  mileage_before: number | null;
  mileage_after: number | null;
}

export const Reservations = () => {
  const hostServer = import.meta.env.VITE_SERVER_HOST;
  const { setIsLoading, user } = useOutletContext<OutletContextType>();
  const [reservations, setReservations] = useState<ReservationI[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const lastIndexPage = currentPage * itemsPerPage;
  const firstIndexPage = lastIndexPage - itemsPerPage;
  const data = reservations?.slice(firstIndexPage, lastIndexPage);
  const totalPages = Math.ceil(reservations.length / itemsPerPage);

  function formatDateForInput(dateTime:any) {
    if (!dateTime) return ""; // Return empty if no value
  
    // Check if the input is a Date object, convert to ISO string
    if (dateTime instanceof Date) {
      return dateTime.toISOString().slice(0, 16);
    }
  
    // If the input is a string in "YYYY-MM-DD HH:MM:SS" format
    return dateTime.replace(" ", "T").slice(0, 16);
  }

  const formatReadableDate = (dateTime: string | Date): string => {
    if (!dateTime) return "";
  
    // Convert string "YYYY-MM-DD HH:MM:SS" to Date object
    const dateObj = new Date(
      typeof dateTime === "string" ? dateTime.replace(" ", "T") : dateTime
    );
  
    // Ensure valid date
    if (isNaN(dateObj.getTime())) return "Invalid date";
  
    // Correctly type options for TypeScript
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Ensures AM/PM format
    };
  
    return dateObj.toLocaleString("en-US", options);
  };

  
  const [addDataForm, setAddDataForm] = useState({
    vehicle_id: "",
    user_name: "",
    purpose: "",
    start_date: "",
    end_date: ""
  });

  const [updateDataForm, setUpdateDataForm] = useState({
    vehicle_id: "",
    user_name: "",
    purpose: "",
    start_date: "",
    end_date: "",
    status: "pending"
  });

  const [completionForm, setCompletionForm] = useState({
    actual_start_date: "",
    actual_end_date: "",
    mileage_before: "",
    mileage_after: ""
  });

  // Fetch all reservations with vehicle names
  const fetchReservations = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${hostServer}/getReservations`);
      setReservations(response.data);
    } catch (err) {
      console.error("Error fetching reservations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch vehicles for dropdown
  const fetchVehicles = async () => {
    try {
      const response = await axios.get(`${hostServer}/getVehicles`);
      console.log("the res", response)
      setVehicles(response.data);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
    }
  };

  // Create new reservation
  const createReservation = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const res = await axios.post(`${hostServer}/createReservation`, addDataForm);
      console.log("tesdasd", res)
      if(res.data.error){
        alert(res.data.error)
      }else{
        fetchReservations();
        alert("Reservation created successfully!");
        setAddDataForm({
          vehicle_id: "",
          user_name: "",
          purpose: "",
          start_date: "",
          end_date: ""
        });
        (document.getElementById('hs-reservation-modal') as HTMLElement)?.classList.add('hidden');
      }

    } catch (err) {
      console.error("Error creating reservation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update reservation status
  const updateStatus = async (reservation_id: number, status: string) => {
    try {
      setIsLoading(true);
      await axios.post(`${hostServer}/updateReservationStatus`, {
        reservation_id,
        status,
        approved_by: user.username
      });
      fetchReservations();
      alert(`Reservation ${status} successfully!`);
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Complete reservation
  const completeReservation = async (reservation_id: number) => {
    try {
      setIsLoading(true);
      await axios.post(`${hostServer}/completeReservation`, {
        reservation_id,
        ...completionForm
      });
      fetchReservations();
      alert("Reservation marked as completed!");
      setCompletionForm({
        actual_start_date: "",
        actual_end_date: "",
        mileage_before: "",
        mileage_after: ""
      });
      (document.getElementById(`hs-completion-modal-${reservation_id}`) as HTMLElement)?.classList.add('hidden');
    } catch (err) {
      console.error("Error completing reservation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update reservation details
  const updateReservation = async (e: React.FormEvent, reservation_id: number) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      await axios.post(`${hostServer}/updateReservation`, {
        ...updateDataForm,
        reservation_id
      });
      fetchReservations();
      alert("Reservation updated successfully!");
      toggleDialog(null);
    } catch (err) {
      console.error("Error updating reservation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel reservation
  const cancelReservation = async (reservation_id: number) => {
    if (confirm("Are you sure you want to cancel this reservation?")) {
      try {
        setIsLoading(true);
        await axios.post(`${hostServer}/cancelReservation`, { reservation_id });
        fetchReservations();
        alert("Reservation cancelled successfully!");
      } catch (err) {
        console.error("Error cancelling reservation:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Delete reservation
  const deleteReservation = async (reservation_id: number) => {
    if (confirm("Are you sure you want to delete this reservation?")) {
      try {
        setIsLoading(true);
        await axios.delete(`${hostServer}/deleteReservation/${reservation_id}`);
        setReservations(reservations.filter(res => res.reservation_id !== reservation_id));
        alert("Reservation deleted successfully!");
      } catch (err) {
        console.error("Error deleting reservation:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Toggle edit dialog
  const toggleDialog = (reservation: ReservationI | null) => {
    if (reservation) {
      setUpdateDataForm({
        vehicle_id: reservation.vehicle_id.toString(),
        user_name: reservation.user_name,
        purpose: reservation.purpose,
        start_date: reservation.start_date,
        end_date: reservation.end_date,
        status: reservation.status
      });
      const dialog = document.querySelector(`.dialog-${reservation.reservation_id}`);
      dialog?.classList.toggle('show-dialog');
    } else {
      const dialogs = document.querySelectorAll('[class^="dialog-"]');
      dialogs.forEach(dialog => dialog.classList.remove('show-dialog'));
    }
  };


  useEffect(() => {
    fetchReservations();
    fetchVehicles();
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
                      Vehicle Reservations
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                      Manage vehicle bookings and approvals.
                    </p>
                  </div>
                  <div>
                    <div className="inline-flex gap-x-2">
                      <button
                        type="button"
                        className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                        aria-haspopup="dialog"
                        aria-expanded="false"
                        aria-controls="hs-reservation-modal"
                        data-hs-overlay="#hs-reservation-modal"
                      >
                        New Reservation
                      </button>
                      
                      {/* New Reservation Modal */}
                      <div
                        id="hs-reservation-modal"
                        className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none"
                        role="dialog"
                        tabIndex={-1}
                        aria-labelledby="hs-reservation-modal-label"
                      >
                        <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
                          <div className="flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
                            <form onSubmit={createReservation}>
                              <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
                                <h3 className="font-bold text-gray-800 dark:text-white">
                                  New Vehicle Reservation
                                </h3>
                                <button
                                  type="button"
                                  className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600"
                                  aria-label="Close"
                                  data-hs-overlay="#hs-reservation-modal"
                                >
                                  <span className="sr-only">Close</span>
                                  <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6 6 18" />
                                    <path d="m6 6 12 12" />
                                  </svg>
                                </button>
                              </div>
                              <div className="p-4 overflow-y-auto">
                                <label className="block text-sm font-medium mb-2 dark:text-white">Vehicle</label>
                                <select
                                  value={addDataForm.vehicle_id}
                                  onChange={(e) => setAddDataForm({...addDataForm, vehicle_id: e.target.value})}
                                  required
                                  className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                >
                                  <option value="">Select Vehicle</option>
                                  {vehicles.map(vehicle => (
                                    <option key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
                                      {`${vehicle.make} ${vehicle.model} ${vehicle.year} - ${vehicle.license_plate}`}
                                    </option>
                                  ))}
                                </select>

                                <label className="mt-5 block text-sm font-medium mb-2 dark:text-white">User Name</label>
                                <input
                                  type="text"
                                  value={addDataForm.user_name}
                                  onChange={(e) => setAddDataForm({...addDataForm, user_name: e.target.value})}
                                  required
                                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                  placeholder="Enter user name"
                                />

                                <label className="mt-5 block text-sm font-medium mb-2 dark:text-white">Purpose</label>
                                <textarea
                                  value={addDataForm.purpose}
                                  onChange={(e) => setAddDataForm({...addDataForm, purpose: e.target.value})}
                                  required
                                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                  placeholder="Purpose of reservation"
                                  rows={3}
                                ></textarea>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                                  <div>
                                    <label className="block text-sm font-medium mb-2 dark:text-white">Start Date & Time</label>
                                    <input
                                      type="datetime-local"
                                      value={formatDateForInput(addDataForm.start_date)}
                                      onChange={(e) => setAddDataForm({...addDataForm, start_date: e.target.value})}
                                      required
                                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium mb-2 dark:text-white">End Date & Time</label>
                                    <input
                                      type="datetime-local"
                                      value={formatDateForInput(addDataForm.end_date)}
                                      onChange={(e) => setAddDataForm({...addDataForm, end_date: e.target.value})}
                                      required
                                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-neutral-700">
                                <button
                                  type="button"
                                  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                                  data-hs-overlay="#hs-reservation-modal"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                >
                                  Create Reservation
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
                        <th scope="col" className="px-6 py-3 text-start">Vehicle</th>
                        <th scope="col" className="px-6 py-3 text-start">User</th>
                        <th scope="col" className="px-6 py-3 text-start">Purpose</th>
                        <th scope="col" className="px-6 py-3 text-start">Time Period</th>
                        <th scope="col" className="px-6 py-3 text-start">Status</th>
                        {user?.role !== "3" && <th scope="col" className="px-6 py-3 text-end">Actions</th>}
                      </tr>
                    </thead>
                    {data.length === 0 ? (
                      <tbody>
                        <tr>
                          <td colSpan={7} className="text-center py-8">
                            <div className="h-96 w-full flex items-center justify-center">
                              <h1 className="text-lg">No Reservations Found</h1>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    ) : (
                      <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                        {data.map((reservation) => (
                          <tr key={reservation.reservation_id} className="bg-white hover:bg-gray-50 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-500">
                              {reservation.reservation_id}
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                              <p className="text-sm font-medium text-gray-800 dark:text-neutral-200">
                                {reservation.vehicle_name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-neutral-500">
                                {reservation.plate_number}
                              </p>
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                              <p className="text-sm text-gray-500 dark:text-neutral-500">
                                {reservation.user_name}
                              </p>
                            </td>
                            <td className="px-6 py-2">
                              <p className="text-sm text-gray-500 dark:text-neutral-500 line-clamp-2">
                                {reservation.purpose}
                              </p>
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                              <p className="text-sm text-gray-500 dark:text-neutral-500">
                                {formatReadableDate(reservation.start_date)}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-neutral-500">
                                to {formatReadableDate(reservation.end_date)}
                              </p>
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1.5 py-1 px-2 rounded-full text-xs font-medium 
                                ${reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                                  reservation.status === 'approved' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                  reservation.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                  reservation.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                                {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                              </span>
                            </td>
                            {user?.role !== "3" && (
                              <td className="px-6 py-2 whitespace-nowrap text-end">
                                <div className="flex gap-2 justify-end">
                                  {reservation.status === 'pending' && (
                                    <>
                                      <button
                                        onClick={() => updateStatus(reservation.reservation_id, 'approved')}
                                        className="inline-flex items-center gap-x-1 text-sm text-green-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-green-500"
                                      >
                                        Approve
                                      </button>
                                      <button
                                        onClick={() => updateStatus(reservation.reservation_id, 'rejected')}
                                        className="inline-flex items-center gap-x-1 text-sm text-red-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-red-500"
                                      >
                                        Reject
                                      </button>
                                    </>
                                  )}
                                  {reservation.status === 'approved' && (
                                    <>
                                      <button
                                        onClick={() => document.getElementById(`hs-completion-modal-${reservation.reservation_id}`)?.classList.remove('hidden')}
                                        className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
                                      >
                                        Complete
                                      </button>
                                      <button
                                        onClick={() => cancelReservation(reservation.reservation_id)}
                                        className="inline-flex items-center gap-x-1 text-sm text-orange-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-orange-500"
                                      >
                                        Cancel
                                      </button>
                                    </>
                                  )}
                                  <button
                                    onClick={() => toggleDialog(reservation)}
                                    className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => deleteReservation(reservation.reservation_id)}
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
                        {reservations.length}
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
      {data.map((reservation) => (
        <div key={`dialog-${reservation.reservation_id}`} className={`dialog-container dialog-${reservation.reservation_id}`}>
          <div className={`dialog-${reservation.reservation_id} bg-neutral-900 opacity-5 size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y`}></div>
          <div className={`dialog-${reservation.reservation_id} size-full fixed top-0 start-0 z-[81] overflow-x-hidden overflow-y`}>
            <div className={`dialog-${reservation.reservation_id} ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto`}>
              <div className="flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
                <form onSubmit={(e) => updateReservation(e, reservation.reservation_id)}>
                  <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
                    <h3 className="font-bold text-gray-800 dark:text-white">
                      Edit Reservation #{reservation.reservation_id}
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
                    <label className="block text-sm font-medium mb-2 dark:text-white">Vehicle</label>
                    <select
                      value={updateDataForm.vehicle_id}
                      onChange={(e) => setUpdateDataForm({...updateDataForm, vehicle_id: e.target.value})}
                      required
                      className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    >
                      {vehicles.map(vehicle => (
                        <option key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
                          {`${vehicle.make} ${vehicle.model} ${vehicle.year} - ${vehicle.license_plate}`}
                        </option>
                      ))}
                    </select>

                    <label className="mt-5 block text-sm font-medium mb-2 dark:text-white">User Name</label>
                    <input
                      type="text"
                      value={updateDataForm.user_name}
                      onChange={(e) => setUpdateDataForm({...updateDataForm, user_name: e.target.value})}
                      required
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                      placeholder="Enter user name"
                    />

                    <label className="mt-5 block text-sm font-medium mb-2 dark:text-white">Purpose</label>
                    <textarea
                      value={updateDataForm.purpose}
                      onChange={(e) => setUpdateDataForm({...updateDataForm, purpose: e.target.value})}
                      required
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                      placeholder="Purpose of reservation"
                      rows={3}
                    ></textarea>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                      <div>
                        <label className="block text-sm font-medium mb-2 dark:text-white">Start Date & Time</label>
                        <input
                          type="datetime-local"
                          value={formatDateForInput(updateDataForm.start_date)}
                          onChange={(e) => setUpdateDataForm({...updateDataForm, start_date: e.target.value})}
                          required
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 dark:text-white">End Date & Time</label>
                        <input
                          type="datetime-local"
                          value={formatDateForInput(updateDataForm.end_date)}
                          onChange={(e) => setUpdateDataForm({...updateDataForm, end_date: e.target.value})}
                          required
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                        />
                      </div>
                    </div>

                    <label className="mt-5 block text-sm font-medium mb-2 dark:text-white">Status</label>
                    <select
                      value={updateDataForm.status}
                      onChange={(e) => setUpdateDataForm({...updateDataForm, status: e.target.value})}
                      className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
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

      {/* Completion Dialogs */}
      {data.map((reservation) => (
        <div key={`completion-${reservation.reservation_id}`} id={`hs-completion-modal-${reservation.reservation_id}`} className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none">
          <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
            <div className="flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
              <form onSubmit={() => completeReservation(reservation.reservation_id)}>
                <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
                  <h3 className="font-bold text-gray-800 dark:text-white">
                    Complete Reservation #{reservation.reservation_id}
                  </h3>
                  <button
                    type="button"
                    className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600"
                    aria-label="Close"
                    onClick={() => document.getElementById(`hs-completion-modal-${reservation.reservation_id}`)?.classList.add('hidden')}
                  >
                    <span className="sr-only">Close</span>
                    <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-4 overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-white">Actual Start Date</label>
                      <input
                        type="datetime-local"
                        value={formatDateForInput(completionForm.actual_start_date)}
                        onChange={(e) => setCompletionForm({...completionForm, actual_start_date: e.target.value})}
                        required
                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-white">Actual End Date</label>
                      <input
                        type="datetime-local"
                        value={formatDateForInput(completionForm.actual_end_date)}
                        onChange={(e) => setCompletionForm({...completionForm, actual_end_date: e.target.value})}
                        required
                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-white">Mileage Before</label>
                      <input
                        type="number"
                        value={completionForm.mileage_before}
                        onChange={(e) => setCompletionForm({...completionForm, mileage_before: e.target.value})}
                        required
                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                        placeholder="Enter mileage"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-white">Mileage After</label>
                      <input
                        type="number"
                        value={completionForm.mileage_after}
                        onChange={(e) => setCompletionForm({...completionForm, mileage_after: e.target.value})}
                        required
                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                        placeholder="Enter mileage"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-neutral-700">
                  <button
                    type="button"
                    className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                    onClick={() => document.getElementById(`hs-completion-modal-${reservation.reservation_id}`)?.classList.add('hidden')}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:bg-green-700 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    Mark as Completed
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};