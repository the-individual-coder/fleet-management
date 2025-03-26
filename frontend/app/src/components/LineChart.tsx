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
import { Warehouse } from "../pages/Warehousing";
// Register required components for Chart.js
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const LineChart: React.FC = () => {
      const { setIsLoading } = useOutletContext<OutletContextType>()
      const hostServer = import.meta.env.VITE_SERVER_HOST
      const [datas, setDatas] = useState<Warehouse[]>([])
  // Define data type
  const fetchSupplier = async () => {
    try {
        setIsLoading(true);
        const response = await axios.get(`${hostServer}/getWarehouses`);
        setDatas(response.data);
    } catch (err) {
    } finally {
        setIsLoading(false);
    }
};
useEffect(()=>{
  fetchSupplier()
},[])
  const data: ChartData<"line"> = {
    labels: datas.map((e)=>e.name),
    datasets: [
      {
        label: "Stocks",
        data:datas.map((e)=>e.quantity),
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
        text: "Main Warehouse Data",
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


