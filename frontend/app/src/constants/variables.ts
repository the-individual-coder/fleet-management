interface IMaintenanceIssues {
  value:string,
  label:string
}
export const hostServer = import.meta.env.VITE_SERVER_HOST
export const maintenanceIssues:IMaintenanceIssues[] = [
    // Warehouse & Storage
    { value: "rack_damage", label: "Rack Damage" },
    { value: "floor_damage", label: "Floor Damage" },
    { value: "dock_door", label: "Dock Door Issue" },
    { value: "lighting", label: "Lighting Failure" },
    { value: "hvac", label: "HVAC Problem" },
    { value: "leakage", label: "Water Leakage" },
  
    // Equipment
    { value: "forklift", label: "Forklift Breakdown" },
    { value: "conveyor", label: "Conveyor Malfunction" },
    { value: "scanner", label: "Scanner Failure" },
    { value: "pallet_jack", label: "Pallet Jack Issue" },
    
    // Spare Parts
    { value: "missing_parts", label: "Missing Parts" },
    { value: "corrosion", label: "Corroded Parts" },
    { value: "expired", label: "Expired Components" },
  
    // Safety
    { value: "safety_rails", label: "Broken Safety Rails" },
    { value: "emergency_stop", label: "Faulty Emergency Stop" },
    { value: "fire_extinguisher", label: "Fire Extinguisher Issue" }
  ];

  // src/constants/maintenanceStatus.ts
export type MaintenanceStatus =
| 'pending'
| 'approved'
| 'in_progress'
| 'on_hold'
| 'completed'
| 'rejected'
| 'cancelled';

export const maintenanceStatuses: {
value: MaintenanceStatus;
label: string;
color: string;
nextAllowedStatuses: MaintenanceStatus[];
}[] = [
{
  value: 'pending',
  label: 'Pending Review',
  color: 'orange',
  nextAllowedStatuses: ['approved', 'rejected']
},
{
  value: 'approved',
  label: 'Approved',
  color: 'blue',
  nextAllowedStatuses: ['in_progress', 'cancelled']
},
{
  value: 'in_progress',
  label: 'In Progress',
  color: 'purple',
  nextAllowedStatuses: ['on_hold', 'completed']
},
{
  value: 'on_hold',
  label: 'On Hold',
  color: 'red',
  nextAllowedStatuses: ['in_progress', 'cancelled']
},
{
  value: 'completed',
  label: 'Completed',
  color: 'green',
  nextAllowedStatuses: []
},
{
  value: 'rejected',
  label: 'Rejected',
  color: 'gray',
  nextAllowedStatuses: []
},
{
  value: 'cancelled',
  label: 'Cancelled',
  color: 'gray',
  nextAllowedStatuses: []
}
];