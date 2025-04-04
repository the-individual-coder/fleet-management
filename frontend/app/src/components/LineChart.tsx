import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import { useOutletContext } from "react-router-dom";
import { OutletContextType } from "../layouts/MainLayout";
import axios from "axios";
import VehicleI from "../pages/Vehicles";
// Register required components for Chart.js
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const LineChart: React.FC = () => {
      const { setIsLoading } = useOutletContext<OutletContextType>()
      const hostServer = import.meta.env.VITE_SERVER_HOST
      const [datas, setDatas] = useState<VehicleI[]>([])
  // Define data type
  const fetchSupplier = async () => {
    try {
        setIsLoading(true);
        const response = await axios.get(`${hostServer}/getVehicles`);
        setDatas(response.data);
    } catch (err) {
    } finally {
        setIsLoading(false);
    }
};
const getNumberOfVehicles = () => {
  let res = []
  let avaialable = 0
  let outOfService = 0
  let maintenance = 0
  let inUse = 0
  datas.forEach(element => {
      if (element.status == "available")  avaialable +=1
      else if(element.status == "maintenance") maintenance += 1
      else if(element.status == "in_use") inUse += 1
      else if(element.status == "out_of_service") outOfService +=1
  });
  res = [avaialable, inUse, outOfService, maintenance]
  return res
}
useEffect(()=>{
  fetchSupplier()
},[])
  const data: ChartData<"line"> = {
    labels: ["Available", "In Use", "Out of service", "Maintenance"],
    datasets: [
      {
        label: "Vehicles Status",
        data:getNumberOfVehicles(),
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        borderWidth: 2,
      },
    ],
  };

  // Define options
  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: "Vehicles Data",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;


